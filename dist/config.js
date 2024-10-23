import { debug, getInput } from '@actions/core';
import { context } from '@actions/github';
import { configSchema } from './schema/config';
export class Config {
    constructor(config) {
        this.policy = configSchema.parse(config).policy;
    }
    get tracker() {
        return this.policy.tracker;
    }
    get cherryPick() {
        return this.policy['cherry-pick'];
    }
    isTrackerPolicyEmpty() {
        return this.policy.tracker.length === 0;
    }
    isCherryPickPolicyEmpty() {
        return this.policy['cherry-pick'].upstream.length === 0;
    }
    static async getConfig(octokit) {
        const path = getInput('config-path', { required: true });
        const retrievedConfig = (await octokit.config.get(Object.assign(Object.assign({}, context.repo), { path }))).config;
        debug(`Configuration '${path}': ${JSON.stringify(retrievedConfig)}`);
        if (Config.isConfigEmpty(retrievedConfig)) {
            throw new Error(`Missing configuration. Please setup 'Advanced Commit Linter' Action using 'advanced-commit-linter.yml' file.`);
        }
        return new this(retrievedConfig);
    }
    static isConfigEmpty(config) {
        return config === null || config === undefined;
    }
}
//# sourceMappingURL=config.js.map