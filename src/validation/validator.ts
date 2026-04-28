import {
  OutputValidatedPullRequestMetadata,
  Tracker,
  ValidatedCommit,
  Status,
} from '../schema/output';
import { TrackerValidator } from './tracker-validator';
import { UpstreamValidator } from './upstream-validator';

import { Commit } from '../commit';
import { Config } from '../config';
import { CustomOctokit } from '../octokit';

import { SingleCommitMetadata } from '../schema/input';

export class Validator {
  trackerValidator: TrackerValidator[];
  upstreamValidator: UpstreamValidator;

  constructor(
    readonly config: Config,
    readonly octokit: CustomOctokit
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
  ): OutputValidatedPullRequestMetadata['validation'] {
    const tracker = this.aggregatePrTracker(validatedCommits);
    const status = this.computePrStatus(tracker, validatedCommits);
    const message = this.buildPrMessage(tracker, validatedCommits);

    return { status, tracker, message };
  }

  async validateCommit(
    commitMetadata: SingleCommitMetadata
  ): Promise<ValidatedCommit> {
    const tracker = this.buildTrackerResult(commitMetadata);
    const upstream = await this.upstreamValidator.validate(
      commitMetadata,
      this.octokit
    );

    const { status: summaryStatus, message } = this.buildCommitSummary(
      { tracker, upstream },
      commitMetadata.message.title,
      commitMetadata.url
    );

    const status =
      summaryStatus === 'success' && tracker?.status === 'success'
        ? 'success'
        : 'failure';

    return { status, message, tracker, upstream };
  }

  private buildTrackerResult(
    commitMetadata: SingleCommitMetadata
  ): ValidatedCommit['tracker'] {
    const rawData = this.trackerValidator.map(t => t.validate(commitMetadata));

    const cleaned = Validator.cleanTrackerArray({
      status: 'failure',
      message: '',
      data: rawData,
    });

    if (!cleaned) return cleaned;

    const isTrackerPolicyEmpty = this.config.isTrackerPolicyEmpty();
    const status = Validator.getTrackerStatus(
      cleaned.data,
      isTrackerPolicyEmpty
    );
    const message = Validator.getTrackerMessage(
      cleaned.data,
      status,
      isTrackerPolicyEmpty
    );

    return { ...cleaned, status, message };
  }

  private buildCommitSummary(
    data: Pick<ValidatedCommit, 'tracker' | 'upstream'>,
    commitTitle: string,
    commitUrl: string
  ): Pick<ValidatedCommit, 'status' | 'message'> {
    let status: Status = 'success';
    const messages: string[] = [];

    if (!this.config.isTrackerPolicyEmpty()) {
      if (data.tracker && data.tracker.status === 'failure') {
        status = 'failure';
        messages.push(data.tracker.message);
      }
    }

    if (!this.config.isCherryPickPolicyEmpty()) {
      if (data.upstream && data.upstream.status === 'failure') {
        status = 'failure';
        messages.push('**Missing upstream reference** ‼️');
      }
    }

    if (status === 'failure') {
      return {
        status,
        message: `| ${commitUrl} - _${commitTitle}_ | ${messages.join('</br>')} |`,
      };
    }

    if (
      (!data.upstream || data.upstream.data.length === 0) &&
      !data.upstream?.exception
    ) {
      return {
        status: 'success',
        message: `| ${commitUrl} - _${commitTitle}_ | _no upstream_ |`,
      };
    }

    const upstreamParts: string[] = [];

    if (data.upstream?.exception) {
      upstreamParts.push(`\`${data.upstream.exception}\``);
    }

    data.upstream?.data.forEach(upstream => {
      upstreamParts.push(`${upstream.url}`);
    });

    return {
      status: 'success',
      message: `| ${commitUrl} - _${commitTitle}_ | ${upstreamParts.join('</br>')} |`,
    };
  }

