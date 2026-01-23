import { z } from 'zod';
export declare const singleCommitMetadataSchema: z.ZodObject<{
    sha: z.ZodString;
    url: z.ZodString;
    message: z.ZodObject<{
        title: z.ZodString;
        body: z.ZodString;
        cherryPick: z.ZodArray<z.ZodObject<{
            sha: z.ZodString;
        }, z.core.$strip>>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type SingleCommitMetadata = z.infer<typeof singleCommitMetadataSchema>;
export declare const commitMetadataSchema: z.ZodArray<z.ZodObject<{
    sha: z.ZodString;
    url: z.ZodString;
    message: z.ZodObject<{
        title: z.ZodString;
        body: z.ZodString;
        cherryPick: z.ZodArray<z.ZodObject<{
            sha: z.ZodString;
        }, z.core.$strip>>;
    }, z.core.$strip>;
}, z.core.$strip>>;
export type CommitMetadata = z.infer<typeof commitMetadataSchema>;
export declare const pullRequestMetadataSchema: z.ZodObject<{
    number: z.ZodNumber;
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
    }, z.core.$strip>>;
}, z.core.$strip>;
export type PullRequestMetadata = z.infer<typeof pullRequestMetadataSchema>;
