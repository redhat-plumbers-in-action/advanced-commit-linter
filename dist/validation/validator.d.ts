import { Context } from 'probot';
import { OutputValidatedPullRequestMetadata, ValidatedCommit, Status } from '../schema/output';
import { TrackerValidator } from './tracker-validator';
import { UpstreamValidator } from './upstream-validator';
import { Commit } from '../commit';
import { Config } from '../config';
import { events } from '../events';
import { SingleCommitMetadata } from '../schema/input';
export declare class Validator {
    readonly config: Config;
    readonly context: {
        [K in keyof typeof events]: Context<(typeof events)[K][number]>;
    }[keyof typeof events];
    trackerValidators: TrackerValidator[];
    upstreamValidator: UpstreamValidator;
    constructor(config: Config, context: {
        [K in keyof typeof events]: Context<(typeof events)[K][number]>;
    }[keyof typeof events]);
    validateAll(validatedCommits: Commit[]): OutputValidatedPullRequestMetadata['validation'];
    validateCommit(commitMetadata: SingleCommitMetadata): Promise<ValidatedCommit>;
    validationSummary(data: ValidatedCommit, commitTitle: string, commitUrl: string): Pick<ValidatedCommit, 'status' | 'message'>;
    generalTracker(commitsMetadata: Commit[]): OutputValidatedPullRequestMetadata['validation']['tracker'];
    overallMessage(tracker: OutputValidatedPullRequestMetadata['validation']['tracker'], commitsMetadata: Commit[]): string;
    overallStatus(tracker: OutputValidatedPullRequestMetadata['validation']['tracker'], commitsMetadata: Commit[]): Status;
}
