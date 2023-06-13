import { Metadata } from './metadata';
import { CustomOctokit } from './octokit';
export declare class PullRequest {
    readonly id: number;
    private _metadata;
    constructor(id: number, _metadata: Metadata);
    get metadata(): Metadata;
    publishComment(content: string, octokit: CustomOctokit): Promise<void>;
    private createComment;
    private updateComment;
    static getPullRequest(id: number): Promise<PullRequest>;
}
