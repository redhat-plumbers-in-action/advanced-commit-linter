import { Context } from 'probot';
import { events } from '../events';
import { ConfigCherryPickT, ConfigExceptionT, ConfigT } from '../schema/config';
import { SingleCommitMetadataT } from '../schema/input';
import { StatusT, UpstreamT, ValidatedCommitT } from '../schema/output';
export declare class UpstreamValidator {
    config: ConfigT['policy']['cherry-pick'];
    isCherryPickPolicyEmpty: boolean;
    constructor(config: ConfigT['policy']['cherry-pick'], isCherryPickPolicyEmpty: boolean);
    validate(singleCommitMetadata: SingleCommitMetadataT, context: {
        [K in keyof typeof events]: Context<typeof events[K][number]>;
    }[keyof typeof events]): Promise<UpstreamT | undefined>;
    loopPolicy(cherryPick: SingleCommitMetadataT['message']['cherryPick'][number], context: {
        [K in keyof typeof events]: Context<typeof events[K][number]>;
    }[keyof typeof events]): Promise<UpstreamT['data']>;
    verifyCherryPick(cherryPick: SingleCommitMetadataT['message']['cherryPick'][number], upstream: ConfigCherryPickT['upstream'][number], context: {
        [K in keyof typeof events]: Context<typeof events[K][number]>;
    }[keyof typeof events]): Promise<UpstreamT['data'][number]>;
    isException(exceptionPolicy: ConfigExceptionT | undefined, commitBody: string): string;
    getStatus(data: UpstreamT['data'], exception: UpstreamT['exception']): StatusT;
    cleanArray(validationArray: Promise<UpstreamT['data'][number]>[]): Promise<UpstreamT['data']>;
    summary(data: ValidatedCommitT['upstream']): Pick<ValidatedCommitT, 'status' | 'message'>;
}
