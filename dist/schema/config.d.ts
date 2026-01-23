import { z } from 'zod';
export declare const configExceptionSchema: z.ZodObject<{
    label: z.ZodOptional<z.ZodArray<z.ZodString>>;
    note: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
export type ConfigException = z.infer<typeof configExceptionSchema>;
export declare const configCherryPickSchema: z.ZodObject<{
    upstream: z.ZodArray<z.ZodObject<{
        github: z.ZodString;
    }, z.core.$strip>>;
    exception: z.ZodOptional<z.ZodObject<{
        label: z.ZodOptional<z.ZodArray<z.ZodString>>;
        note: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type ConfigCherryPick = z.infer<typeof configCherryPickSchema>;
export declare const configTrackerTypeSchema: z.ZodUnion<readonly [z.ZodLiteral<"jira">, z.ZodLiteral<"bugzilla">]>;
export type ConfigTrackerType = z.infer<typeof configTrackerTypeSchema>;
export declare const configTrackerSchema: z.ZodObject<{
    keyword: z.ZodArray<z.ZodString>;
    'issue-format': z.ZodArray<z.ZodString>;
    type: z.ZodUnion<readonly [z.ZodLiteral<"jira">, z.ZodLiteral<"bugzilla">]>;
    url: z.ZodOptional<z.ZodString>;
    exception: z.ZodOptional<z.ZodObject<{
        label: z.ZodOptional<z.ZodArray<z.ZodString>>;
        note: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type ConfigTracker = z.infer<typeof configTrackerSchema>;
export declare const configPolicySchema: z.ZodObject<{
    'cherry-pick': z.ZodDefault<z.ZodOptional<z.ZodObject<{
        upstream: z.ZodArray<z.ZodObject<{
            github: z.ZodString;
        }, z.core.$strip>>;
        exception: z.ZodOptional<z.ZodObject<{
            label: z.ZodOptional<z.ZodArray<z.ZodString>>;
            note: z.ZodOptional<z.ZodArray<z.ZodString>>;
        }, z.core.$strip>>;
    }, z.core.$strip>>>;
    tracker: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodObject<{
        keyword: z.ZodArray<z.ZodString>;
        'issue-format': z.ZodArray<z.ZodString>;
        type: z.ZodUnion<readonly [z.ZodLiteral<"jira">, z.ZodLiteral<"bugzilla">]>;
        url: z.ZodOptional<z.ZodString>;
        exception: z.ZodOptional<z.ZodObject<{
            label: z.ZodOptional<z.ZodArray<z.ZodString>>;
            note: z.ZodOptional<z.ZodArray<z.ZodString>>;
        }, z.core.$strip>>;
    }, z.core.$strip>>>>;
}, z.core.$strip>;
export type ConfigPolicy = z.infer<typeof configPolicySchema>;
export declare const configSchema: z.ZodObject<{
    policy: z.ZodDefault<z.ZodOptional<z.ZodObject<{
        'cherry-pick': z.ZodDefault<z.ZodOptional<z.ZodObject<{
            upstream: z.ZodArray<z.ZodObject<{
                github: z.ZodString;
            }, z.core.$strip>>;
            exception: z.ZodOptional<z.ZodObject<{
                label: z.ZodOptional<z.ZodArray<z.ZodString>>;
                note: z.ZodOptional<z.ZodArray<z.ZodString>>;
            }, z.core.$strip>>;
        }, z.core.$strip>>>;
        tracker: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodObject<{
            keyword: z.ZodArray<z.ZodString>;
            'issue-format': z.ZodArray<z.ZodString>;
            type: z.ZodUnion<readonly [z.ZodLiteral<"jira">, z.ZodLiteral<"bugzilla">]>;
            url: z.ZodOptional<z.ZodString>;
            exception: z.ZodOptional<z.ZodObject<{
                label: z.ZodOptional<z.ZodArray<z.ZodString>>;
                note: z.ZodOptional<z.ZodArray<z.ZodString>>;
            }, z.core.$strip>>;
        }, z.core.$strip>>>>;
    }, z.core.$strip>>>;
}, z.core.$strip>;
