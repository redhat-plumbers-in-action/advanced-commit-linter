import MetadataController from 'issue-metadata';
import { Context } from 'probot';
import { events } from './events';
type MetadataObjectT = {
    commentID: string | undefined;
};
export declare class Metadata {
    readonly issueNumber: number;
    readonly controller: MetadataController;
    private _commentID;
    constructor(issueNumber: number, controller: MetadataController, metadata: MetadataObjectT);
    get commentID(): MetadataObjectT['commentID'];
    set commentID(value: MetadataObjectT['commentID']);
    static readonly metadataCommentID = "comment-id";
    setMetadata(): Promise<void>;
    static getMetadata(issueNumber: number, context: {
        [K in keyof typeof events]: Context<(typeof events)[K][number]>;
    }[keyof typeof events]): Promise<Metadata>;
}
export {};
