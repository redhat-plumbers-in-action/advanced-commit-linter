import { ConfigCherryPick } from '../schema/config';
import { SingleCommitMetadata } from '../schema/input';
import { Status, Upstream, ValidatedCommit } from '../schema/output';
import { CustomOctokit } from '../octokit';
export declare class UpstreamValidator {
    config: ConfigCherryPick;
    isCherryPickPolicyEmpty: boolean;
    constructor(config: ConfigCherryPick, isCherryPickPolicyEmpty: boolean);
    validate(singleCommitMetadata: SingleCommitMetadata, octokit: CustomOctokit): Promise<Upstream | undefined>;
    loopPolicy(cherryPick: SingleCommitMetadata['message']['cherryPick'][number], octokit: CustomOctokit): Promise<Upstream['data']>;
    verifyCherryPick(cherryPick: SingleCommitMetadata['message']['cherryPick'][number], upstream: ConfigCherryPick['upstream'][number], octokit: CustomOctokit): Promise<Partial<Upstream['data'][number]>>;
    getStatus(data: Upstream['data'], exception: Upstream['exception']): Status;
    cleanArray(validationArray: Promise<Partial<Upstream['data'][number]>>[]): Promise<Upstream['data']>;
    summary(data: ValidatedCommit, validation: {
        upstream: boolean;
        tracker: boolean;
    }): Pick<ValidatedCommit, 'status' | 'message'>;
}
