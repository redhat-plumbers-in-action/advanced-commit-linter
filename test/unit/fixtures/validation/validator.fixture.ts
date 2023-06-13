import { Commit } from '../../../../src/commit';
import { Config } from '../../../../src/config';
import { CustomOctokit } from '../../../../src/octokit';

import { Validator } from '../../../../src/validation/validator';
import {
  commitsWithMissingData,
  commitsWithTracker,
  commitsWithUpstream,
  commitsWithUpstreamAndTracker,
} from '../commit.fixture';

export interface IValidatorTestContext {
  'no-check-policy': Validator;
  'only-tracker-policy': Validator;
  'only-cherry-pick-policy': Validator;
  'systemd-rhel-policy': Validator;
  'validated-commits': {
    [key in Exclude<keyof IValidatorTestContext, 'validated-commits'>]: {
      shouldPass: Commit[];
      shouldFail: Commit[];
    };
  };
}

const emptyPolicy = new Config({
  policy: {},
});

const onlyTrackerPolicy = new Config({
  policy: {
    tracker: [
      {
        keyword: ['Resolves: #', 'Related: #'],
        type: 'bugzilla',
        'issue-format': ['[0-9]+$'],
        url: 'https://bugzilla.redhat.com/show_bug.cgi?id=',
        exception: { note: ['github-only'] },
      },
    ],
  },
});

const onlyCherryPickPolicy = new Config({
  policy: {
    'cherry-pick': {
      upstream: [
        { github: 'systemd/systemd' },
        { github: 'systemd/systemd-stable' },
      ],
      exception: { note: ['rhel-only'] },
    },
  },
});

const systemdPolicy = new Config({
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
        type: 'bugzilla',
        'issue-format': ['[0-9]+$'],
        url: 'https://bugzilla.redhat.com/show_bug.cgi?id=',
        exception: { note: ['github-only'] },
      },
      {
        keyword: ['Resolves: ', 'Related: '],
        type: 'jira',
        'issue-format': ['JIRA-1234+$'],
        url: 'https://issues.redhat.com/browse/',
        exception: { note: ['github-only'] },
      },
    ],
  },
});

const githubContext = {
  request: (endpoint: any, request: any) =>
    Promise.resolve({
      data: {
        commit: { message: 'feat: add new feature' },
        sha: 'upstream-sha',
        html_url: 'upstream-url',
      },
      status: 200,
    }),
} as CustomOctokit;

const noPolicyValidator = new Validator(emptyPolicy, githubContext);
const trackerValidator = new Validator(onlyTrackerPolicy, githubContext);
const upstreamValidator = new Validator(onlyCherryPickPolicy, githubContext);
const systemdPolicyValidator = new Validator(systemdPolicy, githubContext);

const validatedCommits: IValidatorTestContext['validated-commits'] = {
  'no-check-policy': {
    shouldPass: await Promise.all(
      commitsWithUpstreamAndTracker.map(async singleCommit =>
        new Commit(singleCommit).validate(noPolicyValidator)
      )
    ),
    shouldFail: [],
  },
  'only-tracker-policy': {
    shouldPass: await Promise.all(
      commitsWithTracker.map(async singleCommit =>
        new Commit(singleCommit).validate(trackerValidator)
      )
    ),
    shouldFail: await Promise.all(
      commitsWithUpstream.map(async singleCommit =>
        new Commit(singleCommit).validate(trackerValidator)
      )
    ),
  },
  'only-cherry-pick-policy': {
    shouldPass: await Promise.all(
      commitsWithUpstream.map(async singleCommit =>
        new Commit(singleCommit).validate(upstreamValidator)
      )
    ),
    shouldFail: await Promise.all(
      commitsWithTracker.map(async singleCommit =>
        new Commit(singleCommit).validate(upstreamValidator)
      )
    ),
  },
  'systemd-rhel-policy': {
    shouldPass: await Promise.all(
      commitsWithUpstreamAndTracker.map(async singleCommit =>
        new Commit(singleCommit).validate(systemdPolicyValidator)
      )
    ),
    shouldFail: await Promise.all(
      commitsWithMissingData.map(async singleCommit =>
        new Commit(singleCommit).validate(systemdPolicyValidator)
      )
    ),
  },
};

export const validatorContextFixture: IValidatorTestContext = {
  'no-check-policy': noPolicyValidator,
  'only-tracker-policy': trackerValidator,
  'only-cherry-pick-policy': upstreamValidator,
  'systemd-rhel-policy': systemdPolicyValidator,
  'validated-commits': validatedCommits,
};
