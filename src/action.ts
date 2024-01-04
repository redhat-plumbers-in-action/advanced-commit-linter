import { getBooleanInput, getInput, setOutput } from '@actions/core';
import { context } from '@actions/github';
import { Endpoints } from '@octokit/types';

import { Config } from './config';
import { Validator } from './validation/validator';

import { pullRequestMetadataSchema, PullRequestMetadata } from './schema/input';
import { Commit } from './commit';
import { OutputValidatedPullRequestMetadata } from './schema/output';
import { PullRequest } from './pull-request';
import { CustomOctokit } from './octokit';

async function action(octokit: CustomOctokit) {
  const config = await Config.getConfig(octokit);

  const prMetadataUnsafe = JSON.parse(
    getInput('pr-metadata', {
      required: true,
    })
  );

  const prMetadata = pullRequestMetadataSchema.parse(prMetadataUnsafe);
  const commitSha = prMetadata.commits[prMetadata.commits.length - 1].sha;

  const setStatus = getBooleanInput('set-status', { required: true });
  let checkRun:
    | Endpoints['POST /repos/{owner}/{repo}/check-runs']['response']
    | undefined;

  // Initialize check run - check in progress
  // https://docs.github.com/en/rest/checks/runs?apiVersion=2022-11-28#create-a-check-run
  if (setStatus) {
    checkRun = await octokit.request('POST /repos/{owner}/{repo}/check-runs', {
      ...context.repo,
      name: 'Advanced Commit Linter',
      head_sha: commitSha,
      status: 'in_progress',
      started_at: new Date().toISOString(),
      output: {
        title: 'Advanced Commit Linter',
        summary: 'Commit validation in progress',
      },
    });
  }

  const validator = new Validator(config, octokit);

  const validatedCommits = await Promise.all(
    prMetadata.commits.map(async singleCommit =>
      new Commit(singleCommit).validate(validator)
    )
  );

  const validationResults = validator.validateAll(validatedCommits);

  const validated: OutputValidatedPullRequestMetadata = {
    ...(prMetadataUnsafe as PullRequestMetadata & {
      [key: string]: string;
    }),
    validation: validationResults,
    commits: validatedCommits.map(commit => commit.validated),
  };

  const pr = await PullRequest.getPullRequest(prMetadata.number);
  pr.publishComment(validated.validation.message, octokit);

  setOutput('validated-pr-metadata', JSON.stringify(validated, null, 2));

  // Update check run - check completed + conclusion
  // https://docs.github.com/en/rest/checks/runs?apiVersion=2022-11-28#update-a-check-run
  if (setStatus && checkRun) {
    await octokit.request(
      'PATCH /repos/{owner}/{repo}/check-runs/{check_run_id}',
      {
        ...context.repo,
        check_run_id: checkRun.data.id,
        status: 'completed' as unknown as undefined,
        completed_at: new Date().toISOString(),
        conclusion: validated.validation.status,
        output: {
          title: 'Advanced Commit Linter',
          summary: validated.validation.message,
        },
      }
    );
  }
}

export default action;
