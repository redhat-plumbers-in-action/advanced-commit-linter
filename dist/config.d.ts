import { Context } from 'probot';
import { events } from './events';
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
    static getConfig(context: {
        [K in keyof typeof events]: Context<(typeof events)[K][number]>;
    }[keyof typeof events]): Promise<Config>;
    static isConfigEmpty(config: unknown): boolean;
}
