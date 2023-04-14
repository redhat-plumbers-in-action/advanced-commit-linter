import { Context } from 'probot';
import { Commit } from '../commit';
import { Config } from '../config';

import { events } from '../events';

import { SingleCommitMetadataT } from '../schema/input';

import {
  OutputValidatedPullRequestMetadataT,
  TrackerT,
  ValidatedCommitT,
  StatusT,
} from '../schema/output';
import { TrackerValidator } from './tracker-validator';
import { UpstreamValidator } from './upstream-validator';

export class Validator {
  trackerValidator: TrackerValidator[];
  upstreamValidator: UpstreamValidator;

  constructor(
    readonly config: Config,
    readonly context: {
      [K in keyof typeof events]: Context<(typeof events)[K][number]>;
    }[keyof typeof events]
  ) {
    this.trackerValidator = this.config.tracker.map(
      config => new TrackerValidator(config)
    );
    this.upstreamValidator = new UpstreamValidator(
      this.config.cherryPick,
      this.config.isCherryPickPolicyEmpty()
    );
  }

  validateAll(
    validatedCommits: Commit[]
  ): OutputValidatedPullRequestMetadataT['validation'] {
    const tracker = this.generalTracker(validatedCommits);
    const status = this.overallStatus(tracker /*, validatedCommits*/);
    const message = this.overallMessage(tracker, validatedCommits);

    return {
      status,
      tracker,
      message,
    };
  }

  async validateCommit(
    commitMetadata: SingleCommitMetadataT
  ): Promise<ValidatedCommitT> {
    const validated: ValidatedCommitT = {
      status: 'failure',
      message: '',
    };

    validated.tracker = TrackerValidator.cleanArray({
      status: 'failure',
      message: '',
      data: this.trackerValidator.map(tracker =>
        tracker.validate(commitMetadata)
      ),
    });

    if (validated.tracker) {
      validated.tracker.status = TrackerValidator.getStatus(
        validated.tracker.data,
        this.config.isTrackerPolicyEmpty()
      );
      validated.tracker.message = TrackerValidator.getMessage(
        validated.tracker.data,
        validated.tracker.status,
        this.config.isTrackerPolicyEmpty()
      );
    }

    validated.upstream = await this.upstreamValidator.validate(
      commitMetadata,
      this.context
    );
    const { status, message } = this.validationSummary(
      validated,
      commitMetadata.message.title,
      commitMetadata.url
    );

    validated.status =
      status === 'success' && validated.tracker?.status === 'success'
        ? 'success'
        : 'failure';
    validated.message = message;

    return validated;
  }

  validationSummary(
    data: ValidatedCommitT,
    commitTitle: string,
    commitUrl: string
  ): Pick<ValidatedCommitT, 'status' | 'message'> {
    let status: StatusT = 'failure';
    const upstreamSummary = this.upstreamValidator.summary(data.upstream);

    status = upstreamSummary.status;

    return {
      status,
      message: `${commitUrl} - ${commitTitle} - ${upstreamSummary.message}`,
    };
  }

  // TODO:
  // ! get unique trackers of commits
  // ! get unique tracker of PR
  // ! when commit is marked by exception and commit with tracker exist return only tracker othervise return exception
  // ! when multiple trackers exist return error???

  generalTracker(
    commitsMetadata: Commit[]
  ): OutputValidatedPullRequestMetadataT['validation']['tracker'] {
    if (this.config.isTrackerPolicyEmpty()) return undefined;

    const tracker: OutputValidatedPullRequestMetadataT['validation']['tracker'] =
      { message: '' };

    const prUniqueTracker: TrackerT[] = [];
    for (const { validation } of commitsMetadata) {
      if (
        validation.tracker === undefined ||
        validation.tracker.data.length === 0
      ) {
        tracker.message = 'No tracker found';
        return tracker;
      }

      if (validation.tracker.status === 'failure') {
        tracker.message = validation.tracker.message;
        return tracker;
      }

      const uniqueTracker: TrackerT[] = [];
      for (const tracker of validation.tracker.data) {
        const isDuplicate = uniqueTracker.find(
          obj => obj.data?.id === tracker.data?.id
        );
        if (!isDuplicate) {
          uniqueTracker.push(tracker);
        }
      }

      if (uniqueTracker.length > 1) {
        tracker.message = 'Multiple trackers found';
        return tracker;
      }

      const isDuplicate = prUniqueTracker.find(
        obj => obj.data?.id === uniqueTracker[0].data?.id
      );

      if (!isDuplicate) {
        prUniqueTracker.push(uniqueTracker[0]);
      }
    }

    if (prUniqueTracker.length > 1) {
      const trackers = prUniqueTracker.map(tracker => {
        if (tracker.exception) {
          return `\`${tracker.exception}\``;
        }
        return `[${tracker.data?.id}](${tracker.data?.url})`;
      });

      tracker.message = `${trackers.join(', ')}`;
      return tracker;
    }

    return {
      ...tracker,
      id: prUniqueTracker[0].data?.id,
      url: prUniqueTracker[0].data?.url,
      message: 'Tracker found',
      exception: prUniqueTracker[0].exception,
    };
  }

  overallMessage(
    tracker: OutputValidatedPullRequestMetadataT['validation']['tracker'],
    commitsMetadata: Commit[]
  ): string {
    let trackerID = 'Missing, needs inspection! ✋';

    if (tracker !== undefined) {
      if (!tracker?.id && !tracker?.exception) {
        trackerID = tracker.message;
      } else if (tracker?.id === '' && tracker?.exception) {
        trackerID = `\`${tracker.exception}\``;
      } else if (tracker?.id !== '') {
        trackerID = `[${tracker.id}](${tracker.url})`;
      }
    }

    const commits = `${commitsMetadata
      .map(commit => {
        return commit.validation.message;
      })
      .join('\n')}`;

    // TODO: separate commits by their status
    // The following commits needs inspection
    // The following commits meets all requirements
    return `Tracker - ${trackerID}\n\n${commits}`;
  }

  overallStatus(
    tracker: OutputValidatedPullRequestMetadataT['validation']['tracker']
    // commitsMetadata: OutputCommitMetadataT
  ) {
    let status: StatusT = 'failure';

    if (tracker) {
      status = 'success';
    }
    return status;
  }
}
