import { isException } from './util';
export class TrackerValidator {
    constructor(config) {
        this.config = config;
    }
    validate(singleCommitMetadata) {
        const exception = isException(this.config.exception, singleCommitMetadata.message.body);
        const detectedTrackers = this.gatherTrackers(singleCommitMetadata.message.body);
        return Object.assign(Object.assign({}, detectedTrackers), { exception });
    }
    gatherTrackers(commitBody) {
        const trackerResult = {};
        for (const keyword of this.config.keyword) {
            for (const issueFormat of this.config['issue-format']) {
                const reference = this.matchTracker(keyword, issueFormat, commitBody);
                if (reference) {
                    trackerResult.data = {
                        keyword,
                        id: reference,
                        type: this.config.type,
                    };
                    if (this.config.url) {
                        trackerResult.data.url = `${this.config.url}${reference}`;
                    }
                }
            }
        }
        return trackerResult;
    }
    matchTracker(keyword, trackerFormat, commitBody) {
        // `\\n` matches literal backslash-n text in API responses; `^` with `m` flag handles actual newlines
        const regexp = new RegExp(`(^\\s*|\\\\n|\\n)(${keyword})(${trackerFormat})$`, 'gm');
        const matches = commitBody.matchAll(regexp);
        for (const match of matches) {
            if (Array.isArray(match) && match.length >= 4)
                return match[3];
        }
        return undefined;
    }
}
//# sourceMappingURL=tracker-validator.js.map