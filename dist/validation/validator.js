import { TrackerValidator } from './tracker-validator';
import { UpstreamValidator } from './upstream-validator';
import { Commit } from '../commit';
export class Validator {
    constructor(config, octokit) {
        this.config = config;
        this.octokit = octokit;
        this.trackerValidator = this.config.tracker.map(config => new TrackerValidator(config));
        this.upstreamValidator = new UpstreamValidator(this.config.cherryPick, this.config.isCherryPickPolicyEmpty());
    }
    validateAll(validatedCommits) {
        const tracker = this.aggregatePrTracker(validatedCommits);
        const status = this.computePrStatus(tracker, validatedCommits);
        const message = this.buildPrMessage(tracker, validatedCommits);
        return { status, tracker, message };
    }
    async validateCommit(commitMetadata) {
        const tracker = this.buildTrackerResult(commitMetadata);
        const upstream = await this.upstreamValidator.validate(commitMetadata, this.octokit);
        const { status: summaryStatus, message } = this.buildCommitSummary({ tracker, upstream }, commitMetadata.message.title, commitMetadata.url);
        const status = summaryStatus === 'success' && (tracker === null || tracker === void 0 ? void 0 : tracker.status) === 'success'
            ? 'success'
            : 'failure';
        return { status, message, tracker, upstream };
    }
    buildTrackerResult(commitMetadata) {
        const rawData = this.trackerValidator.map(t => t.validate(commitMetadata));
        const cleaned = Validator.cleanTrackerArray({
            status: 'failure',
            message: '',
            data: rawData,
        });
        if (!cleaned)
            return cleaned;
        const isTrackerPolicyEmpty = this.config.isTrackerPolicyEmpty();
        const status = Validator.getTrackerStatus(cleaned.data, isTrackerPolicyEmpty);
        const message = Validator.getTrackerMessage(cleaned.data, status, isTrackerPolicyEmpty);
        return Object.assign(Object.assign({}, cleaned), { status, message });
    }
    buildCommitSummary(data, commitTitle, commitUrl) {
        var _a, _b, _c;
        let status = 'success';
        const messages = [];
        if (!this.config.isTrackerPolicyEmpty()) {
            if (data.tracker && data.tracker.status === 'failure') {
                status = 'failure';
                messages.push(data.tracker.message);
            }
        }
        if (!this.config.isCherryPickPolicyEmpty()) {
            if (data.upstream && data.upstream.status === 'failure') {
                status = 'failure';
                messages.push('**Missing upstream reference** ‼️');
            }
        }
        if (status === 'failure') {
            return {
                status,
                message: `| ${commitUrl} - _${commitTitle}_ | ${messages.join('</br>')} |`,
            };
        }
        if ((!data.upstream || data.upstream.data.length === 0) &&
            !((_a = data.upstream) === null || _a === void 0 ? void 0 : _a.exception)) {
            return {
                status: 'success',
                message: `| ${commitUrl} - _${commitTitle}_ | _no upstream_ |`,
            };
        }
        const upstreamParts = [];
        if ((_b = data.upstream) === null || _b === void 0 ? void 0 : _b.exception) {
            upstreamParts.push(`\`${data.upstream.exception}\``);
        }
        (_c = data.upstream) === null || _c === void 0 ? void 0 : _c.data.forEach(upstream => {
            upstreamParts.push(`${upstream.url}`);
        });
        return {
            status: 'success',
            message: `| ${commitUrl} - _${commitTitle}_ | ${upstreamParts.join('</br>')} |`,
        };
    }
    aggregatePrTracker(commitsMetadata) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        if (this.config.isTrackerPolicyEmpty())
            return undefined;
        if (commitsMetadata.length === 0) {
            return { message: '**Missing issue tracker ✋**', type: 'unknown' };
        }
        const tracker = { message: '', type: 'unknown' };
        const prUniqueTracker = [];
        for (const { validation } of commitsMetadata) {
            if (validation.tracker === undefined ||
                validation.tracker.data.length === 0) {
                tracker.message = '**Missing issue tracker ✋**';
                return tracker;
            }
            if (validation.tracker.status === 'failure') {
                tracker.message = validation.tracker.message;
                return tracker;
            }
            const uniqueTracker = [];
            for (const t of validation.tracker.data) {
                const isDuplicate = uniqueTracker.find(obj => { var _a, _b; return ((_a = obj.data) === null || _a === void 0 ? void 0 : _a.id) === ((_b = t.data) === null || _b === void 0 ? void 0 : _b.id); });
                if (!isDuplicate) {
                    uniqueTracker.push(t);
                }
            }
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
            const realTrackers = prUniqueTracker.filter(t => t.data);
            const exceptionOnly = prUniqueTracker.filter(t => !t.data);
            if (realTrackers.length === 1) {
                const parts = [
                    ...exceptionOnly.map(t => `\`${t.exception}\``),
                    `[${(_a = realTrackers[0].data) === null || _a === void 0 ? void 0 : _a.id}](${(_b = realTrackers[0].data) === null || _b === void 0 ? void 0 : _b.url})`,
                ];
                return {
                    id: (_c = realTrackers[0].data) === null || _c === void 0 ? void 0 : _c.id,
                    type: (_e = (_d = realTrackers[0].data) === null || _d === void 0 ? void 0 : _d.type) !== null && _e !== void 0 ? _e : 'unknown',
                    url: (_f = realTrackers[0].data) === null || _f === void 0 ? void 0 : _f.url,
                    message: parts.join(', '),
                    exception: realTrackers[0].exception,
                };
            }
            const trackers = prUniqueTracker.map(t => {
                var _a, _b;
                if (t.exception && !t.data)
                    return `\`${t.exception}\``;
                return `[${(_a = t.data) === null || _a === void 0 ? void 0 : _a.id}](${(_b = t.data) === null || _b === void 0 ? void 0 : _b.url})`;
            });
            tracker.message = `${trackers.join(', ')}`;
            return tracker;
        }
        return {
            id: (_g = prUniqueTracker[0].data) === null || _g === void 0 ? void 0 : _g.id,
            type: (_j = (_h = prUniqueTracker[0].data) === null || _h === void 0 ? void 0 : _h.type) !== null && _j !== void 0 ? _j : 'unknown',
            url: (_k = prUniqueTracker[0].data) === null || _k === void 0 ? void 0 : _k.url,
            message: 'Tracker found',
            exception: prUniqueTracker[0].exception,
        };
    }
    buildPrMessage(tracker, commitsMetadata) {
        const trackerID = !tracker && this.config.isTrackerPolicyEmpty()
            ? '_no tracker_'
            : Validator.formatTrackerId(tracker);
        const validCommits = Commit.getValidCommits(commitsMetadata);
        const invalidCommits = Commit.getInvalidCommits(commitsMetadata);
        let summaryMessage = `Tracker - ${trackerID}`;
        if (validCommits.length > 0) {
            summaryMessage += '\n\n';
            summaryMessage += '#### The following commits meet all requirements';
            summaryMessage += '\n\n';
            summaryMessage += '| commit | upstream |\n';
            summaryMessage += '|---|---|\n';
            summaryMessage += `${Commit.getListOfCommits(validCommits)}`;
        }
        if (invalidCommits.length > 0) {
            summaryMessage += '\n\n';
            summaryMessage += '#### The following commits need an inspection';
            summaryMessage += '\n\n';
            summaryMessage += '| commit | note |\n';
            summaryMessage += '|---|---|\n';
            summaryMessage += `${Commit.getListOfCommits(invalidCommits)}`;
        }
        return summaryMessage;
    }
    computePrStatus(tracker, commitsMetadata) {
        if (!this.config.isTrackerPolicyEmpty()) {
            if (tracker === undefined)
                return 'failure';
            if (!(tracker === null || tracker === void 0 ? void 0 : tracker.id) && !(tracker === null || tracker === void 0 ? void 0 : tracker.exception))
                return 'failure';
            if ((tracker === null || tracker === void 0 ? void 0 : tracker.id) === '' && (tracker === null || tracker === void 0 ? void 0 : tracker.exception))
                return 'failure';
        }
        if (!this.config.isCherryPickPolicyEmpty()) {
            const hasUpstreamFailure = commitsMetadata.some(commit => { var _a; return ((_a = commit.validation.upstream) === null || _a === void 0 ? void 0 : _a.status) === 'failure'; });
            if (hasUpstreamFailure)
                return 'failure';
        }
        return 'success';
    }
    static formatTrackerId(tracker) {
        var _a;
        if (!tracker)
            return '**Missing, needs inspection! ✋**';
        if (tracker.id) {
            if (tracker.url)
                return `[${tracker.id}](${tracker.url})`;
            return tracker.id;
        }
        if (tracker.exception)
            return `\`${tracker.exception}\``;
        return (_a = tracker.message) !== null && _a !== void 0 ? _a : '**Missing, needs inspection! ✋**';
    }
    static getTrackerStatus(tracker, isTrackerPolicyEmpty) {
        if (isTrackerPolicyEmpty)
            return 'success';
        if (tracker.length === 0)
            return 'failure';
        for (const single of tracker) {
            if (single.data === undefined && single.exception === undefined) {
                return 'failure';
            }
        }
        return 'success';
    }
    static getTrackerMessage(trackers, status, isTrackerPolicyEmpty) {
        var _a;
        if (isTrackerPolicyEmpty)
            return '_no tracker_';
        if (status === 'failure')
            return '**Missing issue tracker** ✋';
        const trackersResult = [];
        for (const singleTracker of trackers) {
            if (!(singleTracker === null || singleTracker === void 0 ? void 0 : singleTracker.data) && !(singleTracker === null || singleTracker === void 0 ? void 0 : singleTracker.exception))
                continue;
            if ((singleTracker === null || singleTracker === void 0 ? void 0 : singleTracker.exception) && !(singleTracker === null || singleTracker === void 0 ? void 0 : singleTracker.data)) {
                trackersResult.push(singleTracker.exception);
                continue;
            }
            if (!singleTracker.data)
                continue;
            if (!singleTracker.data.url || ((_a = singleTracker.data) === null || _a === void 0 ? void 0 : _a.url) === '') {
                trackersResult.push(singleTracker.data.id);
                continue;
            }
            trackersResult.push(`[${singleTracker.data.id}](${singleTracker.data.url})`);
        }
        return trackersResult.join(', ');
    }
    static cleanTrackerArray(validationArray) {
        if (validationArray === undefined)
            return undefined;
        if (Array.isArray(validationArray.data) &&
            validationArray.data.length === 0)
            return validationArray;
        const cleanedData = validationArray.data.filter(tracker => Object.values(tracker).some(v => v !== undefined));
        return Object.assign(Object.assign({}, validationArray), { data: cleanedData });
    }
}
//# sourceMappingURL=validator.js.map