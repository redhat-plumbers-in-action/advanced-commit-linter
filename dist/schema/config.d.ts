import { z } from 'zod';
export declare const configExceptionSchema: z.ZodObject<{
    label: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    note: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    label?: string[] | undefined;
    note?: string[] | undefined;
}, {
    label?: string[] | undefined;
    note?: string[] | undefined;
}>;
export type ConfigExceptionT = z.infer<typeof configExceptionSchema>;
export declare const configCherryPickSchema: z.ZodObject<{
    upstream: z.ZodArray<z.ZodObject<{
        github: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        github: string;
    }, {
        github: string;
    }>, "many">;
    exception: z.ZodOptional<z.ZodObject<{
        label: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        note: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        label?: string[] | undefined;
        note?: string[] | undefined;
    }, {
        label?: string[] | undefined;
        note?: string[] | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    upstream: {
        github: string;
    }[];
    exception?: {
        label?: string[] | undefined;
        note?: string[] | undefined;
    } | undefined;
}, {
    upstream: {
        github: string;
    }[];
    exception?: {
        label?: string[] | undefined;
        note?: string[] | undefined;
    } | undefined;
}>;
export type ConfigCherryPickT = z.infer<typeof configCherryPickSchema>;
export declare const configTrackerSchema: z.ZodObject<{
    keyword: z.ZodArray<z.ZodString, "many">;
    'issue-format': z.ZodArray<z.ZodString, "many">;
    url: z.ZodOptional<z.ZodString>;
    exception: z.ZodOptional<z.ZodObject<{
        label: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        note: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        label?: string[] | undefined;
        note?: string[] | undefined;
    }, {
        label?: string[] | undefined;
        note?: string[] | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    keyword: string[];
    'issue-format': string[];
    url?: string | undefined;
    exception?: {
        label?: string[] | undefined;
        note?: string[] | undefined;
    } | undefined;
}, {
    keyword: string[];
    'issue-format': string[];
    url?: string | undefined;
    exception?: {
        label?: string[] | undefined;
        note?: string[] | undefined;
    } | undefined;
}>;
export type ConfigTrackerT = z.infer<typeof configTrackerSchema>;
export declare const configSchema: z.ZodObject<{
    policy: z.ZodObject<{
        'cherry-pick': z.ZodDefault<z.ZodOptional<z.ZodObject<{
            upstream: z.ZodArray<z.ZodObject<{
                github: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                github: string;
            }, {
                github: string;
            }>, "many">;
            exception: z.ZodOptional<z.ZodObject<{
                label: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                note: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            }, "strip", z.ZodTypeAny, {
                label?: string[] | undefined;
                note?: string[] | undefined;
            }, {
                label?: string[] | undefined;
                note?: string[] | undefined;
            }>>;
        }, "strip", z.ZodTypeAny, {
            upstream: {
                github: string;
            }[];
            exception?: {
                label?: string[] | undefined;
                note?: string[] | undefined;
            } | undefined;
        }, {
            upstream: {
                github: string;
            }[];
            exception?: {
                label?: string[] | undefined;
                note?: string[] | undefined;
            } | undefined;
        }>>>;
        tracker: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodObject<{
            keyword: z.ZodArray<z.ZodString, "many">;
            'issue-format': z.ZodArray<z.ZodString, "many">;
            url: z.ZodOptional<z.ZodString>;
            exception: z.ZodOptional<z.ZodObject<{
                label: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                note: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            }, "strip", z.ZodTypeAny, {
                label?: string[] | undefined;
                note?: string[] | undefined;
            }, {
                label?: string[] | undefined;
                note?: string[] | undefined;
            }>>;
        }, "strip", z.ZodTypeAny, {
            keyword: string[];
            'issue-format': string[];
            url?: string | undefined;
            exception?: {
                label?: string[] | undefined;
                note?: string[] | undefined;
            } | undefined;
        }, {
            keyword: string[];
            'issue-format': string[];
            url?: string | undefined;
            exception?: {
                label?: string[] | undefined;
                note?: string[] | undefined;
            } | undefined;
        }>, "many">>>;
    }, "strip", z.ZodTypeAny, {
        'cherry-pick': {
            upstream: {
                github: string;
            }[];
            exception?: {
                label?: string[] | undefined;
                note?: string[] | undefined;
            } | undefined;
        };
        tracker: {
            keyword: string[];
            'issue-format': string[];
            url?: string | undefined;
            exception?: {
                label?: string[] | undefined;
                note?: string[] | undefined;
            } | undefined;
        }[];
    }, {
        'cherry-pick'?: {
            upstream: {
                github: string;
            }[];
            exception?: {
                label?: string[] | undefined;
                note?: string[] | undefined;
            } | undefined;
        } | undefined;
        tracker?: {
            keyword: string[];
            'issue-format': string[];
            url?: string | undefined;
            exception?: {
                label?: string[] | undefined;
                note?: string[] | undefined;
            } | undefined;
        }[] | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    policy: {
        'cherry-pick': {
            upstream: {
                github: string;
            }[];
            exception?: {
                label?: string[] | undefined;
                note?: string[] | undefined;
            } | undefined;
        };
        tracker: {
            keyword: string[];
            'issue-format': string[];
            url?: string | undefined;
            exception?: {
                label?: string[] | undefined;
                note?: string[] | undefined;
            } | undefined;
        }[];
    };
}, {
    policy: {
        'cherry-pick'?: {
            upstream: {
                github: string;
            }[];
            exception?: {
                label?: string[] | undefined;
                note?: string[] | undefined;
            } | undefined;
        } | undefined;
        tracker?: {
            keyword: string[];
            'issue-format': string[];
            url?: string | undefined;
            exception?: {
                label?: string[] | undefined;
                note?: string[] | undefined;
            } | undefined;
        }[] | undefined;
    };
}>;
export type ConfigT = z.output<typeof configSchema>;
