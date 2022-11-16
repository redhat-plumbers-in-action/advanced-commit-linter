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
    exception?: {
        label?: string[] | undefined;
        note?: string[] | undefined;
    } | undefined;
    upstream: {
        github: string;
    }[];
}, {
    exception?: {
        label?: string[] | undefined;
        note?: string[] | undefined;
    } | undefined;
    upstream: {
        github: string;
    }[];
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
    exception?: {
        label?: string[] | undefined;
        note?: string[] | undefined;
    } | undefined;
    url?: string | undefined;
    keyword: string[];
    'issue-format': string[];
}, {
    exception?: {
        label?: string[] | undefined;
        note?: string[] | undefined;
    } | undefined;
    url?: string | undefined;
    keyword: string[];
    'issue-format': string[];
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
            exception?: {
                label?: string[] | undefined;
                note?: string[] | undefined;
            } | undefined;
            upstream: {
                github: string;
            }[];
        }, {
            exception?: {
                label?: string[] | undefined;
                note?: string[] | undefined;
            } | undefined;
            upstream: {
                github: string;
            }[];
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
            exception?: {
                label?: string[] | undefined;
                note?: string[] | undefined;
            } | undefined;
            url?: string | undefined;
            keyword: string[];
            'issue-format': string[];
        }, {
            exception?: {
                label?: string[] | undefined;
                note?: string[] | undefined;
            } | undefined;
            url?: string | undefined;
            keyword: string[];
            'issue-format': string[];
        }>, "many">>>;
    }, "strip", z.ZodTypeAny, {
        'cherry-pick': {
            exception?: {
                label?: string[] | undefined;
                note?: string[] | undefined;
            } | undefined;
            upstream: {
                github: string;
            }[];
        };
        tracker: {
            exception?: {
                label?: string[] | undefined;
                note?: string[] | undefined;
            } | undefined;
            url?: string | undefined;
            keyword: string[];
            'issue-format': string[];
        }[];
    }, {
        'cherry-pick'?: {
            exception?: {
                label?: string[] | undefined;
                note?: string[] | undefined;
            } | undefined;
            upstream: {
                github: string;
            }[];
        } | undefined;
        tracker?: {
            exception?: {
                label?: string[] | undefined;
                note?: string[] | undefined;
            } | undefined;
            url?: string | undefined;
            keyword: string[];
            'issue-format': string[];
        }[] | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    policy: {
        'cherry-pick': {
            exception?: {
                label?: string[] | undefined;
                note?: string[] | undefined;
            } | undefined;
            upstream: {
                github: string;
            }[];
        };
        tracker: {
            exception?: {
                label?: string[] | undefined;
                note?: string[] | undefined;
            } | undefined;
            url?: string | undefined;
            keyword: string[];
            'issue-format': string[];
        }[];
    };
}, {
    policy: {
        'cherry-pick'?: {
            exception?: {
                label?: string[] | undefined;
                note?: string[] | undefined;
            } | undefined;
            upstream: {
                github: string;
            }[];
        } | undefined;
        tracker?: {
            exception?: {
                label?: string[] | undefined;
                note?: string[] | undefined;
            } | undefined;
            url?: string | undefined;
            keyword: string[];
            'issue-format': string[];
        }[] | undefined;
    };
}>;
export type ConfigT = z.output<typeof configSchema>;
