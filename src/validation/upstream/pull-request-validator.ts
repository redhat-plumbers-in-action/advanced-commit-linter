import { Commit } from '../../commit';
import { Config } from '../../config';
import { UpstreamCommitValidator } from './commit-validator';

import { Status } from '../../schema/output';

export class UpstreamPullRequestValidator {
  commitValidators: UpstreamCommitValidator[] = [];

  status: Status = 'failure';
  statusMessage: string | undefined;

  constructor(readonly config: Config, commits: Commit[]) {
    commits.forEach(commit => {
      this.commitValidators.push(new UpstreamCommitValidator(config, commit));
    });

    this.validate();
  }

  validate() {
    return;
  }
}
