import { TrackerValidator } from './tracker-validator';
import { UpstreamValidator } from './upstream-validator';
import { warning } from '@actions/core';
export class Validator {
    constructor(config, context) {
        this.config = config;
        this.context = context;
        this.trackerValidator = this.config.tracker.map(config => new TrackerValidator(config));
        this.upstreamValidator = new UpstreamValidator(this.config.cherryPick, this.config.isCherryPickPolicyEmpty());
    }
    validateAll(validatedCommits) {
        const tracker = this.generalTracker(validatedCommits);
        const status = this.overallStatus(tracker, validatedCommits);
        const message = this.overallMessage(tracker, validatedCommits);
        return {
            status,
            tracker,
            message,
        };
    }
    async validateCommit(commitMetadata) {
        var _a;
        const validated = {
            status: 'failure',
            message: '',
        };
        validated.tracker = TrackerValidator.cleanArray({
            status: 'failure',
            message: '',
            data: this.trackerValidator.map(tracker => tracker.validate(commitMetadata)),
        });
        if (validated.tracker) {
            validated.tracker.status = TrackerValidator.getStatus(validated.tracker.data, this.config.isTrackerPolicyEmpty());
            validated.tracker.message = TrackerValidator.getMessage(validated.tracker.data, validated.tracker.status, this.config.isTrackerPolicyEmpty());
        }
        validated.upstream = await this.upstreamValidator.validate(commitMetadata, this.context);
        const { status, message } = this.validationSummary(validated, commitMetadata.message.title, commitMetadata.url);
        validated.status =
            status === 'success' && ((_a = validated.tracker) === null || _a === void 0 ? void 0 : _a.status) === 'success'
                ? 'success'
                : 'failure';
        validated.message = message;
        return validated;
    }
    validationSummary(data, commitTitle, commitUrl) {
        let status = 'failure';
        const upstreamSummary = this.upstreamValidator.summary(data.upstream);
        status = upstreamSummary.status;
        return {
            status,
            message: `${commitUrl} - ${commitTitle} - ${upstreamSummary.message}`,
        };
    }
    // TODO:
    // ! get unique trackers of commits
    // ! get unique tracker of PR
    // ! when commit is marked by exception and commit with tracker exist return only tracker othervise return exception
    // ! when multiple trackers exist return error???
    generalTracker(commitsMetadata) {
        var _a, _b;
        if (this.config.isTrackerPolicyEmpty())
            return undefined;
        const tracker = { message: '' };
        const prUniqueTracker = [];
        for (const { validation } of commitsMetadata) {
            if (validation.tracker === undefined ||
                validation.tracker.data.length === 0) {
                tracker.message = 'No tracker found';
                return tracker;
            }
            if (validation.tracker.status === 'failure') {
                tracker.message = validation.tracker.message;
                return tracker;
            }
            const uniqueTracker = [];
            for (const tracker of validation.tracker.data) {
                const isDuplicate = uniqueTracker.find(obj => { var _a, _b; return ((_a = obj.data) === null || _a === void 0 ? void 0 : _a.id) === ((_b = tracker.data) === null || _b === void 0 ? void 0 : _b.id); });
                if (!isDuplicate) {
                    uniqueTracker.push(tracker);
                }
            }
            warning(`uniqueTracker: ${JSON.stringify(uniqueTracker)}`);
            if (uniqueTracker.length > 1) {
                tracker.message = 'Multiple trackers found';
                return tracker;
            }
            const isDuplicate = prUniqueTracker.find(obj => { var _a, _b; return ((_a = obj.data) === null || _a === void 0 ? void 0 : _a.id) === ((_b = uniqueTracker[0].data) === null || _b === void 0 ? void 0 : _b.id); });
            if (!isDuplicate) {
                prUniqueTracker.push(uniqueTracker[0]);
            }
        }
        if (prUniqueTracker.length > 1) {
            const trackers = prUniqueTracker.map(tracker => {
                var _a, _b;
                if (tracker.exception) {
                    return `\`${tracker.exception}\``;
                }
                return `[${(_a = tracker.data) === null || _a === void 0 ? void 0 : _a.id}](${(_b = tracker.data) === null || _b === void 0 ? void 0 : _b.url})`;
            });
            tracker.message = `${trackers.join(', ')}`;
            return tracker;
        }
        return Object.assign(Object.assign({}, tracker), { id: (_a = prUniqueTracker[0].data) === null || _a === void 0 ? void 0 : _a.id, url: (_b = prUniqueTracker[0].data) === null || _b === void 0 ? void 0 : _b.url, message: 'Tracker found', exception: prUniqueTracker[0].exception });
    }
    overallMessage(tracker, commitsMetadata) {
        let trackerID = 'Missing, needs inspection! ✋';
        if (tracker !== undefined) {
            if (!(tracker === null || tracker === void 0 ? void 0 : tracker.id) && !(tracker === null || tracker === void 0 ? void 0 : tracker.exception)) {
                trackerID = tracker.message;
            }
            else if ((tracker === null || tracker === void 0 ? void 0 : tracker.id) === '' && (tracker === null || tracker === void 0 ? void 0 : tracker.exception)) {
                trackerID = `\`${tracker.exception}\``;
            }
            else if ((tracker === null || tracker === void 0 ? void 0 : tracker.id) !== '') {
                trackerID = `[${tracker.id}](${tracker.url})`;
            }
        }
        const commits = `${commitsMetadata
            .map(commit => {
            return commit.validation.message;
        })
            .join('\n')}`;
        // TODO: separate commits by their status
        // The following commits needs inspection
        // The following commits meets all requirements
        return `Tracker - ${trackerID}\n\n${commits}`;
    }
    overallStatus(tracker, commitsMetadata) {
        if (!this.config.isTrackerPolicyEmpty()) {
            if (tracker === undefined) {
                return 'failure';
            }
            if (!(tracker === null || tracker === void 0 ? void 0 : tracker.id) && !(tracker === null || tracker === void 0 ? void 0 : tracker.exception)) {
                return 'failure';
            }
            if ((tracker === null || tracker === void 0 ? void 0 : tracker.id) === '' && (tracker === null || tracker === void 0 ? void 0 : tracker.exception)) {
                return 'failure';
            }
        }
        if (!this.config.isCherryPickPolicyEmpty()) {
            commitsMetadata.forEach(commit => {
                var _a;
                if (((_a = commit.validation.upstream) === null || _a === void 0 ? void 0 : _a.status) === 'failure') {
                    return 'failure';
                }
            });
        }
        return 'success';
    }
}
//# sourceMappingURL=validator.js.map