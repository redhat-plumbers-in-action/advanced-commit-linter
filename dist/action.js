import { getInput, setOutput } from '@actions/core';
import { events } from './events';
import { Config } from './config';
import { Validator } from './validation/validator';
import { pullRequestMetadataSchema, } from './schema/input';
import { Commit } from './commit';
import { PullRequest } from './pull-request';
const action = (probot) => {
    probot.on(events.workflow_run, async (context) => {
        const config = await Config.getConfig(context);
        const prMetadataUnsafe = JSON.parse(getInput('pr-metadata', {
            required: true,
        }));
        const prMetadata = pullRequestMetadataSchema.parse(prMetadataUnsafe);
        await context.octokit.repos.createCommitStatus(context.repo({
            state: 'pending',
            sha: prMetadata.commits[prMetadata.commits.length - 1].sha,
            description: 'validation',
            context: `Advanced Commit Linter`,
        }));
        const validator = new Validator(config, context);
        const validatedCommits = await Promise.all(prMetadata.commits.map(async (singleCommit) => new Commit(singleCommit).validate(validator)));
        const validationResults = validator.validateAll(validatedCommits);
        const validated = Object.assign(Object.assign({}, prMetadataUnsafe), { validation: validationResults, commits: validatedCommits.map(commit => commit.validated) });
        // TODO post comment on PR / set metadata / update summary / set labels
        const pr = await PullRequest.getPullRequest(prMetadata.number, context);
        pr.publishComment(validated.validation.message, context);
        setOutput('validated-pr-metadata', JSON.stringify(validated, null, 2));
        await context.octokit.repos.createCommitStatus(context.repo({
            state: 'success',
            sha: prMetadata.commits[prMetadata.commits.length - 1].sha,
            context: `Advanced Commit Linter`,
        }));
    });
};
export default action;
//# sourceMappingURL=action.js.map