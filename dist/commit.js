export class Commit {
    constructor(metadata) {
        this.metadata = metadata;
        this.validation = {
            status: 'failure',
            message: '',
        };
    }
    async validate(validator) {
        this.validation = await validator.validateCommit(this.metadata);
        return this;
    }
    get validated() {
        return Object.assign(Object.assign({}, this.metadata), { validation: this.validation });
    }
    haveTracker() {
        return this.validation.upstream !== undefined;
    }
    haveUpstream() {
        return this.validation.upstream !== undefined;
    }
    static getValidCommits(commits) {
        return commits.filter(commit => commit.validation.status === 'success');
    }
    static getInvalidCommits(commits) {
        return commits.filter(commit => commit.validation.status === 'failure');
    }
    static getListOfCommits(commits) {
        return commits.map(commit => commit.validation.message).join('\n');
    }
}
//# sourceMappingURL=commit.js.map