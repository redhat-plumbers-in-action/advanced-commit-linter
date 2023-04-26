import { Context } from 'probot';
import { OutputValidatedPullRequestMetadataT, ValidatedCommitT, StatusT } from '../schema/output';
import { TrackerValidator } from './tracker-validator';
import { UpstreamValidator } from './upstream-validator';
import { Commit } from '../commit';
import { Config } from '../config';
import { events } from '../events';
import { SingleCommitMetadataT } from '../schema/input';
export declare class Validator {
    readonly config: Config;
    readonly context: {
        [K in keyof typeof events]: Context<(typeof events)[K][number]>;
    }[keyof typeof events];
    trackerValidator: TrackerValidator[];
    upstreamValidator: UpstreamValidator;
    constructor(config: Config, context: {
        [K in keyof typeof events]: Context<(typeof events)[K][number]>;
    }[keyof typeof events]);
    validateAll(validatedCommits: Commit[]): OutputValidatedPullRequestMetadataT['validation'];
    validateCommit(commitMetadata: SingleCommitMetadataT): Promise<ValidatedCommitT>;
    validationSummary(data: ValidatedCommitT, commitTitle: string, commitUrl: string): Pick<ValidatedCommitT, 'status' | 'message'>;
    generalTracker(commitsMetadata: Commit[]): OutputValidatedPullRequestMetadataT['validation']['tracker'];
    overallMessage(tracker: OutputValidatedPullRequestMetadataT['validation']['tracker'], commitsMetadata: Commit[]): string;
    overallStatus(tracker: OutputValidatedPullRequestMetadataT['validation']['tracker'], commitsMetadata: Commit[]): StatusT;
}
