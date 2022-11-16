import { Context } from 'probot';
import { events } from './events';
import { ConfigT } from './schema/config';
export declare class Config {
    policy: ConfigT['policy'];
    constructor(config: unknown);
    get tracker(): {
        exception?: {
            label?: string[] | undefined;
            note?: string[] | undefined;
        } | undefined;
        url?: string | undefined;
        keyword: string[];
        'issue-format': string[];
    }[];
    get cherryPick(): {
        exception?: {
            label?: string[] | undefined;
            note?: string[] | undefined;
        } | undefined;
        upstream: {
            github: string;
        }[];
    };
    isTrackerPolicyEmpty(): boolean;
    isCherryPickPolicyEmpty(): boolean;
    static getConfig(context: {
        [K in keyof typeof events]: Context<typeof events[K][number]>;
    }[keyof typeof events]): Promise<Config>;
    static isConfigEmpty(config: unknown): boolean;
}
