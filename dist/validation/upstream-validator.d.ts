import { Context } from 'probot';
import { events } from '../events';
import { ConfigCherryPick, ConfigException } from '../schema/config';
import { SingleCommitMetadata } from '../schema/input';
import { Status, Upstream, ValidatedCommit } from '../schema/output';
export declare class UpstreamValidator {
    config: ConfigCherryPick;
    isCherryPickPolicyEmpty: boolean;
    constructor(config: ConfigCherryPick, isCherryPickPolicyEmpty: boolean);
    validate(singleCommitMetadata: SingleCommitMetadata, context: {
        [K in keyof typeof events]: Context<(typeof events)[K][number]>;
    }[keyof typeof events]): Promise<Upstream | undefined>;
    loopPolicy(cherryPick: SingleCommitMetadata['message']['cherryPick'][number], context: {
        [K in keyof typeof events]: Context<(typeof events)[K][number]>;
    }[keyof typeof events]): Promise<Upstream['data']>;
    verifyCherryPick(cherryPick: SingleCommitMetadata['message']['cherryPick'][number], upstream: ConfigCherryPick['upstream'][number], context: {
        [K in keyof typeof events]: Context<(typeof events)[K][number]>;
    }[keyof typeof events]): Promise<Partial<Upstream['data'][number]>>;
    isException(exceptionPolicy: ConfigException | undefined, commitBody: string): string;
    getStatus(data: Upstream['data'], exception: Upstream['exception']): Status;
    cleanArray(validationArray: Promise<Partial<Upstream['data'][number]>>[]): Promise<Upstream['data']>;
    summary(data: ValidatedCommit, validation: {
        upstream: boolean;
        tracker: boolean;
    }): Pick<ValidatedCommit, 'status' | 'message'>;
}
