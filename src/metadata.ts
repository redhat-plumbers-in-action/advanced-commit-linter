import { getInput } from '@actions/core';
import { context } from '@actions/github';
import MetadataController from 'issue-metadata';
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
    if (this.commentID === undefined) return;

    await this.controller.setMetadata(
      this.issueNumber,
      Metadata.metadataCommentID,
      this.commentID
    );
  }

  static async getMetadata(issueNumber: number) {
    const controller = new MetadataController('advanced-commit-linter', {
      ...context.repo,
      headers: {
        authorization: `Bearer ${getInput('token', { required: true })}`,
      },
    });

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
