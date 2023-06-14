import { debug, getInput } from '@actions/core';
import { context } from '@actions/github';

import { CustomOctokit } from './octokit';
import { configSchema, ConfigPolicy } from './schema/config';

export class Config {
  policy: ConfigPolicy;

  constructor(config: unknown) {
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

  static async getConfig(octokit: CustomOctokit): Promise<Config> {
    const path = getInput('config-path', { required: true });

    const retrievedConfig = (
      await octokit.config.get({ ...context.repo, path })
    ).config;

    debug(`Configuration '${path}': ${JSON.stringify(retrievedConfig)}`);

    if (Config.isConfigEmpty(retrievedConfig)) {
      throw new Error(
        `Missing configuration. Please setup 'Advanced Commit Linter' Action using 'advanced-commit-linter.yml' file.`
      );
    }

    return new this(retrievedConfig);
  }

  static isConfigEmpty(config: unknown) {
    return config === null || config === undefined;
  }
}
