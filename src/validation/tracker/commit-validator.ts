import { Commit } from '../../commit';
import { Config } from '../../config';

import { isException } from '../util';

import { ConfigTracker } from '../../schema/config';
import { SingleCommitMetadata } from '../../schema/input';
import { Status, Tracker } from '../../schema/output';

export class TrackerCommitValidator {
  trackers: Tracker[] = [];
  status: Status = 'failure';

  constructor(readonly config: Config, readonly commit: Commit) {
    this.config.tracker.forEach(singleTrackerConfig => {
      this.trackers.push(
        this.validate(singleTrackerConfig, commit.metadata.message.body)
      );
    });

    this.trackers = this.getExactTracker();
    this.status = this.overallStatus(this.trackers);
  }

  validate(
    singleTrackerConfig: ConfigTracker,
    commitMessage: SingleCommitMetadata['message']['body']
  ): Tracker {
    // Check if tracker reference is present in commit message
    // ? Only first occurrence is returned - see matchTracker()
    const detected = this.detect(singleTrackerConfig, commitMessage);

    if (detected.data !== undefined) {
      return {
        ...detected,
      };
    }

    const exception = isException(singleTrackerConfig.exception, commitMessage);
    return {
      ...detected,
      exception,
    };
  }

  // TODO: refactor/implement
  detect(
    singleTrackerConfig: ConfigTracker,
    commitMessage: SingleCommitMetadata['message']['body']
  ): Tracker {
    const trackerResult: Tracker = {};

    for (const keyword of singleTrackerConfig.keyword) {
      for (const issueFormat of singleTrackerConfig['issue-format']) {
        const reference = this.matchTracker(
          keyword,
          issueFormat,
          commitMessage
        );

        if (reference) {
          trackerResult.data = {
            keyword,
            id: reference,
          };

          if (singleTrackerConfig.url) {
            trackerResult.data.url = `${singleTrackerConfig.url}${reference}`;
          }
        }
      }
    }

    return trackerResult;
  }

  matchTracker(
    keyword: string,
    trackerFormat: string,
    commitMessage: SingleCommitMetadata['message']['body']
  ): string | undefined {
    const regexp = new RegExp(
      `(^\\s*|\\\\n|\\n)(${keyword})(${trackerFormat})$`,
      'gm'
    );

    const matches = commitMessage.matchAll(regexp);

    for (const match of matches) {
      if (Array.isArray(match) && match.length >= 4) return match[3];
    }

    return undefined;
  }

  overallStatus(trackers: Tracker[]): Status {
    if (this.config.isTrackerPolicyEmpty()) return 'success';
    if (trackers.length === 0) return 'failure';

    let status: Status = 'success';
    for (const single of trackers) {
      if (single.data === undefined && single.exception === undefined) {
        status = 'failure';
        break;
      }
    }

    return status;
  }

  getExactTracker(): Tracker[] {
    const length = this.trackers.length;

    if (length === 0) return [];
    if (length === 1) return this.trackers;

    // Trackers are only exceptions
    if (
      this.trackers.filter(
        e => e.data === undefined && e.exception !== undefined
      ).length === length
    ) {
      return [this.trackers[0]];
    }

    return this.trackers.filter(e => e.data !== undefined);
  }
}
