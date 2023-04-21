import { Validator } from './validation/validator';
import { SingleCommitMetadataT } from './schema/input';
import { OutputCommitMetadataT, ValidatedCommitT } from './schema/output';
export declare class Commit {
    readonly metadata: SingleCommitMetadataT;
    validation: ValidatedCommitT;
    constructor(metadata: SingleCommitMetadataT);
    validate(validator: Validator): Promise<Commit>;
    get validated(): OutputCommitMetadataT[number];
    haveTracker(): boolean;
    haveUpstream(): boolean;
    static getValidCommits(commits: Commit[]): Commit[];
    static getInvalidCommits(commits: Commit[]): Commit[];
    static getListOfCommits(commits: Commit[]): string;
}
