import { z } from 'zod';

import {
  configExceptionSchema,
  ConfigException,
  ConfigTracker,
} from '../schema/config';
import { SingleCommitMetadata } from '../schema/input';
import { Status, Tracker, ValidatedCommit } from '../schema/output';

export class TrackerValidator {
  constructor(readonly config: ConfigTracker) {}

  validate(singleCommitMetadata: SingleCommitMetadata): Tracker {
    return {
      ...this.loopPolicy(singleCommitMetadata.message.body),
      exception: this.isException(
        this.config.exception,
        singleCommitMetadata.message.body
      ),
    };
  }

  loopPolicy(commitBody: SingleCommitMetadata['message']['body']): Tracker {
    const trackerResult: Tracker = {};

    for (const keyword of this.config.keyword) {
      for (const issueFormat of this.config['issue-format']) {
        const reference = this.matchTracker(keyword, issueFormat, commitBody);

        if (reference) {
          trackerResult.data = {
            keyword,
            id: reference,
          };

          if (this.config.url) {
            trackerResult.data.url = `${this.config.url}${reference}`;
          }
        }
      }
    }

    const exception = this.isException(this.config.exception, commitBody);
    if (exception) {
      trackerResult.exception = exception;
    }

    return trackerResult;
  }

  matchTracker(
    keyword: string,
    trackerFormat: string,
    commitBody: string
  ): string | undefined {
    const regexp = new RegExp(
      `(^\\s*|\\\\n|\\n)(${keyword})(${trackerFormat})$`,
      'gm'
    );

    const matches = commitBody.matchAll(regexp);

    for (const match of matches) {
      if (Array.isArray(match) && match.length >= 4) return match[3];
    }

    return undefined;
  }

  isException(
    exceptionPolicy: ConfigException | undefined,
    commitBody: string
  ): string | undefined {
    const exceptionPolicySafe = configExceptionSchema
      .extend({ note: z.array(z.string()) })
      .safeParse(exceptionPolicy);

    if (!exceptionPolicySafe.success) return undefined;

    for (const exception of exceptionPolicySafe.data.note) {
      const regexp = new RegExp(`(^\\s*|\\\\n|\\n)(${exception})$`, 'gm');
      const matches = commitBody.matchAll(regexp);

      for (const match of matches) {
        if (Array.isArray(match) && match.length >= 3) {
          return exception;
        }
      }
    }
  }

  static getStatus(tracker: Tracker[], isTrackerPolicyEmpty: boolean): Status {
    let status: Status = 'success';
    if (isTrackerPolicyEmpty) return status;
    if (tracker.length === 0) return 'failure';

    for (const single of tracker) {
      if (single.data === undefined && single.exception === undefined) {
        status = 'failure';
        break;
      }
    }

    return status;
  }

  /**
   * Get tracker message that will be displayed in Pull Request comment summary
   * @param trackers - Array of tracker data
   * @param status - Status of the validation
   * @param isTrackerPolicyEmpty - If tracker policy is empty
   * @returns Message to be displayed
   */
  static getMessage(
    trackers: Tracker[],
    status: Status,
    isTrackerPolicyEmpty: boolean
  ): string {
    if (isTrackerPolicyEmpty) return '_no tracker_';

    const trackersResult: string[] = [];

    for (const singleTracker of trackers) {
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

    switch (status) {
      case 'success':
        return `${trackersResult.join(', ')}`;
      case 'failure':
        return '**Missing issue tracker** ✋';
    }
  }

  static cleanArray(
    validationArray: ValidatedCommit['tracker']
  ): ValidatedCommit['tracker'] {
    if (validationArray === undefined) return undefined;
    if (
      Array.isArray(validationArray.data) &&
      validationArray.data.length === 0
    )
      return validationArray;

    const cleanedData = validationArray.data.filter(
      tracker => JSON.stringify(tracker) !== JSON.stringify({})
    );

    return {
      ...validationArray,
      data: cleanedData,
    };
  }
}
