import { describe, it, expect, beforeEach, test } from 'vitest';

import {
  IUpstreamValidatorTestContext,
  upstreamValidatorContextFixture,
} from '../fixtures/validation/upstream-validator.fixture';

describe('Upstream Validator Object', () => {
  beforeEach<IUpstreamValidatorTestContext>(context => {
    context['systemd-rhel-policy'] =
      upstreamValidatorContextFixture['systemd-rhel-policy'];
    context.githubContext = upstreamValidatorContextFixture.githubContext;
  });

  it<IUpstreamValidatorTestContext>('can be instantiated', context => {
    expect(context['systemd-rhel-policy']).toBeDefined();
  });

  describe('can validate upstream reference in commit message', () => {
    test<IUpstreamValidatorTestContext>('no reference', async context => {
      expect(
        await context['systemd-rhel-policy'].validate(
          {
            sha: '123',
            url: 'https://github.com/org/repo/commit/123',
            message: {
              title: 'commit title',
              body: 'commit title',
              cherryPick: [],
            },
          },
          context.githubContext('fail')
        )
      ).toMatchInlineSnapshot(`
        {
          "data": [],
          "exception": "",
          "status": "failure",
        }
      `);
    });

    test<IUpstreamValidatorTestContext>('valid reference', async context => {
      expect(
        await context['systemd-rhel-policy'].validate(
          {
            sha: '123',
            url: 'https://github.com/org/repo/commit/123',
            message: {
              title: 'commit title',
              body: 'commit title\n\n(cherry picked from commit 2222222222222222222222222222222222222222)',
              cherryPick: [
                {
                  sha: '2222222222222222222222222222222222222222',
                },
              ],
            },
          },
          context.githubContext('pass')
        )
      ).toMatchInlineSnapshot(`
        {
          "data": [
            {
              "repo": "systemd/systemd",
              "sha": "2222222222222222222222222222222222222222",
              "url": "https://github.com/upstream/repo/commit/2222222222222222222222222222222222222222",
            },
            {
              "repo": "systemd/systemd-stable",
              "sha": "2222222222222222222222222222222222222222",
              "url": "https://github.com/upstream/repo/commit/2222222222222222222222222222222222222222",
            },
          ],
          "exception": "",
          "status": "success",
        }
      `);
    });

    test<IUpstreamValidatorTestContext>('invalid reference', async context => {
      expect(
        await context['systemd-rhel-policy'].validate(
          {
            sha: '123',
            url: 'https://github.com/org/repo/commit/123',
            message: {
              title: 'commit title',
              body: 'commit title\n\n(cherry picked from commit 1111111)',
              cherryPick: [
                {
                  sha: '1111111',
                },
              ],
            },
          },
          context.githubContext('fail')
        )
      ).toMatchInlineSnapshot(`
        {
          "data": [],
          "exception": "",
          "status": "failure",
        }
      `);
    });

    test<IUpstreamValidatorTestContext>('valid exception', async context => {
      expect(
        await context['systemd-rhel-policy'].validate(
          {
            sha: '123',
            url: 'https://github.com/org/repo/commit/123',
            message: {
              title: 'commit title',
              body: 'commit title\n\nrhel-only',
              cherryPick: [],
            },
          },
          context.githubContext('fail')
        )
      ).toMatchInlineSnapshot(`
        {
          "data": [],
          "exception": "rhel-only",
          "status": "success",
        }
      `);
    });

    test<IUpstreamValidatorTestContext>('valid reference and exception', async context => {
      expect(
        await context['systemd-rhel-policy'].validate(
          {
            sha: '123',
            url: 'https://github.com/org/repo/commit/123',
            message: {
              title: 'commit title',
              body: 'commit title\n\nrhel-only\n\n(cherry picked from commit 2222222222222222222222222222222222222222)',
              cherryPick: [
                {
                  sha: '2222222222222222222222222222222222222222',
                },
              ],
            },
          },
          context.githubContext('pass')
        )
      ).toMatchInlineSnapshot(`
        {
          "data": [
            {
              "repo": "systemd/systemd",
              "sha": "2222222222222222222222222222222222222222",
              "url": "https://github.com/upstream/repo/commit/2222222222222222222222222222222222222222",
            },
            {
              "repo": "systemd/systemd-stable",
              "sha": "2222222222222222222222222222222222222222",
              "url": "https://github.com/upstream/repo/commit/2222222222222222222222222222222222222222",
            },
          ],
          "exception": "rhel-only",
          "status": "success",
        }
      `);
    });
  });
});
