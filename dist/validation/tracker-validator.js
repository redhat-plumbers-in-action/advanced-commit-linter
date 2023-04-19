import { z } from 'zod';
import { configExceptionSchema, } from '../schema/config';
export class TrackerValidator {
    constructor(config) {
        this.config = config;
    }
    validate(singleCommitMetadata) {
        return Object.assign(Object.assign({}, this.loopPolicy(singleCommitMetadata.message.body)), { exception: this.isException(this.config.exception, singleCommitMetadata.message.body) });
    }
    loopPolicy(commitBody) {
        const trackerResult = {};
        for (const keyword of this.config.keyword) {
            for (const issueFormat of this.config['issue-format']) {
                const reference = this.matchTracker(keyword, issueFormat, commitBody);
                if (reference) {
                    trackerResult.data = {
                        keyword,
                        id: reference,
                    };
                    if (this.config.url) {
                        trackerResult.data.url = `${this.config.url}${reference}`;
                    }
                }
            }
        }
        const exception = this.isException(this.config.exception, commitBody);
        if (exception) {
            trackerResult.exception = exception;
        }
        return trackerResult;
    }
    matchTracker(keyword, trackerFormat, commitBody) {
        const regexp = new RegExp(`(^\\s*|\\\\n|\\n)(${keyword})(${trackerFormat})$`, 'gm');
        const matches = commitBody.matchAll(regexp);
        for (const match of matches) {
            if (Array.isArray(match) && match.length >= 4)
                return match[3];
        }
        return undefined;
    }
    isException(exceptionPolicy, commitBody) {
        const exceptionPolicySafe = configExceptionSchema
            .extend({ note: z.array(z.string()) })
            .safeParse(exceptionPolicy);
        if (!exceptionPolicySafe.success)
            return undefined;
        for (const exception of exceptionPolicySafe.data.note) {
            const regexp = new RegExp(`(^\\s*|\\\\n|\\n)(${exception})$`, 'gm');
            const matches = commitBody.matchAll(regexp);
            for (const match of matches) {
                if (Array.isArray(match) && match.length >= 3) {
                    return exception;
                }
            }
        }
    }
    static getStatus(tracker, isTrackerPolicyEmpty) {
        let status = 'success';
        if (isTrackerPolicyEmpty)
            return status;
        for (const single of tracker) {
            if (single.data === undefined && single.exception === undefined) {
                status = 'failure';
                break;
            }
        }
        return status;
    }
    static getMessage(trackers, status, isTrackerPolicyEmpty) {
        let message = '`_no-tracker_`';
        if (isTrackerPolicyEmpty)
            return message;
        const trackersResult = [];
        for (const singleTracker of trackers) {
            if (singleTracker.data === undefined)
                continue;
            if (singleTracker.data.url === '')
                trackersResult.push(singleTracker.data.id);
            trackersResult.push(`[${singleTracker.data.id}](${singleTracker.data.url})`);
        }
        switch (status) {
            case 'success':
                message = `${trackersResult.join(', ')}`;
                break;
            case 'failure':
                message = '`Missing, needs inspection! ✋`';
                break;
        }
        return message;
    }
    static cleanArray(validationArray) {
        if (validationArray === undefined)
            return undefined;
        if (Array.isArray(validationArray.data) &&
            validationArray.data.length === 0)
            return validationArray;
        const cleanedData = validationArray.data.filter(tracker => JSON.stringify(tracker) !== JSON.stringify({}));
        return Object.assign(Object.assign({}, validationArray), { data: cleanedData });
    }
}
//# sourceMappingURL=tracker-validator.js.map