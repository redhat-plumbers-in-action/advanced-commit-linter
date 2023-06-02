import { describe, it, expect, beforeEach, test } from 'vitest';

import { TrackerPullRequestValidator } from '../../../../src/validation/tracker/pull-request-validator';

import { Config } from '../../../../src/config';
import { Commit } from '../../../../src/commit';

interface TrackerValidatorTestContext {
  config: Config;
  commits: Commit[];
}

describe('Test Tracker Pull Request validator', () => {
  beforeEach<TrackerValidatorTestContext>(context => {
    context.config = new Config({
      policy: {
        'cherry-pick': {
          upstream: [
            { github: 'systemd/systemd' },
            { github: 'systemd/systemd-stable' },
          ],
          exception: { note: ['rhel-only'] },
        },
        tracker: [
          {
            keyword: ['Resolves: #', 'Related: #'],
            'issue-format': ['[0-9]+$'],
            url: 'https://bugzilla.redhat.com/show_bug.cgi?id=',
            exception: { note: ['github-only'] },
          },
          {
            keyword: ['Resolves: ', 'Related: '],
            'issue-format': ['JIRA-1234+$'],
            url: 'https://issues.redhat.com/browse/',
            exception: { note: ['github-only'] },
          },
        ],
      },
    });

    context.commits = [
      new Commit({
        sha: '1111111111111111111111111111111111111111',
        url: 'https://github.com/org/repo/commit/1111111111111111111111111111111111111111',
        message: {
          title: 'feat: add new feature',
          body: `feat: add new feature\n\n(cherry picked from commit 2222222222222222222222222222222222222222)\n\ngithub-only\n\nResolves: #123\n\nrhel-only`,
          cherryPick: [{ sha: '2222222222222222222222222222222222222222' }],
        },
      }),
      new Commit({
        sha: '22222222222222222222222222222222222222',
        url: 'https://github.com/org/repo/commit/22222222222222222222222222222222222222',
        message: {
          title: 'feat: add new feature',
          body: `feat: add new feature\n\n(cherry picked from commit 1111111111111111111111111111111111111111)\n\ngithub-only\n\nrhel-only`,
          cherryPick: [{ sha: '1111111111111111111111111111111111111111' }],
        },
      }),
      new Commit({
        sha: '33333333333333333333333333333333333333',
        url: 'https://github.com/org/repo/commit/33333333333333333333333333333333333333',
        message: {
          title: 'feat: add new feature',
          body: `feat: add new feature\n\n(cherry picked from commit 22222222222222222222222222222222222222)\n\nResolves: #123\n\nrhel-only`,
          cherryPick: [{ sha: '22222222222222222222222222222222222222' }],
        },
      }),
    ];
  });

  it<TrackerValidatorTestContext>('can be instantiated', context => {
    const validator = new TrackerPullRequestValidator(
      context.config,
      context.commits
    );

    expect(validator).toBeDefined();
  });

  it<TrackerValidatorTestContext>('can validate commit', context => {
    const validator = new TrackerPullRequestValidator(
      context.config,
      context.commits
    );

    expect(validator.status).toEqual('success');
    expect(validator.statusMessage).toEqual(
      '[123](https://bugzilla.redhat.com/show_bug.cgi?id=123), github-only'
    );
    expect(validator.tracker).toEqual([
      {
        data: {
          id: '123',
          keyword: 'Resolves: #',
          url: 'https://bugzilla.redhat.com/show_bug.cgi?id=123',
        },
      },
      {
        exception: 'github-only',
      },
    ]);
  });

  it<TrackerValidatorTestContext>('debug', context => {
    const validator = new TrackerPullRequestValidator(
      context.config,
      context.commits
    );

    expect(validator.commitValidators[0].trackers).toMatchInlineSnapshot(`
      [
        {
          "data": {
            "id": "123",
            "keyword": "Resolves: #",
            "url": "https://bugzilla.redhat.com/show_bug.cgi?id=123",
          },
        },
      ]
    `);
    expect(validator.commitValidators[1].trackers).toMatchInlineSnapshot(`
      [
        {
          "exception": "github-only",
        },
      ]
    `);
    expect(validator.commitValidators[2].trackers).toMatchInlineSnapshot(`
      [
        {
          "data": {
            "id": "123",
            "keyword": "Resolves: #",
            "url": "https://bugzilla.redhat.com/show_bug.cgi?id=123",
          },
        },
      ]
    `);
  });

  // TODO: test rest of the methods
  test.todo<TrackerValidatorTestContext>('validate');
  test.todo<TrackerValidatorTestContext>('overallTracker');
  test.todo<TrackerValidatorTestContext>('getCommitTrackers');
  test.todo<TrackerValidatorTestContext>('getCommitStatuses');
  test.todo<TrackerValidatorTestContext>('getMessage');
});
