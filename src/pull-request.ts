import { warning } from '@actions/core';
import { Context } from 'probot';

import { events } from './events';
import { Metadata } from './metadata';
import { Commit } from './commit';
import { TrackerPullRequestValidator } from './validation/tracker/pull-request-validator';
import { Config } from './config';

import { PullRequestMetadata } from './schema/input';
import { UpstreamPullRequestValidator } from './validation/upstream/pull-request-validator';

export class PullRequest {
  readonly id: number;

  readonly commits: Commit[] = [];
  trackerValidator: TrackerPullRequestValidator;
  upstreamValidator: UpstreamPullRequestValidator;

  constructor(
    readonly prMetadata: PullRequestMetadata,
    readonly config: Config,
    private _metadata: Metadata
  ) {
    this.id = prMetadata.number;

    this.commits = prMetadata.commits.map(commit => new Commit(commit));
    this.trackerValidator = new TrackerPullRequestValidator(
      config,
      this.commits
    );
    this.upstreamValidator = new UpstreamPullRequestValidator(
      config,
      this.commits
    );
  }

  // TODO: use validators to validate PR and commits
  // TODO: validation is stored in Validators? And we are able to retrieve it in form of object.
  validate() {
    return;
  }

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

    this.metadata.commentID = commentPayload.id.toString();
    await this.metadata.setMetadata();
  }

  private async createComment(
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
