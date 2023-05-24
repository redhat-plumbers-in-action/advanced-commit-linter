import { isException } from './util';
export class TrackerValidator {
    constructor(config) {
        this.config = config;
    }
    validate(singleCommitMetadata) {
        // Check if exception label is present in commit message
        const exception = isException(this.config.exception, singleCommitMetadata.message.body);
        // Check if tracker reference is present in commit message
        // ? Only first occurrence is returned - see matchTracker()
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
        const exception = isException(this.config.exception, commitBody);
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
    static getStatus(tracker, isTrackerPolicyEmpty) {
        let status = 'success';
        if (isTrackerPolicyEmpty)
            return status;
        if (tracker.length === 0)
            return 'failure';
        for (const single of tracker) {
            if (single.data === undefined && single.exception === undefined) {
                status = 'failure';
                break;
            }
        }
        return status;
    }
    /**
     * Get tracker message that will be displayed in Pull Request comment summary
     * @param trackers - Array of tracker data
     * @param status - Status of the validation
     * @param isTrackerPolicyEmpty - If tracker policy is empty
     * @returns Message to be displayed
     */
    static getMessage(trackers, status, isTrackerPolicyEmpty) {
        var _a;
        if (isTrackerPolicyEmpty)
            return '_no tracker_';
        const trackersResult = [];
        for (const singleTracker of trackers) {
            // If no tracker data nor exception, skip
            if (!(singleTracker === null || singleTracker === void 0 ? void 0 : singleTracker.data) && !(singleTracker === null || singleTracker === void 0 ? void 0 : singleTracker.exception))
                continue;
            // If no tracker data provided but exception was detected exception, push exception
            if ((singleTracker === null || singleTracker === void 0 ? void 0 : singleTracker.exception) && !(singleTracker === null || singleTracker === void 0 ? void 0 : singleTracker.data)) {
                trackersResult.push(singleTracker.exception);
                continue;
            }
            if (!singleTracker.data)
                continue;
            // If no tracker url provided, push only id
            if (!singleTracker.data.url || ((_a = singleTracker.data) === null || _a === void 0 ? void 0 : _a.url) === '') {
                trackersResult.push(singleTracker.data.id);
                continue;
            }
            // If tracker url provided, push id with link
            trackersResult.push(`[${singleTracker.data.id}](${singleTracker.data.url})`);
        }
        switch (status) {
            case 'success':
                return `${trackersResult.join(', ')}`;
            case 'failure':
                return '**Missing issue tracker** ✋';
        }
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