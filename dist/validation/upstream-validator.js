import { error } from '@actions/core';
import { z } from 'zod';
import { upstreamDataSchema, } from '../schema/output';
import { isException } from './util';
export class UpstreamValidator {
    constructor(config, isCherryPickPolicyEmpty) {
        this.config = config;
        this.isCherryPickPolicyEmpty = isCherryPickPolicyEmpty;
    }
    async validate(singleCommitMetadata, octokit) {
        var _a;
        let data = [];
        for (const cherryPick of singleCommitMetadata.message.cherryPick) {
            data = data.concat(await this.loopPolicy(cherryPick, octokit));
        }
        const result = {
            data,
            status: 'failure',
            // TODO: `?? ''` is workaround. It should be removed after check in general message is updated.
            exception: (_a = isException(this.config.exception, singleCommitMetadata.message.body)) !== null && _a !== void 0 ? _a : '',
        };
        result.status = this.getStatus(result.data, result.exception);
        return result;
    }
    async loopPolicy(cherryPick, octokit) {
        return this.cleanArray(this.config.upstream.map(async (upstream) => {
            return await this.verifyCherryPick(cherryPick, upstream, octokit);
        }));
    }
    // TODO: return undefined if all upstreams are empty
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
        const filtered = data.filter(item => JSON.stringify(item) !== JSON.stringify({}));
        const parsed = z.array(upstreamDataSchema).safeParse(filtered);
        return parsed.success ? parsed.data : [];
    }
    summary(data, validation) {
        var _a, _b, _c, _d;
        const validationSummary = {
            status: 'success',
            message: '',
        };
        const message = [];
        if (validation.tracker) {
            if (data.tracker && data.tracker.status === 'failure') {
                validationSummary.status = 'failure';
                message.push(data.tracker.message);
            }
        }
        if (validation.upstream) {
            if (data.upstream && data.upstream.status === 'failure') {
                validationSummary.status = 'failure';
                message.push('**Missing upstream reference** ‼️');
            }
        }
        if (validationSummary.status === 'failure') {
            validationSummary.message = message.join('</br>');
            return validationSummary;
        }
        if ((!data.upstream || data.upstream.data.length === 0) &&
            ((_a = data.upstream) === null || _a === void 0 ? void 0 : _a.exception) === '')
            return { status: 'success', message: '_no upstream_' };
        if ((_b = data.upstream) === null || _b === void 0 ? void 0 : _b.exception) {
            message.push(`\`${(_c = data.upstream) === null || _c === void 0 ? void 0 : _c.exception}\``);
        }
        (_d = data.upstream) === null || _d === void 0 ? void 0 : _d.data.forEach(upstream => {
            message.push(`${upstream.url}`);
        });
        return { status: 'success', message: message.join('</br>') };
    }
}
//# sourceMappingURL=upstream-validator.js.map