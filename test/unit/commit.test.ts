import { describe, it, expect, beforeEach } from 'vitest';

import {
  ICommitTestContext,
  commitContextFixture,
  upstreamWithException,
} from './fixtures/commit.fixture';
import { validatorContextFixture } from './fixtures/validation/validator.fixture';
import { Commit } from '../../src/commit';

describe('Commit Object', () => {
  beforeEach<ICommitTestContext>(context => {
    context['no-check-policy'] = commitContextFixture['no-check-policy'];
    context['only-tracker-policy'] =
      commitContextFixture['only-tracker-policy'];
    context['only-cherry-pick-policy'] =
      commitContextFixture['only-cherry-pick-policy'];
    context['systemd-rhel-policy'] =
      commitContextFixture['systemd-rhel-policy'];
  });

  it<ICommitTestContext>('can be instantiated', context => {
    expect(context['no-check-policy']).toBeDefined();
    expect(context['only-tracker-policy']).toBeDefined();
    expect(context['only-cherry-pick-policy']).toBeDefined();
    expect(context['systemd-rhel-policy']).toBeDefined();
  });

  it<ICommitTestContext>('can validate commit with no-check-policy configuration', async context => {
    const validated = (
      await context['no-check-policy'].validate(
        validatorContextFixture['no-check-policy']
      )
    ).validated;

    expect(validated.validation.status).toEqual('success');
    expect(validated.validation.tracker?.status).toEqual('success');
    expect(validated.validation.upstream?.status).toEqual('success');
    expect(validated).toMatchInlineSnapshot(`
      {
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
        "validation": {
          "message": "| https://github.com/org/repo/commit/1111111111111111111111111111111111111111 - _feat: add new feature_ | _no upstream_ |",
          "status": "success",
          "tracker": {
            "data": [],
            "message": "_no tracker_",
            "status": "success",
          },
          "upstream": {
            "data": [],
            "exception": "",
            "status": "success",
          },
        },
      }
    `);
  });

  it<ICommitTestContext>('can validate commit with only-tracker-policy configuration', async context => {
    const validated = (
      await context['only-tracker-policy'].validate(
        validatorContextFixture['only-tracker-policy']
      )
    ).validated;

    expect(validated.validation.status).toEqual('success');
    expect(validated.validation.tracker?.status).toEqual('success');
    expect(validated.validation.upstream?.status).toEqual('success');
    expect(validated).toMatchInlineSnapshot(`
      {
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
        "validation": {
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
                "exception": "github-only",
              },
            ],
            "message": "[123](https://bugzilla.redhat.com/show_bug.cgi?id=123)",
            "status": "success",
          },
          "upstream": {
            "data": [],
            "exception": "",
            "status": "success",
          },
        },
      }
    `);
  });

  it<ICommitTestContext>('can validate commit with only-cherry-pick-policy configuration', async context => {
    const validated = (
      await context['only-cherry-pick-policy'].validate(
        validatorContextFixture['only-cherry-pick-policy']
      )
    ).validated;

    expect(validated.validation.status).toEqual('success');
    expect(validated.validation.tracker?.status).toEqual('success');
    expect(validated.validation.upstream?.status).toEqual('success');

    expect(validated).toMatchInlineSnapshot(`
      {
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
      }
    `);
  });

  it<ICommitTestContext>('can validate commit with systemd-rhel configuration', async context => {
    const validated = (
      await context['systemd-rhel-policy'].validate(
        validatorContextFixture['systemd-rhel-policy']
      )
    ).validated;

    expect(validated.validation.status).toEqual('success');
    expect(validated.validation.tracker?.status).toEqual('success');
    expect(validated.validation.upstream?.status).toEqual('success');

    expect(validated).toMatchInlineSnapshot(`
      {
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
        "validation": {
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
                "exception": "github-only",
              },
              {
                "exception": "github-only",
              },
            ],
            "message": "[123](https://bugzilla.redhat.com/show_bug.cgi?id=123), github-only",
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
      }
    `);
  });

  it<ICommitTestContext>('can validate commit with systemd-rhel configuration - bad commits', async context => {
    const validated = (
      await new Commit(upstreamWithException).validate(
        validatorContextFixture['systemd-rhel-policy']
      )
    ).validated;

    expect(validated.validation.status).toEqual('failure');
    expect(validated.validation.tracker?.status).toEqual('failure');
    expect(validated.validation.upstream?.status).toEqual('success');

    expect(validated).toMatchInlineSnapshot(`
      {
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
        "validation": {
          "message": "| https://github.com/org/repo/commit/1111111111111111111111111111111111111111 - _feat: add new feature_ | **Missing issue tracker** ✋ |",
          "status": "failure",
          "tracker": {
            "data": [],
            "message": "**Missing issue tracker** ✋",
            "status": "failure",
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
      }
    `);
  });
});
