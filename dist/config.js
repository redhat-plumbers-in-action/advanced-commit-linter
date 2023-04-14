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
    static async getConfig(context) {
        const retrievedConfig = await context.config('advanced-commit-linter.yml');
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