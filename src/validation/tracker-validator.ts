import { ConfigTracker } from '../schema/config';
import { SingleCommitMetadata } from '../schema/input';
import { Tracker } from '../schema/output';
import { isException } from './util';

export class TrackerValidator {
  constructor(readonly config: ConfigTracker) {}

  validate(singleCommitMetadata: SingleCommitMetadata): Tracker {
    const exception = isException(
      this.config.exception,
      singleCommitMetadata.message.body
    );

    const detectedTrackers = this.gatherTrackers(
      singleCommitMetadata.message.body
    );

    return {
      ...detectedTrackers,
      exception,
    };
  }

  gatherTrackers(commitBody: SingleCommitMetadata['message']['body']): Tracker {
    const trackerResult: Tracker = {};

    for (const keyword of this.config.keyword) {
      for (const issueFormat of this.config['issue-format']) {
        const reference = this.matchTracker(keyword, issueFormat, commitBody);

        if (reference) {
          trackerResult.data = {
            keyword,
            id: reference,
            type: this.config.type,
          };

          if (this.config.url) {
            trackerResult.data.url = `${this.config.url}${reference}`;
          }
        }
      }
    }

    return trackerResult;
  }

  matchTracker(
    keyword: string,
    trackerFormat: string,
    commitBody: string
  ): string | undefined {
    // `\\n` matches literal backslash-n text in API responses; `^` with `m` flag handles actual newlines
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
}
