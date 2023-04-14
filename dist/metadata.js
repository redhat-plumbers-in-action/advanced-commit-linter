import MetadataController from 'issue-metadata';
import { getInput } from '@actions/core';
import { z } from 'zod';
class Metadata {
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
        if (this.commentID !== undefined) {
            await this.controller.setMetadata(this.issueNumber, Metadata.metadataCommentID, this.commentID);
        }
    }
    static async getMetadata(issueNumber, context) {
        const controller = new MetadataController('advanced-commit-linter', context.repo({
            headers: {
                authorization: getInput('token', { required: true }),
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
export { Metadata };
//# sourceMappingURL=metadata.js.map