import { error } from '@actions/core';
import { z } from 'zod';
import { configExceptionSchema, } from '../schema/config';
export class UpstreamValidator {
    constructor(config, isCherryPickPolicyEmpty) {
        this.config = config;
        this.isCherryPickPolicyEmpty = isCherryPickPolicyEmpty;
    }
    async validate(singleCommitMetadata, context) {
        let data = [];
        for (const cherryPick of singleCommitMetadata.message.cherryPick) {
            data = data.concat(await this.loopPolicy(cherryPick, context));
        }
        const result = {
            data,
            status: 'failure',
            exception: this.isException(this.config.exception, singleCommitMetadata.message.body),
        };
        result.status = this.getStatus(result.data, result.exception);
        return result;
    }
    async loopPolicy(cherryPick, context) {
        return this.cleanArray(this.config.upstream.map(async (upstream) => {
            return await this.verifyCherryPick(cherryPick, upstream, context);
        }));
    }
    async verifyCherryPick(cherryPick, upstream, context) {
        try {
            const { status, data } = await context.octokit.repos.getCommit({
                owner: upstream.github.split('/')[0],
                repo: upstream.github.split('/')[1],
                ref: cherryPick.sha,
            });
            return status === 200
                ? { sha: data.sha, repo: upstream.github, url: data.html_url }
                : { sha: '', repo: '', url: '' };
        }
        catch (e) {
            error(`Error ocured when verifiing upstream commit: ${e}`);
        }
        return { sha: '', repo: '', url: '' };
    }
    isException(exceptionPolicy, commitBody) {
        const exceptionPolicySafe = configExceptionSchema
            .extend({ note: z.array(z.string()) })
            .safeParse(exceptionPolicy);
        if (!exceptionPolicySafe.success)
            return '';
        for (const exception of exceptionPolicySafe.data.note) {
            const regexp = new RegExp(`(^\\s*|\\\\n|\\n)(${exception})$`, 'gm');
            const matches = commitBody.matchAll(regexp);
            for (const match of matches) {
                if (Array.isArray(match) && match.length >= 3) {
                    return exception;
                }
            }
        }
        return '';
    }
    getStatus(data, exception) {
        let status = 'failure';
        if (data.length > 0 || exception || this.isCherryPickPolicyEmpty) {
            status = 'success';
        }
        return status;
    }
    async cleanArray(validationArray) {
        if (validationArray === undefined)
            return [];
        const data = await Promise.all(validationArray);
        return data.filter(item => JSON.stringify(item) !== JSON.stringify({ sha: '', repo: '', url: '' }));
    }
    summary(data) {
        if ((data === undefined || data.data.length === 0) &&
            this.config.upstream.length > 0 &&
            (data === null || data === void 0 ? void 0 : data.exception) === '')
            return {
                status: 'failure',
                message: '**Missing upstream reference** ‼️',
            };
        if ((data === undefined || data.data.length === 0) &&
            (data === null || data === void 0 ? void 0 : data.exception) === '')
            return { status: 'success', message: '_no upstream_' };
        const message = [];
        if (data === null || data === void 0 ? void 0 : data.exception) {
            message.push(`\`${data.exception}\``);
        }
        data === null || data === void 0 ? void 0 : data.data.forEach(upstream => {
            message.push(`${upstream.url}`);
        });
        return { status: 'success', message: message.join(' ') };
    }
}
//# sourceMappingURL=upstream-validator.js.map