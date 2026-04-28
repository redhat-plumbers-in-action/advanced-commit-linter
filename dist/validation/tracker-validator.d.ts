import { ConfigTracker } from '../schema/config';
import { SingleCommitMetadata } from '../schema/input';
import { Tracker } from '../schema/output';
export declare class TrackerValidator {
    readonly config: ConfigTracker;
    constructor(config: ConfigTracker);
    validate(singleCommitMetadata: SingleCommitMetadata): Tracker;
    gatherTrackers(commitBody: SingleCommitMetadata['message']['body']): Tracker;
    matchTracker(keyword: string, trackerFormat: string, commitBody: string): string | undefined;
}
