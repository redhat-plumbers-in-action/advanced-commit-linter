import { ConfigTracker } from '../schema/config';
import { SingleCommitMetadata } from '../schema/input';
import { Status, Tracker, ValidatedCommit } from '../schema/output';
export declare class TrackerValidator {
    readonly config: ConfigTracker;
    constructor(config: ConfigTracker);
    validate(singleCommitMetadata: SingleCommitMetadata): Tracker;
    gatherTrackers(commitBody: SingleCommitMetadata['message']['body']): Tracker;
    matchTracker(keyword: string, trackerFormat: string, commitBody: string): string | undefined;
    static getStatus(tracker: Tracker[], isTrackerPolicyEmpty: boolean): Status;
    /**
     * Get tracker message that will be displayed in Pull Request comment summary
     * @param trackers - Array of tracker data
     * @param status - Status of the validation
     * @param isTrackerPolicyEmpty - If tracker policy is empty
     * @returns Message to be displayed
     */
    static getMessage(trackers: Tracker[], status: Status, isTrackerPolicyEmpty: boolean): string;
    static cleanArray(validationArray: ValidatedCommit['tracker']): ValidatedCommit['tracker'];
}
