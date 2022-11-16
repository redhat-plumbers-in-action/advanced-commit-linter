import { z } from 'zod';

import {
  configExceptionSchema,
  ConfigExceptionT,
  ConfigTrackerT,
} from '../schema/config';
import { SingleCommitMetadataT } from '../schema/input';
import { StatusT, TrackerT, ValidatedCommitT } from '../schema/output';

export class TrackerValidator {
  constructor(public config: ConfigTrackerT) {}

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
    const trackerResult: TrackerT = {
      data: { keyword: '', id: '' },
    };

    for (const keyword of this.config.keyword) {
      for (const issueFormat of this.config['issue-format']) {
        const reference = this.getTrackerReference(
          keyword,
          issueFormat,
          commitBody,
          this.config.url
        );

        if (reference) {
          trackerResult.data = {
            ...reference,
          };
        }

        trackerResult.exception = this.isException(
          this.config.exception,
          commitBody
        );

        if (reference || trackerResult.exception !== undefined)
          return trackerResult;
      }
    }

    return trackerResult;
  }

  getTrackerReference(
    keyword: string,
    issueFormat: string,
    commitBody: string,
    url: string | undefined
  ): TrackerT['data'] {
    const regexp = new RegExp(
      `(^\\s*|\\\\n|\\n)(${keyword})(${issueFormat})$`,
      'gm'
    );
    const matches = commitBody.matchAll(regexp);

    for (const match of matches) {
      if (Array.isArray(match) && match.length >= 4) {
        return {
          keyword: `${keyword}`,
          id: `${match[3]}`,
          url: url ? `${url}${match[3]}` : '',
        };
      }
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

    if (!exceptionPolicySafe.success) return '';

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
    tracker: TrackerT[],
    status: StatusT,
    isTrackerPolicyEmpty: boolean
  ): string {
    let message = '`_no-tracker_`';

    if (isTrackerPolicyEmpty) return message;

    const trackers = tracker.map(single => {
      if (single.data === undefined) return '';
      if (single.data.url === '') return single.data.id;
      return `[${single.data.id}](${single.data.url})`;
    });

    switch (status) {
      case 'success':
        message = `${trackers.join(', ')}`;
        break;
      case 'failure':
        message = '`Missing, needs inspection! ✋`';
        break;
    }

    return message;
  }

  static cleanArray(
    validationArray: Required<ValidatedCommitT['tracker']>
  ): ValidatedCommitT['tracker'] {
    if (validationArray === undefined) return undefined;
    if (validationArray.data.length === 0) return validationArray;

    const cleanedData = validationArray.data.filter(
      tracker =>
        JSON.stringify(tracker) !==
        JSON.stringify({
          data: { keyword: '', id: '' },
        })
    );

    return {
      ...validationArray,
      data: cleanedData,
    };
  }
}