  aggregatePrTracker(
    commitsMetadata: Commit[]
  ): OutputValidatedPullRequestMetadata['validation']['tracker'] {
    if (this.config.isTrackerPolicyEmpty()) return undefined;

    const tracker: OutputValidatedPullRequestMetadata['validation']['tracker'] =
      { message: '', type: 'unknown' };

    const prUniqueTracker: Tracker[] = [];
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

      const uniqueTracker: Tracker[] = [];
      for (const t of validation.tracker.data) {
        const isDuplicate = uniqueTracker.find(
          obj => obj.data?.id === t.data?.id
        );
        if (!isDuplicate) {
          uniqueTracker.push(t);
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
      const realTrackers = prUniqueTracker.filter(t => t.data);
      const exceptionOnly = prUniqueTracker.filter(t => !t.data);

      if (realTrackers.length === 1) {
        const parts: string[] = [
          ...exceptionOnly.map(t => `\`${t.exception}\``),
          `[${realTrackers[0].data?.id}](${realTrackers[0].data?.url})`,
        ];

        return {
          id: realTrackers[0].data?.id,
          type: realTrackers[0].data?.type ?? 'unknown',
          url: realTrackers[0].data?.url,
          message: parts.join(', '),
          exception: realTrackers[0].exception,
        };
      }

      const trackers = prUniqueTracker.map(t => {
        if (t.exception && !t.data) return `\`${t.exception}\``;
        return `[${t.data?.id}](${t.data?.url})`;
      });

      tracker.message = `${trackers.join(', ')}`;
      return tracker;
    }

    return {
      id: prUniqueTracker[0].data?.id,
      type: prUniqueTracker[0].data?.type ?? 'unknown',
      url: prUniqueTracker[0].data?.url,
      message: 'Tracker found',
      exception: prUniqueTracker[0].exception,
    };
  }

  buildPrMessage(
    tracker: OutputValidatedPullRequestMetadata['validation']['tracker'],
    commitsMetadata: Commit[]
  ): string {
    const trackerID =
      !tracker && this.config.isTrackerPolicyEmpty()
        ? '_no tracker_'
        : Validator.formatTrackerId(tracker);

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

  computePrStatus(
    tracker: OutputValidatedPullRequestMetadata['validation']['tracker'],
    commitsMetadata: Commit[]
  ): Status {
    if (!this.config.isTrackerPolicyEmpty()) {
      if (tracker === undefined) return 'failure';
      if (!tracker?.id && !tracker?.exception) return 'failure';
      if (tracker?.id === '' && tracker?.exception) return 'failure';
    }

    if (!this.config.isCherryPickPolicyEmpty()) {
      const hasUpstreamFailure = commitsMetadata.some(
        commit => commit.validation.upstream?.status === 'failure'
      );
      if (hasUpstreamFailure) return 'failure';
    }

    return 'success';
  }

  static formatTrackerId(
    tracker:
      | { id?: string; url?: string; exception?: string; message?: string }
      | undefined
  ): string {
    if (!tracker) return '**Missing, needs inspection! ✋**';
    if (tracker.id) return `[${tracker.id}](${tracker.url})`;
    if (tracker.exception) return `\`${tracker.exception}\``;
    return tracker.message ?? '**Missing, needs inspection! ✋**';
  }

  static getTrackerStatus(
    tracker: Tracker[],
    isTrackerPolicyEmpty: boolean
  ): Status {
    if (isTrackerPolicyEmpty) return 'success';
    if (tracker.length === 0) return 'failure';

    for (const single of tracker) {
      if (single.data === undefined && single.exception === undefined) {
        return 'failure';
      }
    }

    return 'success';
  }

  static getTrackerMessage(
    trackers: Tracker[],
    status: Status,
    isTrackerPolicyEmpty: boolean
  ): string {
    if (isTrackerPolicyEmpty) return '_no tracker_';

    if (status === 'failure') return '**Missing issue tracker** ✋';

    const trackersResult: string[] = [];

    for (const singleTracker of trackers) {
      if (!singleTracker?.data && !singleTracker?.exception) continue;

      if (singleTracker?.exception && !singleTracker?.data) {
        trackersResult.push(singleTracker.exception);
        continue;
      }

      if (!singleTracker.data) continue;

      if (!singleTracker.data.url || singleTracker.data?.url === '') {
        trackersResult.push(singleTracker.data.id);
        continue;
      }

      trackersResult.push(
        `[${singleTracker.data.id}](${singleTracker.data.url})`
      );
    }

    return trackersResult.join(', ');
  }

  static cleanTrackerArray(
    validationArray: ValidatedCommit['tracker']
  ): ValidatedCommit['tracker'] {
    if (validationArray === undefined) return undefined;
    if (
      Array.isArray(validationArray.data) &&
      validationArray.data.length === 0
    )
      return validationArray;

    const cleanedData = validationArray.data.filter(tracker =>
      Object.values(tracker).some(v => v !== undefined)
    );

    return {
      ...validationArray,
      data: cleanedData,
    };
  }
}
