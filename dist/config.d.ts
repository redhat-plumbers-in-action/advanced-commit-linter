import { CustomOctokit } from './octokit';
import { ConfigPolicy } from './schema/config';
export declare class Config {
    policy: ConfigPolicy;
    constructor(config: unknown);
    get tracker(): {
        type: "jira" | "bugzilla";
        keyword: string[];
        'issue-format': string[];
        url?: string | undefined;
        exception?: {
            label?: string[] | undefined;
            note?: string[] | undefined;
        } | undefined;
    }[];
    get cherryPick(): {
        upstream: {
            github: string;
        }[];
        exception?: {
            label?: string[] | undefined;
            note?: string[] | undefined;
        } | undefined;
    };
    isTrackerPolicyEmpty(): boolean;
    isCherryPickPolicyEmpty(): boolean;
    static getConfig(octokit: CustomOctokit): Promise<Config>;
    static isConfigEmpty(config: unknown): config is null | undefined;
}
