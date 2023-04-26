import { Context } from 'probot';

import {
  OutputValidatedPullRequestMetadataT,
  TrackerT,
  ValidatedCommitT,
  StatusT,
} from '../schema/output';
import { TrackerValidator } from './tracker-validator';
import { UpstreamValidator } from './upstream-validator';

import { Commit } from '../commit';
import { Config } from '../config';

import { events } from '../events';

import { SingleCommitMetadataT } from '../schema/input';

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
    const status = this.overallStatus(tracker, validatedCommits);
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

  // TODO: https://github.com/redhat-plumbers-in-action/advanced-commit-linter/issues/43
  // "validation": {
  // ? "message": "https://github.com/org/repo/commit/1111111111111111111111111111111111111111 - _feat: add new feature_ - \`rhel-only\` upstream-url upstream-url",
  // ! "message": "| sha - _title_ | upstream-url upstream-url |", <--- if success
  // ! "message": "| sha - _title_ | upstream-error and-or tracker-error |", <--- if failure
  //   "status": "failure",
  //   "tracker": {
  //     "data": [],
  //     "message": "Missing issue tracker ✋",
  //     "status": "failure",
  //   },
  //   "upstream": {
  //     "data": [
  //       {
  //         "repo": "systemd/systemd",
  //         "sha": "upstream-sha",
  //         "url": "upstream-url",
  //       },
  //       {
  //         "repo": "systemd/systemd-stable",
  //         "sha": "upstream-sha",
  //         "url": "upstream-url",
  //       },
  //     ],
  //     "exception": "rhel-only",
  //     "status": "success",
  //   },
  // },

  validationSummary(
    data: ValidatedCommitT,
    commitTitle: string,
    commitUrl: string
  ): Pick<ValidatedCommitT, 'status' | 'message'> {
    const upstreamSummary = this.upstreamValidator.summary(data, {
      upstream: !this.config.isCherryPickPolicyEmpty(),
      tracker: !this.config.isTrackerPolicyEmpty(),
    });

    return {
      status: upstreamSummary.status,
      message: `| ${commitUrl} - _${commitTitle}_ | ${upstreamSummary.message} |`,
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
        tracker.message = '**Missing issue tracker ✋**';
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
    let trackerID = '**Missing, needs inspection! ✋**';

    // ! FIXME: This is duplication of code from TrackerValidator.getMessage() and should be refactored
    if (tracker) {
      if (!tracker?.id && !tracker?.exception) {
        trackerID = tracker.message;
      } else if (!tracker?.id && tracker?.exception) {
        trackerID = `\`${tracker.exception}\``;
      } else if (tracker?.id) {
        trackerID = `[${tracker.id}](${tracker.url})`;
      }
    }

    const validCommits = Commit.getValidCommits(commitsMetadata);
    const invalidCommits = Commit.getInvalidCommits(commitsMetadata);

    let summaryMessage = `Tracker - ${trackerID}`;
    if (validCommits.length > 0) {
      summaryMessage += '\n\n';
      summaryMessage += '#### The following commits meet all requirements';
      summaryMessage += '\n\n';
      summaryMessage += '| commit | upstream |\n';
      summaryMessage += '|---|---|\n';
      summaryMessage += `${Commit.getListOfCommits(validCommits)}`;
    }

    if (invalidCommits.length > 0) {
      summaryMessage += '\n\n';
      summaryMessage += '#### The following commits need an inspection';
      summaryMessage += '\n\n';
      summaryMessage += '| commit | note |\n';
      summaryMessage += '|---|---|\n';
      summaryMessage += `${Commit.getListOfCommits(invalidCommits)}`;
    }

    return summaryMessage;
  }

  overallStatus(
    tracker: OutputValidatedPullRequestMetadataT['validation']['tracker'],
    commitsMetadata: Commit[]
  ): StatusT {
    if (!this.config.isTrackerPolicyEmpty()) {
      if (tracker === undefined) {
        return 'failure';
      }

      if (!tracker?.id && !tracker?.exception) {
        return 'failure';
      }

      if (tracker?.id === '' && tracker?.exception) {
        return 'failure';
      }
    }

    if (!this.config.isCherryPickPolicyEmpty()) {
      commitsMetadata.forEach(commit => {
        if (commit.validation.upstream?.status === 'failure') {
          return 'failure';
        }
      });
    }

    return 'success';
  }
}
