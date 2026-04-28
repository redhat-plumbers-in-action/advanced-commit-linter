import { OutputValidatedPullRequestMetadata, Tracker, ValidatedCommit, Status } from '../schema/output';
import { TrackerValidator } from './tracker-validator';
import { UpstreamValidator } from './upstream-validator';
import { Commit } from '../commit';
import { Config } from '../config';
import { CustomOctokit } from '../octokit';
import { SingleCommitMetadata } from '../schema/input';
export declare class Validator {
    readonly config: Config;
    readonly octokit: CustomOctokit;
    trackerValidator: TrackerValidator[];
    upstreamValidator: UpstreamValidator;
    constructor(config: Config, octokit: CustomOctokit);
    validateAll(validatedCommits: Commit[]): OutputValidatedPullRequestMetadata['validation'];
    validateCommit(commitMetadata: SingleCommitMetadata): Promise<ValidatedCommit>;
    private buildTrackerResult;
    private buildCommitSummary;
    aggregatePrTracker(commitsMetadata: Commit[]): OutputValidatedPullRequestMetadata['validation']['tracker'];
    buildPrMessage(tracker: OutputValidatedPullRequestMetadata['validation']['tracker'], commitsMetadata: Commit[]): string;
    computePrStatus(tracker: OutputValidatedPullRequestMetadata['validation']['tracker'], commitsMetadata: Commit[]): Status;
    static formatTrackerId(tracker: {
        id?: string;
        url?: string;
        exception?: string;
        message?: string;
    } | undefined): string;
    static getTrackerStatus(tracker: Tracker[], isTrackerPolicyEmpty: boolean): Status;
    static getTrackerMessage(trackers: Tracker[], status: Status, isTrackerPolicyEmpty: boolean): string;
    static cleanTrackerArray(validationArray: ValidatedCommit['tracker']): ValidatedCommit['tracker'];
}
