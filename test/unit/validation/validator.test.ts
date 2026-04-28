import { describe, it, expect, beforeEach, test } from 'vitest';
import {
  plainCommit,
  plainCommitWithUpstreamException,
  upstreamAndTracker,
  upstreamWithExceptionAndTracker,
} from '../fixtures/commit.fixture';

import {
  IValidatorTestContext,
  validatorContextFixture,
} from '../fixtures/validation/validator.fixture';

import { Commit } from '../../../src/commit';
import { Validator } from '../../../src/validation/validator';

describe('Validator Object', () => {
  beforeEach<IValidatorTestContext>(context => {
    context['no-check-policy'] = validatorContextFixture['no-check-policy'];
    context['only-tracker-policy'] =
      validatorContextFixture['only-tracker-policy'];
    context['only-cherry-pick-policy'] =
      validatorContextFixture['only-cherry-pick-policy'];
    context['systemd-rhel-policy'] =
      validatorContextFixture['systemd-rhel-policy'];
    context['validated-commits'] = validatorContextFixture['validated-commits'];
  });

  it<IValidatorTestContext>('can be instantiated', context => {
    expect(context['no-check-policy']).toBeDefined();
    expect(context['only-tracker-policy']).toBeDefined();
    expect(context['only-cherry-pick-policy']).toBeDefined();
    expect(context['systemd-rhel-policy']).toBeDefined();
  });

  describe('validateCommit()', () => {
    it<IValidatorTestContext>('can validate PR with no-check-policy configuration', async context =>
      expect(
        await context['no-check-policy'].validateCommit(upstreamAndTracker)
      ).toMatchInlineSnapshot(`
        {
          "message": "| https://github.com/org/repo/commit/1111111111111111111111111111111111111111 - _feat: add new feature_ | _no upstream_ |",
          "status": "success",
          "tracker": {
            "data": [],
            "message": "_no tracker_",
            "status": "success",
          },
          "upstream": {
            "data": [],
            "exception": undefined,
            "status": "success",
          },
        }
      `));

    it<IValidatorTestContext>('can validate PR with only-tracker-policy configuration', async context =>
      expect(
        await context['only-tracker-policy'].validateCommit(upstreamAndTracker)
      ).toMatchInlineSnapshot(`
        {
          "message": "| https://github.com/org/repo/commit/1111111111111111111111111111111111111111 - _feat: add new feature_ | _no upstream_ |",
          "status": "success",
          "tracker": {
            "data": [
              {
                "data": {
                  "id": "123",
                  "keyword": "Resolves: #",
                  "type": "bugzilla",
                  "url": "https://bugzilla.redhat.com/show_bug.cgi?id=123",
                },
                "exception": undefined,
              },
            ],
            "message": "[123](https://bugzilla.redhat.com/show_bug.cgi?id=123)",
            "status": "success",
          },
          "upstream": {
            "data": [],
            "exception": undefined,
            "status": "success",
          },
        }
      `));

    it<IValidatorTestContext>('can validate PR with only-cherry-pick-policy configuration', async context =>
      expect(
        await context['only-cherry-pick-policy'].validateCommit(
          upstreamWithExceptionAndTracker
        )
      ).toMatchInlineSnapshot(`
        {
          "message": "| https://github.com/org/repo/commit/1111111111111111111111111111111111111111 - _feat: add new feature_ | \`rhel-only\`</br>upstream-url</br>upstream-url |",
          "status": "success",
          "tracker": {
            "data": [],
            "message": "_no tracker_",
            "status": "success",
          },
          "upstream": {
            "data": [
              {
                "repo": "systemd/systemd",
                "sha": "upstream-sha",
                "url": "upstream-url",
              },
              {
                "repo": "systemd/systemd-stable",
                "sha": "upstream-sha",
                "url": "upstream-url",
              },
            ],
            "exception": "rhel-only",
            "status": "success",
          },
        }
      `));

    it<IValidatorTestContext>('can validate PR with systemd-rhel configuration', async context => {
      expect(
        await context['systemd-rhel-policy'].validateCommit(
          upstreamWithExceptionAndTracker
        )
      ).toMatchInlineSnapshot(`
        {
          "message": "| https://github.com/org/repo/commit/1111111111111111111111111111111111111111 - _feat: add new feature_ | \`rhel-only\`</br>upstream-url</br>upstream-url |",
          "status": "success",
          "tracker": {
            "data": [
              {
                "data": {
                  "id": "123",
                  "keyword": "Resolves: #",
                  "type": "bugzilla",
                  "url": "https://bugzilla.redhat.com/show_bug.cgi?id=123",
                },
                "exception": undefined,
              },
            ],
            "message": "[123](https://bugzilla.redhat.com/show_bug.cgi?id=123)",
            "status": "success",
          },
          "upstream": {
            "data": [
              {
                "repo": "systemd/systemd",
                "sha": "upstream-sha",
                "url": "upstream-url",
              },
              {
                "repo": "systemd/systemd-stable",
                "sha": "upstream-sha",
                "url": "upstream-url",
              },
            ],
            "exception": "rhel-only",
            "status": "success",
          },
        }
      `);

      expect(await context['systemd-rhel-policy'].validateCommit(plainCommit))
        .toMatchInlineSnapshot(`
          {
            "message": "| https://github.com/org/repo/commit/1111111111111111111111111111111111111111 - _feat: add new feature_ | **Missing issue tracker** ✋</br>**Missing upstream reference** ‼️ |",
            "status": "failure",
            "tracker": {
              "data": [],
              "message": "**Missing issue tracker** ✋",
              "status": "failure",
            },
            "upstream": {
              "data": [],
              "exception": undefined,
              "status": "failure",
            },
          }
        `);

      expect(
        await context['systemd-rhel-policy'].validateCommit(
          plainCommitWithUpstreamException
        )
      ).toMatchInlineSnapshot(`
        {
          "message": "| https://github.com/org/repo/commit/1111111111111111111111111111111111111111 - _feat: add new feature_ | **Missing issue tracker** ✋ |",
          "status": "failure",
          "tracker": {
            "data": [],
            "message": "**Missing issue tracker** ✋",
            "status": "failure",
          },
          "upstream": {
            "data": [],
            "exception": "rhel-only",
            "status": "success",
          },
        }
      `);
    });
  });

  describe('validateAll()', () => {
    it<IValidatorTestContext>('no-check-policy configuration', context => {
      const validated = context['no-check-policy'].validateAll(
        context['validated-commits']['no-check-policy']['shouldPass']
      );

      expect(validated.status).toEqual('success');
      expect(validated.tracker).toBeUndefined();
      expect(validated.message).toMatchInlineSnapshot(`
        "Tracker - _no tracker_

        #### The following commits meet all requirements

        | commit | upstream |
        |---|---|
        | https://github.com/org/repo/commit/1111111111111111111111111111111111111111 - _feat: add new feature_ | _no upstream_ |
        | https://github.com/org/repo/commit/1111111111111111111111111111111111111111 - _feat: add new feature_ | _no upstream_ |
        | https://github.com/org/repo/commit/1111111111111111111111111111111111111111 - _feat: add new feature_ | _no upstream_ |
        | https://github.com/org/repo/commit/1111111111111111111111111111111111111111 - _feat: add new feature_ | _no upstream_ |"
      `);
    });

    it<IValidatorTestContext>('only-tracker-policy configuration', context => {
      const validated = context['only-tracker-policy'].validateAll(
        context['validated-commits']['only-tracker-policy']['shouldPass']
      );

      expect(validated.status).toEqual('success');
      expect(validated.tracker).toBeDefined();
      expect(validated.tracker).toMatchInlineSnapshot(`
        {
          "exception": undefined,
          "id": "123",
          "message": "\`github-only\`, [123](https://bugzilla.redhat.com/show_bug.cgi?id=123)",
          "type": "bugzilla",
          "url": "https://bugzilla.redhat.com/show_bug.cgi?id=123",
        }
      `);
      expect(validated.message).toMatchInlineSnapshot(`
        "Tracker - [123](https://bugzilla.redhat.com/show_bug.cgi?id=123)

        #### The following commits meet all requirements

        | commit | upstream |
        |---|---|
        | https://github.com/org/repo/commit/1111111111111111111111111111111111111111 - _feat: add new feature_ | _no upstream_ |
        | https://github.com/org/repo/commit/1111111111111111111111111111111111111111 - _feat: add new feature_ | _no upstream_ |
        | https://github.com/org/repo/commit/1111111111111111111111111111111111111111 - _feat: add new feature_ | _no upstream_ |
        | https://github.com/org/repo/commit/1111111111111111111111111111111111111111 - _feat: add new feature_ | _no upstream_ |
        | https://github.com/org/repo/commit/1111111111111111111111111111111111111111 - _feat: add new feature_ | _no upstream_ |
        | https://github.com/org/repo/commit/1111111111111111111111111111111111111111 - _feat: add new feature_ | _no upstream_ |
        | https://github.com/org/repo/commit/1111111111111111111111111111111111111111 - _feat: add new feature_ | _no upstream_ |"
      `);
    });

    it<IValidatorTestContext>('only-cherry-pick-policy configuration', context => {
      const validated = context['only-cherry-pick-policy'].validateAll(
        context['validated-commits']['only-cherry-pick-policy']['shouldPass']
      );

      expect(
        context['validated-commits']['only-cherry-pick-policy']['shouldPass']
      ).toMatchInlineSnapshot(`
        [
          Commit {
            "metadata": {
              "message": {
                "body": "feat: add new feature

        rhel-only",
                "cherryPick": [],
                "title": "feat: add new feature",
              },
              "sha": "1111111111111111111111111111111111111111",
              "url": "https://github.com/org/repo/commit/1111111111111111111111111111111111111111",
            },
            "validation": {
              "message": "| https://github.com/org/repo/commit/1111111111111111111111111111111111111111 - _feat: add new feature_ | \`rhel-only\` |",
              "status": "success",
              "tracker": {
                "data": [],
                "message": "_no tracker_",
                "status": "success",
              },
              "upstream": {
                "data": [],
                "exception": "rhel-only",
                "status": "success",
              },
            },
          },
          Commit {
            "metadata": {
              "message": {
                "body": "feat: add new feature

        (cherry picked from commit 2222222222222222222222222222222222222222)",
                "cherryPick": [
                  {
                    "sha": "2222222222222222222222222222222222222222",
                  },
                ],
                "title": "feat: add new feature",
              },
              "sha": "1111111111111111111111111111111111111111",
              "url": "https://github.com/org/repo/commit/1111111111111111111111111111111111111111",
            },
            "validation": {
              "message": "| https://github.com/org/repo/commit/1111111111111111111111111111111111111111 - _feat: add new feature_ | upstream-url</br>upstream-url |",
              "status": "success",
              "tracker": {
                "data": [],
                "message": "_no tracker_",
                "status": "success",
              },
              "upstream": {
                "data": [
                  {
                    "repo": "systemd/systemd",
                    "sha": "upstream-sha",
                    "url": "upstream-url",
                  },
                  {
                    "repo": "systemd/systemd-stable",
                    "sha": "upstream-sha",
                    "url": "upstream-url",
                  },
                ],
                "exception": undefined,
                "status": "success",
              },
            },
          },
          Commit {
            "metadata": {
              "message": {
                "body": "feat: add new feature

        rhel-only

        (cherry picked from commit 2222222222222222222222222222222222222222)",
                "cherryPick": [
                  {
                    "sha": "2222222222222222222222222222222222222222",
                  },
                ],
                "title": "feat: add new feature",
              },
              "sha": "1111111111111111111111111111111111111111",
              "url": "https://github.com/org/repo/commit/1111111111111111111111111111111111111111",
            },
            "validation": {
              "message": "| https://github.com/org/repo/commit/1111111111111111111111111111111111111111 - _feat: add new feature_ | \`rhel-only\`</br>upstream-url</br>upstream-url |",
              "status": "success",
              "tracker": {
                "data": [],
                "message": "_no tracker_",
                "status": "success",
              },
              "upstream": {
                "data": [
                  {
                    "repo": "systemd/systemd",
                    "sha": "upstream-sha",
                    "url": "upstream-url",
                  },
                  {
                    "repo": "systemd/systemd-stable",
                    "sha": "upstream-sha",
                    "url": "upstream-url",
                  },
                ],
                "exception": "rhel-only",
                "status": "success",
              },
            },
          },
          Commit {
            "metadata": {
              "message": {
                "body": "feat: add new feature

        (cherry picked from commit 2222222222222222222222222222222222222222)

        Resolves: #123",
                "cherryPick": [
                  {
                    "sha": "2222222222222222222222222222222222222222",
                  },
                ],
                "title": "feat: add new feature",
              },
              "sha": "1111111111111111111111111111111111111111",
              "url": "https://github.com/org/repo/commit/1111111111111111111111111111111111111111",
            },
            "validation": {
              "message": "| https://github.com/org/repo/commit/1111111111111111111111111111111111111111 - _feat: add new feature_ | upstream-url</br>upstream-url |",
              "status": "success",
              "tracker": {
                "data": [],
                "message": "_no tracker_",
                "status": "success",
              },
              "upstream": {
                "data": [
                  {
                    "repo": "systemd/systemd",
                    "sha": "upstream-sha",
                    "url": "upstream-url",
                  },
                  {
                    "repo": "systemd/systemd-stable",
                    "sha": "upstream-sha",
                    "url": "upstream-url",
                  },
                ],
                "exception": undefined,
                "status": "success",
              },
            },
          },
          Commit {
            "metadata": {
              "message": {
                "body": "feat: add new feature

        (cherry picked from commit 2222222222222222222222222222222222222222)

        github-only

        Resolves: #123",
                "cherryPick": [
                  {
                    "sha": "2222222222222222222222222222222222222222",
                  },
                ],
                "title": "feat: add new feature",
              },
              "sha": "1111111111111111111111111111111111111111",
              "url": "https://github.com/org/repo/commit/1111111111111111111111111111111111111111",
            },
            "validation": {
              "message": "| https://github.com/org/repo/commit/1111111111111111111111111111111111111111 - _feat: add new feature_ | upstream-url</br>upstream-url |",
              "status": "success",
              "tracker": {
                "data": [],
                "message": "_no tracker_",
                "status": "success",
              },
              "upstream": {
                "data": [
                  {
                    "repo": "systemd/systemd",
                    "sha": "upstream-sha",
                    "url": "upstream-url",
                  },
                  {
                    "repo": "systemd/systemd-stable",
                    "sha": "upstream-sha",
                    "url": "upstream-url",
                  },
                ],
                "exception": undefined,
                "status": "success",
              },
            },
          },
          Commit {
            "metadata": {
              "message": {
                "body": "feat: add new feature

        (cherry picked from commit 2222222222222222222222222222222222222222)

        Resolves: #123

        rhel-only",
                "cherryPick": [
                  {
                    "sha": "2222222222222222222222222222222222222222",
                  },
                ],
                "title": "feat: add new feature",
              },
              "sha": "1111111111111111111111111111111111111111",
              "url": "https://github.com/org/repo/commit/1111111111111111111111111111111111111111",
            },
            "validation": {
              "message": "| https://github.com/org/repo/commit/1111111111111111111111111111111111111111 - _feat: add new feature_ | \`rhel-only\`</br>upstream-url</br>upstream-url |",
              "status": "success",
              "tracker": {
                "data": [],
                "message": "_no tracker_",
                "status": "success",
              },
              "upstream": {
                "data": [
                  {
                    "repo": "systemd/systemd",
                    "sha": "upstream-sha",
                    "url": "upstream-url",
                  },
                  {
                    "repo": "systemd/systemd-stable",
                    "sha": "upstream-sha",
                    "url": "upstream-url",
                  },
                ],
                "exception": "rhel-only",
                "status": "success",
              },
            },
          },
          Commit {
            "metadata": {
              "message": {
                "body": "feat: add new feature

        (cherry picked from commit 2222222222222222222222222222222222222222)

        github-only

        Resolves: #123

        rhel-only",
                "cherryPick": [
                  {
                    "sha": "2222222222222222222222222222222222222222",
                  },
                ],
                "title": "feat: add new feature",
              },
              "sha": "1111111111111111111111111111111111111111",
              "url": "https://github.com/org/repo/commit/1111111111111111111111111111111111111111",
            },
            "validation": {
              "message": "| https://github.com/org/repo/commit/1111111111111111111111111111111111111111 - _feat: add new feature_ | \`rhel-only\`</br>upstream-url</br>upstream-url |",
              "status": "success",
              "tracker": {
                "data": [],
                "message": "_no tracker_",
                "status": "success",
              },
              "upstream": {
                "data": [
                  {
                    "repo": "systemd/systemd",
                    "sha": "upstream-sha",
                    "url": "upstream-url",
                  },
                  {
                    "repo": "systemd/systemd-stable",
                    "sha": "upstream-sha",
                    "url": "upstream-url",
                  },
                ],
                "exception": "rhel-only",
                "status": "success",
              },
            },
          },
        ]
      `);
      expect(validated.status).toEqual('success');
      expect(validated.tracker).toBeUndefined();
      expect(validated.message).toMatchInlineSnapshot(`
        "Tracker - _no tracker_

        #### The following commits meet all requirements

        | commit | upstream |
        |---|---|
        | https://github.com/org/repo/commit/1111111111111111111111111111111111111111 - _feat: add new feature_ | \`rhel-only\` |
        | https://github.com/org/repo/commit/1111111111111111111111111111111111111111 - _feat: add new feature_ | upstream-url</br>upstream-url |
        | https://github.com/org/repo/commit/1111111111111111111111111111111111111111 - _feat: add new feature_ | \`rhel-only\`</br>upstream-url</br>upstream-url |
        | https://github.com/org/repo/commit/1111111111111111111111111111111111111111 - _feat: add new feature_ | upstream-url</br>upstream-url |
        | https://github.com/org/repo/commit/1111111111111111111111111111111111111111 - _feat: add new feature_ | upstream-url</br>upstream-url |
        | https://github.com/org/repo/commit/1111111111111111111111111111111111111111 - _feat: add new feature_ | \`rhel-only\`</br>upstream-url</br>upstream-url |
        | https://github.com/org/repo/commit/1111111111111111111111111111111111111111 - _feat: add new feature_ | \`rhel-only\`</br>upstream-url</br>upstream-url |"
      `);
    });

    it<IValidatorTestContext>('systemd-rhel-policy configuration', context => {
      const validated = context['systemd-rhel-policy'].validateAll(
        context['validated-commits']['systemd-rhel-policy']['shouldPass']
      );

      expect(validated.status).toEqual('failure');
      expect(validated.tracker).toBeDefined();
      expect(validated.tracker).toMatchInlineSnapshot(`
        {
          "message": "Multiple trackers found",
          "type": "unknown",
        }
      `);
      expect(validated.message).toMatchInlineSnapshot(`
        "Tracker - Multiple trackers found

        #### The following commits meet all requirements

        | commit | upstream |
        |---|---|
        | https://github.com/org/repo/commit/1111111111111111111111111111111111111111 - _feat: add new feature_ | upstream-url</br>upstream-url |
        | https://github.com/org/repo/commit/1111111111111111111111111111111111111111 - _feat: add new feature_ | upstream-url</br>upstream-url |
        | https://github.com/org/repo/commit/1111111111111111111111111111111111111111 - _feat: add new feature_ | \`rhel-only\`</br>upstream-url</br>upstream-url |
        | https://github.com/org/repo/commit/1111111111111111111111111111111111111111 - _feat: add new feature_ | \`rhel-only\`</br>upstream-url</br>upstream-url |"
      `);
    });
  });

  describe('aggregatePrTracker()', () => {
    test<IValidatorTestContext>('single tracker', context => {
      const tracker = context['systemd-rhel-policy'].aggregatePrTracker(
        context['validated-commits']['systemd-rhel-policy'].shouldPass
      );

      expect(tracker).toMatchInlineSnapshot(`
        {
          "message": "Multiple trackers found",
          "type": "unknown",
        }
      `);
    });
  });

  describe('buildPrMessage()', () => {
    test<IValidatorTestContext>('systemd-rhel-policy all passed', context => {
      expect(
        context['systemd-rhel-policy'].buildPrMessage(
          undefined,
          context['validated-commits']['systemd-rhel-policy'].shouldPass
        )
      ).toMatchInlineSnapshot(`
        "Tracker - **Missing, needs inspection! ✋**

        #### The following commits meet all requirements

        | commit | upstream |
        |---|---|
        | https://github.com/org/repo/commit/1111111111111111111111111111111111111111 - _feat: add new feature_ | upstream-url</br>upstream-url |
        | https://github.com/org/repo/commit/1111111111111111111111111111111111111111 - _feat: add new feature_ | upstream-url</br>upstream-url |
        | https://github.com/org/repo/commit/1111111111111111111111111111111111111111 - _feat: add new feature_ | \`rhel-only\`</br>upstream-url</br>upstream-url |
        | https://github.com/org/repo/commit/1111111111111111111111111111111111111111 - _feat: add new feature_ | \`rhel-only\`</br>upstream-url</br>upstream-url |"
      `);
    });

    test<IValidatorTestContext>('systemd-rhel-policy some failed', context => {
      expect(
        context['systemd-rhel-policy'].buildPrMessage(
          {
            id: '123456789',
            type: 'unknown',
            url: 'www.tracker.url/',
            message: '',
          },
          context['validated-commits']['systemd-rhel-policy'].shouldFail
        )
      ).toMatchInlineSnapshot(`
        "Tracker - [123456789](www.tracker.url/)

        #### The following commits meet all requirements

        | commit | upstream |
        |---|---|
        | https://github.com/org/repo/commit/1111111111111111111111111111111111111111 - _feat: add new feature_ | upstream-url</br>upstream-url |
        | https://github.com/org/repo/commit/1111111111111111111111111111111111111111 - _feat: add new feature_ | upstream-url</br>upstream-url |

        #### The following commits need an inspection

        | commit | note |
        |---|---|
        | https://github.com/org/repo/commit/1111111111111111111111111111111111111111 - _feat: add new feature_ | **Missing issue tracker** ✋</br>**Missing upstream reference** ‼️ |"
      `);
    });
  });

  describe('computePrStatus()', () => {
    test<IValidatorTestContext>('returns failure when cherry-pick policy active and upstream fails', context => {
      const commitWithUpstreamFailure = new Commit(upstreamAndTracker);
      commitWithUpstreamFailure.validation = {
        status: 'failure',
        message: '',
        tracker: {
          status: 'success',
          message: '[123](https://bugzilla.redhat.com/show_bug.cgi?id=123)',
          data: [
            {
              data: {
                keyword: 'Resolves: #',
                id: '123',
                type: 'bugzilla',
                url: 'https://bugzilla.redhat.com/show_bug.cgi?id=123',
              },
            },
          ],
        },
        upstream: {
          status: 'failure',
          data: [],
        },
      };

      const tracker = {
        id: '123',
        type: 'bugzilla' as const,
        url: 'https://bugzilla.redhat.com/show_bug.cgi?id=123',
        message: 'Tracker found',
      };

      expect(
        context['only-cherry-pick-policy'].computePrStatus(tracker, [
          commitWithUpstreamFailure,
        ])
      ).toEqual('failure');
    });

    test<IValidatorTestContext>('returns success when no policies configured', context => {
      const commit = new Commit(plainCommit);
      commit.validation = {
        status: 'success',
        message: '',
      };

      expect(
        context['no-check-policy'].computePrStatus(undefined, [commit])
      ).toEqual('success');
    });
  });

  describe('formatTrackerId()', () => {
    test('returns id with url when available', () => {
      expect(
        Validator.formatTrackerId({
          id: '123',
          url: 'https://bugzilla.redhat.com/123',
        })
      ).toEqual('[123](https://bugzilla.redhat.com/123)');
    });

    test('returns exception when no id', () => {
      expect(Validator.formatTrackerId({ exception: 'github-only' })).toEqual(
        '`github-only`'
      );
    });

    test('returns message when no id or exception', () => {
      expect(
        Validator.formatTrackerId({ message: 'Multiple trackers found' })
      ).toEqual('Multiple trackers found');
    });

    test('returns plain id when url is missing', () => {
      expect(Validator.formatTrackerId({ id: '123' })).toEqual('123');
    });

    test('returns fallback for undefined tracker', () => {
      expect(Validator.formatTrackerId(undefined)).toEqual(
        '**Missing, needs inspection! ✋**'
      );
    });
  });

  describe('aggregatePrTracker()', () => {
    test<IValidatorTestContext>('handles empty commits array', context => {
      const tracker = context['only-tracker-policy'].aggregatePrTracker([]);

      expect(tracker).toMatchInlineSnapshot(`
        {
          "message": "**Missing issue tracker ✋**",
          "type": "unknown",
        }
      `);
    });
  });
});
