import { error } from '@actions/core';
import { z } from 'zod';
import { upstreamDataSchema } from '../schema/output';
import { isException } from './util';
export class UpstreamValidator {
    constructor(config, isCherryPickPolicyEmpty) {
        this.config = config;
        this.isCherryPickPolicyEmpty = isCherryPickPolicyEmpty;
    }
    async validate(singleCommitMetadata, octokit) {
        let data = [];
        for (const cherryPick of singleCommitMetadata.message.cherryPick) {
            data = data.concat(await this.loopPolicy(cherryPick, octokit));
        }
        const exception = isException(this.config.exception, singleCommitMetadata.message.body);
        return {
            data,
            status: this.getStatus(data, exception),
            exception,
        };
    }
    async loopPolicy(cherryPick, octokit) {
        return this.cleanArray(this.config.upstream.map(async (upstream) => {
            return await this.verifyCherryPick(cherryPick, upstream, octokit);
        }));
    }
    async verifyCherryPick(cherryPick, upstream, octokit) {
        try {
            const { status, data } = await octokit.request('GET /repos/{owner}/{repo}/commits/{ref}', {
                owner: upstream.github.split('/')[0],
                repo: upstream.github.split('/')[1],
                ref: cherryPick.sha,
            });
            return status === 200
                ? { sha: data.sha, repo: upstream.github, url: data.html_url }
                : {};
        }
        catch (e) {
            error(`Error ocurred when verifying upstream commit: ${e}`);
        }
        return {};
    }
    getStatus(data, exception) {
        return data.length > 0 || exception || this.isCherryPickPolicyEmpty
            ? 'success'
            : 'failure';
    }
    async cleanArray(validationArray) {
        if (validationArray === undefined)
            return [];
        const data = await Promise.all(validationArray);
        const filtered = data.filter(item => Object.keys(item).length > 0);
        const parsed = z.array(upstreamDataSchema).safeParse(filtered);
        return parsed.success ? parsed.data : [];
    }
}
//# sourceMappingURL=upstream-validator.js.map