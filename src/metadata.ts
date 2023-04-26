import { getInput } from '@actions/core';
import MetadataController from 'issue-metadata';
import { Context } from 'probot';
import { z } from 'zod';

import { events } from './events';

type MetadataObjectT = {
  commentID: string | undefined;
};

export class Metadata {
  private _commentID: MetadataObjectT['commentID'];

  constructor(
    readonly issueNumber: number,
    readonly controller: MetadataController,
    metadata: MetadataObjectT
  ) {
    this._commentID = metadata?.commentID ?? undefined;
  }

  get commentID() {
    return this._commentID;
  }

  set commentID(value: MetadataObjectT['commentID']) {
    if (this._commentID === undefined) {
      this._commentID = value;
    }
  }

  static readonly metadataCommentID = 'comment-id';

  async setMetadata() {
    if (this.commentID === undefined) return;

    await this.controller.setMetadata(
      this.issueNumber,
      Metadata.metadataCommentID,
      this.commentID
    );
  }

  static async getMetadata(
    issueNumber: number,
    context: {
      [K in keyof typeof events]: Context<(typeof events)[K][number]>;
    }[keyof typeof events]
  ) {
    const controller = new MetadataController(
      'advanced-commit-linter',
      context.repo({
        headers: {
          authorization: `Bearer ${getInput('token', { required: true })}`,
        },
      })
    );

    const parsedCommentID = z
      .string()
      .safeParse(
        await controller.getMetadata(issueNumber, Metadata.metadataCommentID)
      );

    return new Metadata(issueNumber, controller, {
      commentID: parsedCommentID.success ? parsedCommentID.data : undefined,
    });
  }
}
