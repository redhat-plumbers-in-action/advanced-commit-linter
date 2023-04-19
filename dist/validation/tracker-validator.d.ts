import { ConfigExceptionT, ConfigTrackerT } from '../schema/config';
import { SingleCommitMetadataT } from '../schema/input';
import { StatusT, TrackerT, ValidatedCommitT } from '../schema/output';
export declare class TrackerValidator {
    readonly config: ConfigTrackerT;
    constructor(config: ConfigTrackerT);
    validate(singleCommitMetadata: SingleCommitMetadataT): TrackerT;
    loopPolicy(commitBody: SingleCommitMetadataT['message']['body']): TrackerT;
    matchTracker(keyword: string, trackerFormat: string, commitBody: string): string | undefined;
    isException(exceptionPolicy: ConfigExceptionT | undefined, commitBody: string): string | undefined;
    static getStatus(tracker: TrackerT[], isTrackerPolicyEmpty: boolean): StatusT;
    static getMessage(trackers: TrackerT[], status: StatusT, isTrackerPolicyEmpty: boolean): string;
    static cleanArray(validationArray: ValidatedCommitT['tracker']): ValidatedCommitT['tracker'];
}
