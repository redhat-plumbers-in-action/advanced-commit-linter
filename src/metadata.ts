import { Context } from 'probot';

import { events } from './events';
import MetadataController from 'issue-metadata';
import { getInput } from '@actions/core';
import { z } from 'zod';

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
    if (this.commentID !== undefined) {
      await this.controller.setMetadata(
        this.issueNumber,
        Metadata.metadataCommentID,
        this.commentID
      );
    }
  }

  static async getMetadata(
    issueNumber: number,
    context: {
      [K in keyof typeof events]: Context<typeof events[K][number]>;
    }[keyof typeof events]
  ) {
    const controller = new MetadataController(
      'advanced-commit-linter',
      context.repo({
        headers: {
          authorization: getInput('token', { required: true }),
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
