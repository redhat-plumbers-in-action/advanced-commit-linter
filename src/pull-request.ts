import { warning } from '@actions/core';
import { Context } from 'probot';

import { events } from './events';
import { Metadata } from './metadata';

export class PullRequest {
  constructor(readonly id: number, private _metadata: Metadata) {}

  get metadata() {
    return this._metadata;
  }

  async publishComment(
    content: string,
    context: {
      [K in keyof typeof events]: Context<(typeof events)[K][number]>;
    }[keyof typeof events]
  ) {
    if (this.metadata.commentID) {
      this.updateComment(content, context);
      return;
    }

    const commentPayload = (await this.createComment(content, context))?.data;

    if (!commentPayload) {
      warning(`Failed to create comment.`);
      return;
    }

    return commentPayload.id;
  }

  private createComment(
    body: string,
    context: {
      [K in keyof typeof events]: Context<(typeof events)[K][number]>;
    }[keyof typeof events]
  ) {
    if (!body || body === '') return;

    return context.octokit.issues.createComment(
      context.issue({
        issue_number: this.id,
        body,
      })
    );
  }

  private async updateComment(
    body: string,
    context: {
      [K in keyof typeof events]: Context<(typeof events)[K][number]>;
    }[keyof typeof events]
  ) {
    if (!this.metadata.commentID) return;

    return context.octokit.issues.updateComment(
      context.issue({
        comment_id: +this.metadata.commentID,
        body,
      })
    );
  }

  static async getPullRequest(
    id: number,
    context: {
      [K in keyof typeof events]: Context<(typeof events)[K][number]>;
    }[keyof typeof events]
  ) {
    return new PullRequest(id, await Metadata.getMetadata(id, context));
  }
}
