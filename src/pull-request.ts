import { warning } from '@actions/core';
import { context } from '@actions/github';
import { Endpoints } from '@octokit/types';

import { Metadata } from './metadata';
import { CustomOctokit } from './octokit';

export class PullRequest {
  constructor(readonly id: number, private _metadata: Metadata) {}

  get metadata() {
    return this._metadata;
  }

  async publishComment(content: string, octokit: CustomOctokit) {
    if (this.metadata.commentID) {
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

  private async createComment(
    body: string,
    octokit: CustomOctokit
  ): Promise<
    | Endpoints['POST /repos/{owner}/{repo}/issues/{issue_number}/comments']['response']['data']
    | undefined
  > {
    if (!body || body === '') return;

    return (
      await octokit.request(
        'POST /repos/{owner}/{repo}/issues/{issue_number}/comments',
        {
          ...context.repo,
          issue_number: this.id,
          body,
        }
      )
    ).data;
  }

  private async updateComment(
    body: string,
    octokit: CustomOctokit
  ): Promise<
    | Endpoints['PATCH /repos/{owner}/{repo}/issues/comments/{comment_id}']['response']['data']
    | undefined
  > {
    if (!this.metadata.commentID) return;

    return (
      await octokit.request(
        'PATCH /repos/{owner}/{repo}/issues/comments/{comment_id}',
        {
          ...context.repo,
          comment_id: +this.metadata.commentID,
          body,
        }
      )
    ).data;
  }

  static async getPullRequest(id: number) {
    return new PullRequest(id, await Metadata.getMetadata(id));
  }
}
