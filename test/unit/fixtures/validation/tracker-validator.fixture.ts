import { TrackerValidator } from '../../../../src/validation/tracker-validator';

export interface ITrackerValidatorTestContext {
  'systemd-rhel-policy': TrackerValidator;
}

export const trackerValidatorContextFixture: ITrackerValidatorTestContext = {
  'systemd-rhel-policy': new TrackerValidator({
    keyword: ['Resolves: #', 'Related: #'],
    type: 'bugzilla',
    'issue-format': ['[0-9]+$'],
    url: 'https://bugzilla.redhat.com/show_bug.cgi?id=',
    exception: { note: ['github-only'] },
  }),
};
