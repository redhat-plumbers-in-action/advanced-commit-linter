import { Context } from 'probot';

import { events } from '../../../../src/events';
import { UpstreamValidator } from '../../../../src/validation/upstream-validator';

export interface IUpstreamValidatorTestContext {
  'systemd-rhel-policy': UpstreamValidator;
  githubContext: (expectedResult: 'pass' | 'fail') => {
    [K in keyof typeof events]: Context<typeof events[K][number]>;
  }[keyof typeof events];
}

export const upstreamValidatorContextFixture: IUpstreamValidatorTestContext = {
  'systemd-rhel-policy': new UpstreamValidator(
    {
      upstream: [
        { github: 'systemd/systemd' },
        { github: 'systemd/systemd-stable' },
      ],
      exception: { note: ['rhel-only'] },
    },
    false
  ),
  githubContext: (expectedResult: 'pass' | 'fail') => {
    return {
      octokit: {
        repos: {
          getCommit: () =>
            Promise.resolve({
              data:
                expectedResult === 'pass'
                  ? {
                      commit: { message: 'commit title' },
                      sha: '2222222222222222222222222222222222222222',
                      html_url:
                        'https://github.com/upstream/repo/commit/2222222222222222222222222222222222222222',
                    }
                  : {},
              status: expectedResult === 'pass' ? 200 : 404,
            }),
        },
      },
    } as {
      [K in keyof typeof events]: Context<typeof events[K][number]>;
    }[keyof typeof events];
  },
};
