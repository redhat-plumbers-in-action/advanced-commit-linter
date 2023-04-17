import { warning } from '@actions/core';
import { Metadata } from './metadata';
export class PullRequest {
    constructor(id, _metadata) {
        this.id = id;
        this._metadata = _metadata;
    }
    get metadata() {
        return this._metadata;
    }
    async publishComment(content, context) {
        var _a;
        if (this.metadata.commentID) {
            this.updateComment(content, context);
            return;
        }
        const commentPayload = (_a = (await this.createComment(content, context))) === null || _a === void 0 ? void 0 : _a.data;
        if (!commentPayload) {
            warning(`Failed to create comment.`);
            return;
        }
        this.metadata.commentID = commentPayload.id.toString();
        await this.metadata.setMetadata();
    }
    async createComment(body, context) {
        if (!body || body === '')
            return;
        return context.octokit.issues.createComment(context.issue({
            issue_number: this.id,
            body,
        }));
    }
    async updateComment(body, context) {
        if (!this.metadata.commentID)
            return;
        return context.octokit.issues.updateComment(context.issue({
            comment_id: +this.metadata.commentID,
            body,
        }));
    }
    static async getPullRequest(id, context) {
        return new PullRequest(id, await Metadata.getMetadata(id, context));
    }
}
//# sourceMappingURL=pull-request.js.map