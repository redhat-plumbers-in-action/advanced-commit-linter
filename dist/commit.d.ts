import { Validator } from './validation/validator';
import { SingleCommitMetadata } from './schema/input';
import { OutputCommitMetadata, ValidatedCommit } from './schema/output';
export declare class Commit {
    readonly metadata: SingleCommitMetadata;
    validation: ValidatedCommit;
    constructor(metadata: SingleCommitMetadata);
    validate(validator: Validator): Promise<Commit>;
    get validated(): OutputCommitMetadata[number];
    static getValidCommits(commits: Commit[]): Commit[];
    static getInvalidCommits(commits: Commit[]): Commit[];
    static getListOfCommits(commits: Commit[]): string;
}
