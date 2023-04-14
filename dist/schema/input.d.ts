import { z } from 'zod';
export declare const singleCommitMetadataSchema: z.ZodObject<{
    sha: z.ZodString;
    url: z.ZodString;
    message: z.ZodObject<{
        title: z.ZodString;
        body: z.ZodString;
        cherryPick: z.ZodArray<z.ZodObject<{
            sha: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            sha: string;
        }, {
            sha: string;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        title: string;
        body: string;
        cherryPick: {
            sha: string;
        }[];
    }, {
        title: string;
        body: string;
        cherryPick: {
            sha: string;
        }[];
    }>;
}, "strip", z.ZodTypeAny, {
    message: {
        title: string;
        body: string;
        cherryPick: {
            sha: string;
        }[];
    };
    url: string;
    sha: string;
}, {
    message: {
        title: string;
        body: string;
        cherryPick: {
            sha: string;
        }[];
    };
    url: string;
    sha: string;
}>;
export type SingleCommitMetadataT = z.infer<typeof singleCommitMetadataSchema>;
export declare const commitMetadataSchema: z.ZodArray<z.ZodObject<{
    sha: z.ZodString;
    url: z.ZodString;
    message: z.ZodObject<{
        title: z.ZodString;
        body: z.ZodString;
        cherryPick: z.ZodArray<z.ZodObject<{
            sha: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            sha: string;
        }, {
            sha: string;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        title: string;
        body: string;
        cherryPick: {
            sha: string;
        }[];
    }, {
        title: string;
        body: string;
        cherryPick: {
            sha: string;
        }[];
    }>;
}, "strip", z.ZodTypeAny, {
    message: {
        title: string;
        body: string;
        cherryPick: {
            sha: string;
        }[];
    };
    url: string;
    sha: string;
}, {
    message: {
        title: string;
        body: string;
        cherryPick: {
            sha: string;
        }[];
    };
    url: string;
    sha: string;
}>, "many">;
export type CommitMetadataT = z.infer<typeof commitMetadataSchema>;
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
            }, "strip", z.ZodTypeAny, {
                sha: string;
            }, {
                sha: string;
            }>, "many">;
        }, "strip", z.ZodTypeAny, {
            title: string;
            body: string;
            cherryPick: {
                sha: string;
            }[];
        }, {
            title: string;
            body: string;
            cherryPick: {
                sha: string;
            }[];
        }>;
    }, "strip", z.ZodTypeAny, {
        message: {
            title: string;
            body: string;
            cherryPick: {
                sha: string;
            }[];
        };
        url: string;
        sha: string;
    }, {
        message: {
            title: string;
            body: string;
            cherryPick: {
                sha: string;
            }[];
        };
        url: string;
        sha: string;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    number: number;
    commits: {
        message: {
            title: string;
            body: string;
            cherryPick: {
                sha: string;
            }[];
        };
        url: string;
        sha: string;
    }[];
}, {
    number: number;
    commits: {
        message: {
            title: string;
            body: string;
            cherryPick: {
                sha: string;
            }[];
        };
        url: string;
        sha: string;
    }[];
}>;
export type PullRequestMetadataT = z.infer<typeof pullRequestMetadataSchema>;
