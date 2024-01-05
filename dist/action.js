import { getBooleanInput, getInput, setOutput } from '@actions/core';
import { context } from '@actions/github';
import { Config } from './config';
import { Validator } from './validation/validator';
import { pullRequestMetadataSchema } from './schema/input';
import { Commit } from './commit';
async function action(octokit) {
    const config = await Config.getConfig(octokit);
    const prMetadataUnsafe = JSON.parse(getInput('pr-metadata', {
        required: true,
    }));
    const prMetadata = pullRequestMetadataSchema.parse(prMetadataUnsafe);
    const commitSha = prMetadata.commits[prMetadata.commits.length - 1].sha;
    const statusTitle = getInput('status-title', { required: true });
    const setStatus = getBooleanInput('set-status', { required: true });
    let checkRun;
    // Initialize check run - check in progress
    // https://docs.github.com/en/rest/checks/runs?apiVersion=2022-11-28#create-a-check-run
    if (setStatus) {
        checkRun = await octokit.request('POST /repos/{owner}/{repo}/check-runs', Object.assign(Object.assign({}, context.repo), { name: 'Advanced Commit Linter', head_sha: commitSha, status: 'in_progress', started_at: new Date().toISOString(), output: {
                title: statusTitle.length === 0 ? 'Advanced Commit Linter' : statusTitle,
                summary: 'Commit validation in progress',
            } }));
    }
    const validator = new Validator(config, octokit);
    const validatedCommits = await Promise.all(prMetadata.commits.map(async (singleCommit) => new Commit(singleCommit).validate(validator)));
    const validationResults = validator.validateAll(validatedCommits);
    const validated = Object.assign(Object.assign({}, prMetadataUnsafe), { validation: validationResults, commits: validatedCommits.map(commit => commit.validated) });
    // Update check run - check completed + conclusion
    // https://docs.github.com/en/rest/checks/runs?apiVersion=2022-11-28#update-a-check-run
    if (setStatus && checkRun) {
        await octokit.request('PATCH /repos/{owner}/{repo}/check-runs/{check_run_id}', Object.assign(Object.assign({}, context.repo), { check_run_id: checkRun.data.id, status: 'completed', completed_at: new Date().toISOString(), conclusion: validated.validation.status, output: {
                title: statusTitle.length === 0 ? 'Advanced Commit Linter' : statusTitle,
                summary: validated.validation.message,
            } }));
    }
    if (statusTitle.length > 0) {
        validated.validation.message = `### ${statusTitle}\n\n${validated.validation.message}`;
    }
    setOutput('validated-pr-metadata', JSON.stringify(validated, null, 2));
}
export default action;
//# sourceMappingURL=action.js.map