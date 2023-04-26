import { Validator } from './validation/validator';

import { SingleCommitMetadata } from './schema/input';
import { OutputCommitMetadata, ValidatedCommit } from './schema/output';

export class Commit {
  validation: ValidatedCommit = {
    status: 'failure',
    message: '',
  };

  constructor(readonly metadata: SingleCommitMetadata) {}

  async validate(validator: Validator): Promise<Commit> {
    this.validation = await validator.validateCommit(this.metadata);

    return this;
  }

  get validated(): OutputCommitMetadata[number] {
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
