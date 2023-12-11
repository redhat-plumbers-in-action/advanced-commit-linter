import { warning } from '@actions/core';
import { context } from '@actions/github';
import { Metadata } from './metadata';
export class PullRequest {
    constructor(id, _metadata) {
        this.id = id;
        this._metadata = _metadata;
    }
    get metadata() {
        return this._metadata;
    }
    async publishComment(content, octokit) {
        if (this.metadata.commentID) {
            // Check if the comment is already up to date
            const currentComment = await this.getComment(octokit);
            if (JSON.stringify(currentComment) === JSON.stringify(content))
                return;
            // Update the comment
            this.updateComment(content, octokit);
            return;
        }
        const commentPayload = await this.createComment(content, octokit);
        if (!commentPayload) {
            warning(`Failed to create comment.`);
            return;
        }
        this.metadata.commentID = commentPayload.id.toString();
        await this.metadata.setMetadata();
    }
    async getComment(octokit) {
        var _a;
        if (!this.metadata.commentID)
            return '';
        const comment = (_a = (await octokit.request('GET /repos/{owner}/{repo}/issues/comments/{comment_id}', Object.assign(Object.assign({}, context.repo), { comment_id: +this.metadata.commentID }))).data.body) !== null && _a !== void 0 ? _a : '';
        return comment;
    }
    async createComment(body, octokit) {
        if (!body || body === '')
            return;
        return (await octokit.request('POST /repos/{owner}/{repo}/issues/{issue_number}/comments', Object.assign(Object.assign({}, context.repo), { issue_number: this.id, body }))).data;
    }
    async updateComment(body, octokit) {
        if (!this.metadata.commentID)
            return;
        return (await octokit.request('PATCH /repos/{owner}/{repo}/issues/comments/{comment_id}', Object.assign(Object.assign({}, context.repo), { comment_id: +this.metadata.commentID, body }))).data;
    }
    static async getPullRequest(id) {
        return new PullRequest(id, await Metadata.getMetadata(id));
    }
}
//# sourceMappingURL=pull-request.js.map