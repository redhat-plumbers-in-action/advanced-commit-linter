import { Commit } from '../../commit';
import { Config } from '../../config';
import { TrackerCommitValidator } from './commit-validator';

import { Status } from '../../schema/output';
import { Tracker } from '../../schema/output';

export class TrackerPullRequestValidator {
  commitValidators: TrackerCommitValidator[] = [];

  tracker: Tracker[] | undefined;
  status: Status = 'failure';
  statusMessage: string | undefined;

  constructor(readonly config: Config, commits: Commit[]) {
    commits.forEach(commit => {
      this.commitValidators.push(new TrackerCommitValidator(config, commit));
    });

    this.validate();
  }

  validate() {
    this.tracker = this.overallTracker();
    this.status = this.overallStatus();
    this.statusMessage = this.getMessage();
  }

  // !FIXME: overallTracker and getMessage has duplicate code

  overallTracker(): Tracker[] | undefined {
    if (this.config.isTrackerPolicyEmpty()) return undefined;

    const prUniqueTrackers: Tracker[] = [];

    for (const commitValidator of this.commitValidators) {
      if (commitValidator.trackers.length === 0) {
        this.statusMessage = '**Missing issue tracker ✋**';
        return undefined;
      }

      if (commitValidator.trackers.length > 1) {
        this.statusMessage = 'Multiple trackers found';
        return commitValidator.trackers;
      }

      const isDuplicate = prUniqueTrackers.find(
        obj => obj.data?.id === commitValidator.trackers[0].data?.id
      );

      if (!isDuplicate) {
        prUniqueTrackers.push(commitValidator.trackers[0]);
      }
    }

    return prUniqueTrackers;
  }

  getCommitTrackers(): Tracker[] {
    const trackers: Tracker[] = [];

    this.commitValidators.forEach(commitValidator =>
      trackers.push(...commitValidator.trackers)
    );

    return trackers;
  }

  overallStatus(): Status {
    const statuses = this.getCommitStatuses();

    if (statuses.length === 0) return 'failure';

    return statuses.find(status => status === 'failure') === undefined
      ? 'success'
      : 'failure';
  }

  getCommitStatuses(): Status[] {
    return this.commitValidators.map(commitValidator => commitValidator.status);
  }

  /**
   * Get tracker message that will be displayed in Pull Request comment summary
   * @param trackers - Array of tracker data
   * @param status - Status of the validation
   * @param isTrackerPolicyEmpty - If tracker policy is empty
   * @returns Message to be displayed
   */
  getMessage(): string {
    if (this.config.isTrackerPolicyEmpty()) return '_no tracker_';

    const trackersResult: string[] = [];

    for (const singleTracker of this.tracker ?? []) {
      // If no tracker data nor exception, skip
      if (!singleTracker?.data && !singleTracker?.exception) continue;

      // If no tracker data provided but exception was detected exception, push exception
      if (singleTracker?.exception && !singleTracker?.data) {
        trackersResult.push(singleTracker.exception);
        continue;
      }

      if (!singleTracker.data) continue;
      // If no tracker url provided, push only id
      if (!singleTracker.data.url || singleTracker.data?.url === '') {
        trackersResult.push(singleTracker.data.id);
        continue;
      }

      // If tracker url provided, push id with link
      trackersResult.push(
        `[${singleTracker.data.id}](${singleTracker.data.url})`
      );
    }

    switch (this.status) {
      case 'success':
        return `${trackersResult.join(', ')}`;
      case 'failure':
        return '**Missing issue tracker** ✋';
    }
  }

  // static cleanArray(
  //   validationArray: ValidatedCommit['tracker']
  // ): ValidatedCommit['tracker'] {
  //   if (validationArray === undefined) return undefined;
  //   if (
  //     Array.isArray(validationArray.data) &&
  //     validationArray.data.length === 0
  //   )
  //     return validationArray;

  //   const cleanedData = validationArray.data.filter(
  //     tracker => JSON.stringify(tracker) !== JSON.stringify({})
  //   );

  //   return {
  //     ...validationArray,
  //     data: cleanedData,
  //   };
  // }
}
