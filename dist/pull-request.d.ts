import { Context } from 'probot';
import { events } from './events';
import { Metadata } from './metadata';
export declare class PullRequest {
    readonly id: number;
    private _metadata;
    constructor(id: number, _metadata: Metadata);
    get metadata(): Metadata;
    publishComment(content: string, context: {
        [K in keyof typeof events]: Context<(typeof events)[K][number]>;
    }[keyof typeof events]): Promise<void>;
    private createComment;
    private updateComment;
    static getPullRequest(id: number, context: {
        [K in keyof typeof events]: Context<(typeof events)[K][number]>;
    }[keyof typeof events]): Promise<PullRequest>;
}
