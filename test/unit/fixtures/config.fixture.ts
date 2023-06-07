import { Config } from '../../../src/config';

export interface IConfigTestContext {
  configs: Config[];
}

export const configContextFixture: IConfigTestContext = {
  configs: [
    new Config({
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
    }),
  ],
};
