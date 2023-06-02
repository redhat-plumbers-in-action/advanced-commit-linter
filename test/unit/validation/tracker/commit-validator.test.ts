import { describe, it, expect, beforeEach, test } from 'vitest';

import { TrackerCommitValidator } from '../../../../src/validation/tracker/commit-validator';

import { Config } from '../../../../src/config';
import { Commit } from '../../../../src/commit';

interface TrackerValidatorTestContext {
  config: Config;
  commit: Commit;
}

describe('Test Tracker commit validator', () => {
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

    context.commit = new Commit({
      sha: '1111111111111111111111111111111111111111',
      url: 'https://github.com/org/repo/commit/1111111111111111111111111111111111111111',
      message: {
        title: 'feat: add new feature',
        body: `feat: add new feature\n\n(cherry picked from commit 2222222222222222222222222222222222222222)\n\ngithub-only\n\nResolves: #123\n\nrhel-only`,
        cherryPick: [{ sha: '2222222222222222222222222222222222222222' }],
      },
    });
  });

  it<TrackerValidatorTestContext>('can be instantiated', context => {
    const validator = new TrackerCommitValidator(
      context.config,
      context.commit
    );

    expect(validator).toBeDefined();
  });

  it<TrackerValidatorTestContext>('can validate commit', context => {
    const validator = new TrackerCommitValidator(
      context.config,
      context.commit
    );

    expect(validator.trackers).toEqual([
      {
        data: {
          id: '123',
          keyword: 'Resolves: #',
          url: 'https://bugzilla.redhat.com/show_bug.cgi?id=123',
        },
      },
    ]);

    expect(validator.status).toEqual('success');
  });

  test<TrackerValidatorTestContext>('getExactTracker()', context => {
    const validator = new TrackerCommitValidator(
      context.config,
      context.commit
    );

    expect(validator.getExactTracker()).toEqual([
      {
        data: {
          id: '123',
          keyword: 'Resolves: #',
          url: 'https://bugzilla.redhat.com/show_bug.cgi?id=123',
        },
      },
    ]);
  });

  test.todo<TrackerValidatorTestContext>('validate()');
  test.todo<TrackerValidatorTestContext>('detect()');
  test.todo<TrackerValidatorTestContext>('matchTracker()');
  test.todo<TrackerValidatorTestContext>('overallStatus()');
});
