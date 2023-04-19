import { z } from 'zod';

import {
  configExceptionSchema,
  ConfigExceptionT,
  ConfigTrackerT,
} from '../schema/config';
import { SingleCommitMetadataT } from '../schema/input';
import { StatusT, TrackerT, ValidatedCommitT } from '../schema/output';

export class TrackerValidator {
  constructor(readonly config: ConfigTrackerT) {}

  validate(singleCommitMetadata: SingleCommitMetadataT): TrackerT {
    return {
      ...this.loopPolicy(singleCommitMetadata.message.body),
      exception: this.isException(
        this.config.exception,
        singleCommitMetadata.message.body
      ),
    };
  }

  loopPolicy(commitBody: SingleCommitMetadataT['message']['body']): TrackerT {
    const trackerResult: TrackerT = {};

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
    exceptionPolicy: ConfigExceptionT | undefined,
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

  static getStatus(
    tracker: TrackerT[],
    isTrackerPolicyEmpty: boolean
  ): StatusT {
    let status: StatusT = 'success';
    if (isTrackerPolicyEmpty) return status;

    for (const single of tracker) {
      if (single.data === undefined && single.exception === undefined) {
        status = 'failure';
        break;
      }
    }

    return status;
  }

  static getMessage(
    trackers: TrackerT[],
    status: StatusT,
    isTrackerPolicyEmpty: boolean
  ): string {
    let message = '`_no-tracker_`';

    if (isTrackerPolicyEmpty) return message;

    const trackersResult: string[] = [];

    for (const singleTracker of trackers) {
      if (singleTracker.data === undefined) continue;
      if (singleTracker.data.url === '')
        trackersResult.push(singleTracker.data.id);
      trackersResult.push(
        `[${singleTracker.data.id}](${singleTracker.data.url})`
      );
    }

    switch (status) {
      case 'success':
        message = `${trackersResult.join(', ')}`;
        break;
      case 'failure':
        message = '`Missing, needs inspection! ✋`';
        break;
    }

    return message;
  }

  static cleanArray(
    validationArray: ValidatedCommitT['tracker']
  ): ValidatedCommitT['tracker'] {
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
