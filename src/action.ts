import { getInput, setOutput } from '@actions/core';
import { Context, Probot } from 'probot';

import { events } from './events';
import { Config } from './config';
import { Validator } from './validation/validator';

import { pullRequestMetadataSchema, PullRequestMetadata } from './schema/input';
import { Commit } from './commit';
import { OutputValidatedPullRequestMetadata } from './schema/output';
import { PullRequest } from './pull-request';

const action = (probot: Probot) => {
  probot.on(
    events.workflow_run,
    async (context: Context<(typeof events.workflow_run)[number]>) => {
      const config = await Config.getConfig(context);

      const prMetadataUnsafe = JSON.parse(
        getInput('pr-metadata', {
          required: true,
        })
      );

      const prMetadata = pullRequestMetadataSchema.parse(prMetadataUnsafe);
      const commitSha = prMetadata.commits[prMetadata.commits.length - 1].sha;

      // Initialize check run - check in progress
      // https://docs.github.com/en/rest/checks/runs?apiVersion=2022-11-28#create-a-check-run
      const checkRun = await context.octokit.checks.create(
        context.repo({
          name: 'Advanced Commit Linter',
          head_sha: commitSha,
          status: 'in_progress',
          started_at: new Date().toISOString(),
          output: {
            title: 'Advanced Commit Linter',
            summary: 'Commit validation in progress',
          },
        })
      );

      const validator = new Validator(config, context);

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

      const pr = await PullRequest.getPullRequest(prMetadata.number, context);
      pr.publishComment(validated.validation.message, context);

      setOutput('validated-pr-metadata', JSON.stringify(validated, null, 2));

      // Update check run - check completed + conclusion
      // https://docs.github.com/en/rest/checks/runs?apiVersion=2022-11-28#update-a-check-run
      await context.octokit.checks.update(
        context.repo({
          check_run_id: checkRun.data.id,
          status: 'completed',
          completed_at: new Date().toISOString(),
          conclusion: validated.validation.status,
          output: {
            title: 'Advanced Commit Linter',
            summary: validated.validation.message,
          },
        })
      );
    }
  );
};

export default action;
