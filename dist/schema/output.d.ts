import { z } from 'zod';
declare const statusSchema: z.ZodUnion<readonly [z.ZodLiteral<"success">, z.ZodLiteral<"failure">]>;
export type Status = z.infer<typeof statusSchema>;
declare const trackerSchema: z.ZodObject<{
    exception: z.ZodOptional<z.ZodString>;
    data: z.ZodOptional<z.ZodObject<{
        keyword: z.ZodString;
        id: z.ZodString;
        type: z.ZodUnion<readonly [z.ZodUnion<readonly [z.ZodLiteral<"jira">, z.ZodLiteral<"bugzilla">]>, z.ZodLiteral<"unknown">]>;
        url: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type Tracker = z.infer<typeof trackerSchema>;
export declare const upstreamDataSchema: z.ZodObject<{
    sha: z.ZodString;
    repo: z.ZodString;
    url: z.ZodString;
}, z.core.$strip>;
export type UpstreamData = z.infer<typeof upstreamDataSchema>;
declare const upstreamSchema: z.ZodObject<{
    status: z.ZodUnion<readonly [z.ZodLiteral<"success">, z.ZodLiteral<"failure">]>;
    exception: z.ZodOptional<z.ZodString>;
    data: z.ZodArray<z.ZodObject<{
        sha: z.ZodString;
        repo: z.ZodString;
        url: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type Upstream = z.infer<typeof upstreamSchema>;
declare const validatedCommitSchema: z.ZodObject<{
    status: z.ZodUnion<readonly [z.ZodLiteral<"success">, z.ZodLiteral<"failure">]>;
    message: z.ZodString;
    tracker: z.ZodOptional<z.ZodObject<{
        status: z.ZodUnion<readonly [z.ZodLiteral<"success">, z.ZodLiteral<"failure">]>;
        message: z.ZodString;
        data: z.ZodArray<z.ZodObject<{
            exception: z.ZodOptional<z.ZodString>;
            data: z.ZodOptional<z.ZodObject<{
                keyword: z.ZodString;
                id: z.ZodString;
                type: z.ZodUnion<readonly [z.ZodUnion<readonly [z.ZodLiteral<"jira">, z.ZodLiteral<"bugzilla">]>, z.ZodLiteral<"unknown">]>;
                url: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>>;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
    upstream: z.ZodOptional<z.ZodObject<{
        status: z.ZodUnion<readonly [z.ZodLiteral<"success">, z.ZodLiteral<"failure">]>;
        exception: z.ZodOptional<z.ZodString>;
        data: z.ZodArray<z.ZodObject<{
            sha: z.ZodString;
            repo: z.ZodString;
            url: z.ZodString;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type ValidatedCommit = z.infer<typeof validatedCommitSchema>;
declare const outputCommitMetadataSchema: z.ZodArray<z.ZodObject<{
    sha: z.ZodString;
    url: z.ZodString;
    message: z.ZodObject<{
        title: z.ZodString;
        body: z.ZodString;
        cherryPick: z.ZodArray<z.ZodObject<{
            sha: z.ZodString;
        }, z.core.$strip>>;
    }, z.core.$strip>;
    validation: z.ZodObject<{
        status: z.ZodUnion<readonly [z.ZodLiteral<"success">, z.ZodLiteral<"failure">]>;
        message: z.ZodString;
        tracker: z.ZodOptional<z.ZodObject<{
            status: z.ZodUnion<readonly [z.ZodLiteral<"success">, z.ZodLiteral<"failure">]>;
            message: z.ZodString;
            data: z.ZodArray<z.ZodObject<{
                exception: z.ZodOptional<z.ZodString>;
                data: z.ZodOptional<z.ZodObject<{
                    keyword: z.ZodString;
                    id: z.ZodString;
                    type: z.ZodUnion<readonly [z.ZodUnion<readonly [z.ZodLiteral<"jira">, z.ZodLiteral<"bugzilla">]>, z.ZodLiteral<"unknown">]>;
                    url: z.ZodOptional<z.ZodString>;
                }, z.core.$strip>>;
            }, z.core.$strip>>;
        }, z.core.$strip>>;
        upstream: z.ZodOptional<z.ZodObject<{
            status: z.ZodUnion<readonly [z.ZodLiteral<"success">, z.ZodLiteral<"failure">]>;
            exception: z.ZodOptional<z.ZodString>;
            data: z.ZodArray<z.ZodObject<{
                sha: z.ZodString;
                repo: z.ZodString;
                url: z.ZodString;
            }, z.core.$strip>>;
        }, z.core.$strip>>;
    }, z.core.$strip>;
}, z.core.$strip>>;
export type OutputCommitMetadata = z.infer<typeof outputCommitMetadataSchema>;
export declare const outputValidatedPullRequestMetadataSchema: z.ZodObject<{
    validation: z.ZodObject<{
        status: z.ZodUnion<readonly [z.ZodLiteral<"success">, z.ZodLiteral<"failure">]>;
        tracker: z.ZodOptional<z.ZodObject<{
            id: z.ZodOptional<z.ZodString>;
            type: z.ZodUnion<readonly [z.ZodUnion<readonly [z.ZodLiteral<"jira">, z.ZodLiteral<"bugzilla">]>, z.ZodLiteral<"unknown">]>;
            url: z.ZodOptional<z.ZodString>;
            message: z.ZodString;
            exception: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
        message: z.ZodString;
    }, z.core.$strip>;
    commits: z.ZodArray<z.ZodObject<{
        sha: z.ZodString;
        url: z.ZodString;
        message: z.ZodObject<{
            title: z.ZodString;
            body: z.ZodString;
            cherryPick: z.ZodArray<z.ZodObject<{
                sha: z.ZodString;
            }, z.core.$strip>>;
        }, z.core.$strip>;
        validation: z.ZodObject<{
            status: z.ZodUnion<readonly [z.ZodLiteral<"success">, z.ZodLiteral<"failure">]>;
            message: z.ZodString;
            tracker: z.ZodOptional<z.ZodObject<{
                status: z.ZodUnion<readonly [z.ZodLiteral<"success">, z.ZodLiteral<"failure">]>;
                message: z.ZodString;
                data: z.ZodArray<z.ZodObject<{
                    exception: z.ZodOptional<z.ZodString>;
                    data: z.ZodOptional<z.ZodObject<{
                        keyword: z.ZodString;
                        id: z.ZodString;
                        type: z.ZodUnion<readonly [z.ZodUnion<readonly [z.ZodLiteral<"jira">, z.ZodLiteral<"bugzilla">]>, z.ZodLiteral<"unknown">]>;
                        url: z.ZodOptional<z.ZodString>;
                    }, z.core.$strip>>;
                }, z.core.$strip>>;
            }, z.core.$strip>>;
            upstream: z.ZodOptional<z.ZodObject<{
                status: z.ZodUnion<readonly [z.ZodLiteral<"success">, z.ZodLiteral<"failure">]>;
                exception: z.ZodOptional<z.ZodString>;
                data: z.ZodArray<z.ZodObject<{
                    sha: z.ZodString;
                    repo: z.ZodString;
                    url: z.ZodString;
                }, z.core.$strip>>;
            }, z.core.$strip>>;
        }, z.core.$strip>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type OutputValidatedPullRequestMetadata = z.infer<typeof outputValidatedPullRequestMetadataSchema>;
export {};
