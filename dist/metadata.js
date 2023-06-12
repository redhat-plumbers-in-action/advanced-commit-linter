import { getInput } from '@actions/core';
import MetadataController from 'issue-metadata';
import { z } from 'zod';
export class Metadata {
    constructor(issueNumber, controller, metadata) {
        var _a;
        this.issueNumber = issueNumber;
        this.controller = controller;
        this._commentID = (_a = metadata === null || metadata === void 0 ? void 0 : metadata.commentID) !== null && _a !== void 0 ? _a : undefined;
    }
    get commentID() {
        return this._commentID;
    }
    set commentID(value) {
        if (this._commentID === undefined) {
            this._commentID = value;
        }
    }
    async setMetadata() {
        if (this.commentID === undefined)
            return;
        await this.controller.setMetadata(this.issueNumber, Metadata.metadataCommentID, this.commentID);
    }
    static async getMetadata(issueNumber, context) {
        const controller = new MetadataController('advanced-commit-linter', context.repo({
            headers: {
                authorization: `Bearer ${getInput('token', { required: true })}`,
            },
        }));
        const parsedCommentID = z
            .string()
            .safeParse(await controller.getMetadata(issueNumber, Metadata.metadataCommentID));
        return new Metadata(issueNumber, controller, {
            commentID: parsedCommentID.success ? parsedCommentID.data : undefined,
        });
    }
}
Metadata.metadataCommentID = 'comment-id';
//# sourceMappingURL=metadata.js.map