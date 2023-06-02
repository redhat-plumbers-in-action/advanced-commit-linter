import { getInput, setOutput } from '@actions/core';
import { events } from './events';
import { Config } from './config';
import { Validator } from './validation/validator';
import { pullRequestMetadataSchema } from './schema/input';
import { Commit } from './commit';
import { PullRequest } from './pull-request';
const action = (probot) => {
    probot.on(events.workflow_run, async (context) => {
        const config = await Config.getConfig(context);
        const prMetadataUnsafe = JSON.parse(getInput('pr-metadata', {
            required: true,
        }));
        const prMetadata = pullRequestMetadataSchema.parse(prMetadataUnsafe);
        const commitSha = prMetadata.commits[prMetadata.commits.length - 1].sha;
        // Initialize check run - check in progress
        // https://docs.github.com/en/rest/checks/runs?apiVersion=2022-11-28#create-a-check-run
        const checkRun = await context.octokit.checks.create(context.repo({
            name: 'Advanced Commit Linter',
            head_sha: commitSha,
            status: 'in_progress',
            started_at: new Date().toISOString(),
            output: {
                title: 'Advanced Commit Linter',
                summary: 'Commit validation in progress',
            },
        }));
        const validator = new Validator(config, context);
        const validatedCommits = await Promise.all(prMetadata.commits.map(async (singleCommit) => new Commit(singleCommit).validate(validator)));
        const validationResults = validator.validateAll(validatedCommits);
        const validated = Object.assign(Object.assign({}, prMetadataUnsafe), { validation: validationResults, commits: validatedCommits.map(commit => commit.validated) });
        const pr = await PullRequest.getPullRequest(prMetadata.number, context);
        pr.publishComment(validated.validation.message, context);
        // ! FIXME: outsourced to PullRequest
        const labels = [
            'needs-tracker',
            'needs-upstream',
        ]; /* validator.getLabels(validated); */
        const removeLabels = []; /* validator.getRemoveLabels(validated); */
        // fill labels array with labels to add based on configuration and validation results
        await context.octokit.issues.addLabels(context.issue({
            issue_number: prMetadata.number,
            labels,
        }));
        removeLabels.forEach(async (label) => {
            await context.octokit.issues.removeLabel(context.issue({
                issue_number: prMetadata.number,
                name: label,
            }));
        });
        // ! END FIXME
        setOutput('validated-pr-metadata', JSON.stringify(validated, null, 2));
        // Update check run - check completed + conclusion
        // https://docs.github.com/en/rest/checks/runs?apiVersion=2022-11-28#update-a-check-run
        await context.octokit.checks.update(context.repo({
            check_run_id: checkRun.data.id,
            status: 'completed',
            completed_at: new Date().toISOString(),
            conclusion: validated.validation.status,
            output: {
                title: 'Advanced Commit Linter',
                summary: validated.validation.message,
            },
        }));
    });
};
export default action;
//# sourceMappingURL=action.js.map