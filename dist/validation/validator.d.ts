import { OutputValidatedPullRequestMetadata, ValidatedCommit, Status } from '../schema/output';
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
    validationSummary(data: ValidatedCommit, commitTitle: string, commitUrl: string): Pick<ValidatedCommit, 'status' | 'message'>;
    generalTracker(commitsMetadata: Commit[]): OutputValidatedPullRequestMetadata['validation']['tracker'];
    overallMessage(tracker: OutputValidatedPullRequestMetadata['validation']['tracker'], commitsMetadata: Commit[]): string;
    overallStatus(tracker: OutputValidatedPullRequestMetadata['validation']['tracker'], commitsMetadata: Commit[]): Status;
}
