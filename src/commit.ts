import { Validator } from './validation/validator';

import { SingleCommitMetadataT } from './schema/input';
import { OutputCommitMetadataT, ValidatedCommitT } from './schema/output';

export class Commit {
  validation: ValidatedCommitT = {
    status: 'failure',
    message: '',
    tracker: undefined,
    upstream: undefined,
  };

  constructor(readonly metadata: SingleCommitMetadataT) {}

  async validate(validator: Validator): Promise<Commit> {
    this.validation = await validator.validateCommit(this.metadata);

    return this;
  }

  get validated(): OutputCommitMetadataT[number] {
    return {
      ...this.metadata,
      validation: this.validation,
    };
  }

  haveTracker(): boolean {
    return this.validation.upstream !== undefined;
  }

  haveUpstream(): boolean {
    return this.validation.upstream !== undefined;
  }

  static getValidCommits(commits: Commit[]): Commit[] {
    return commits.filter(commit => commit.validation.status === 'success');
  }

  static getInvalidCommits(commits: Commit[]): Commit[] {
    return commits.filter(commit => commit.validation.status === 'failure');
  }

  static getListOfCommits(commits: Commit[]): string {
    return commits.map(commit => commit.validation.message).join('\n');
  }
}
