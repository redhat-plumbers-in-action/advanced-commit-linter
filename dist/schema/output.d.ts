import { z } from 'zod';
declare const statusSchema: z.ZodUnion<[z.ZodLiteral<"success">, z.ZodLiteral<"failure">]>;
export type Status = z.infer<typeof statusSchema>;
declare const trackerSchema: z.ZodObject<{
    exception: z.ZodOptional<z.ZodString>;
    data: z.ZodOptional<z.ZodObject<{
        keyword: z.ZodString;
        id: z.ZodString;
        type: z.ZodUnion<[z.ZodUnion<[z.ZodLiteral<"jira">, z.ZodLiteral<"bugzilla">]>, z.ZodLiteral<"unknown">]>;
        url: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        type: "unknown" | "jira" | "bugzilla";
        keyword: string;
        url?: string | undefined;
    }, {
        id: string;
        type: "unknown" | "jira" | "bugzilla";
        keyword: string;
        url?: string | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    exception?: string | undefined;
    data?: {
        id: string;
        type: "unknown" | "jira" | "bugzilla";
        keyword: string;
        url?: string | undefined;
    } | undefined;
}, {
    exception?: string | undefined;
    data?: {
        id: string;
        type: "unknown" | "jira" | "bugzilla";
        keyword: string;
        url?: string | undefined;
    } | undefined;
}>;
export type Tracker = z.infer<typeof trackerSchema>;
export declare const upstreamDataSchema: z.ZodObject<{
    sha: z.ZodString;
    repo: z.ZodString;
    url: z.ZodString;
}, "strip", z.ZodTypeAny, {
    url: string;
    sha: string;
    repo: string;
}, {
    url: string;
    sha: string;
    repo: string;
}>;
export type UpstreamData = z.infer<typeof upstreamDataSchema>;
declare const upstreamSchema: z.ZodObject<{
    status: z.ZodUnion<[z.ZodLiteral<"success">, z.ZodLiteral<"failure">]>;
    exception: z.ZodOptional<z.ZodString>;
    data: z.ZodArray<z.ZodObject<{
        sha: z.ZodString;
        repo: z.ZodString;
        url: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        url: string;
        sha: string;
        repo: string;
    }, {
        url: string;
        sha: string;
        repo: string;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    status: "success" | "failure";
    data: {
        url: string;
        sha: string;
        repo: string;
    }[];
    exception?: string | undefined;
}, {
    status: "success" | "failure";
    data: {
        url: string;
        sha: string;
        repo: string;
    }[];
    exception?: string | undefined;
}>;
export type Upstream = z.infer<typeof upstreamSchema>;
declare const validatedCommitSchema: z.ZodObject<{
    status: z.ZodUnion<[z.ZodLiteral<"success">, z.ZodLiteral<"failure">]>;
    message: z.ZodString;
    tracker: z.ZodOptional<z.ZodObject<{
        status: z.ZodUnion<[z.ZodLiteral<"success">, z.ZodLiteral<"failure">]>;
        message: z.ZodString;
        data: z.ZodArray<z.ZodObject<{
            exception: z.ZodOptional<z.ZodString>;
            data: z.ZodOptional<z.ZodObject<{
                keyword: z.ZodString;
                id: z.ZodString;
                type: z.ZodUnion<[z.ZodUnion<[z.ZodLiteral<"jira">, z.ZodLiteral<"bugzilla">]>, z.ZodLiteral<"unknown">]>;
                url: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                id: string;
                type: "unknown" | "jira" | "bugzilla";
                keyword: string;
                url?: string | undefined;
            }, {
                id: string;
                type: "unknown" | "jira" | "bugzilla";
                keyword: string;
                url?: string | undefined;
            }>>;
        }, "strip", z.ZodTypeAny, {
            exception?: string | undefined;
            data?: {
                id: string;
                type: "unknown" | "jira" | "bugzilla";
                keyword: string;
                url?: string | undefined;
            } | undefined;
        }, {
            exception?: string | undefined;
            data?: {
                id: string;
                type: "unknown" | "jira" | "bugzilla";
                keyword: string;
                url?: string | undefined;
            } | undefined;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        message: string;
        status: "success" | "failure";
        data: {
            exception?: string | undefined;
            data?: {
                id: string;
                type: "unknown" | "jira" | "bugzilla";
                keyword: string;
                url?: string | undefined;
            } | undefined;
        }[];
    }, {
        message: string;
        status: "success" | "failure";
        data: {
            exception?: string | undefined;
            data?: {
                id: string;
                type: "unknown" | "jira" | "bugzilla";
                keyword: string;
                url?: string | undefined;
            } | undefined;
        }[];
    }>>;
    upstream: z.ZodOptional<z.ZodObject<{
        status: z.ZodUnion<[z.ZodLiteral<"success">, z.ZodLiteral<"failure">]>;
        exception: z.ZodOptional<z.ZodString>;
        data: z.ZodArray<z.ZodObject<{
            sha: z.ZodString;
            repo: z.ZodString;
            url: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            url: string;
            sha: string;
            repo: string;
        }, {
            url: string;
            sha: string;
            repo: string;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        status: "success" | "failure";
        data: {
            url: string;
            sha: string;
            repo: string;
        }[];
        exception?: string | undefined;
    }, {
        status: "success" | "failure";
        data: {
            url: string;
            sha: string;
            repo: string;
        }[];
        exception?: string | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    message: string;
    status: "success" | "failure";
    upstream?: {
        status: "success" | "failure";
        data: {
            url: string;
            sha: string;
            repo: string;
        }[];
        exception?: string | undefined;
    } | undefined;
    tracker?: {
        message: string;
        status: "success" | "failure";
        data: {
            exception?: string | undefined;
            data?: {
                id: string;
                type: "unknown" | "jira" | "bugzilla";
                keyword: string;
                url?: string | undefined;
            } | undefined;
        }[];
    } | undefined;
}, {
    message: string;
    status: "success" | "failure";
    upstream?: {
        status: "success" | "failure";
        data: {
            url: string;
            sha: string;
            repo: string;
        }[];
        exception?: string | undefined;
    } | undefined;
    tracker?: {
        message: string;
        status: "success" | "failure";
        data: {
            exception?: string | undefined;
            data?: {
                id: string;
                type: "unknown" | "jira" | "bugzilla";
                keyword: string;
                url?: string | undefined;
            } | undefined;
        }[];
    } | undefined;
}>;
export type ValidatedCommit = z.infer<typeof validatedCommitSchema>;
declare const outputCommitMetadataSchema: z.ZodArray<z.ZodObject<{
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
} & {
    validation: z.ZodObject<{
        status: z.ZodUnion<[z.ZodLiteral<"success">, z.ZodLiteral<"failure">]>;
        message: z.ZodString;
        tracker: z.ZodOptional<z.ZodObject<{
            status: z.ZodUnion<[z.ZodLiteral<"success">, z.ZodLiteral<"failure">]>;
            message: z.ZodString;
            data: z.ZodArray<z.ZodObject<{
                exception: z.ZodOptional<z.ZodString>;
                data: z.ZodOptional<z.ZodObject<{
                    keyword: z.ZodString;
                    id: z.ZodString;
                    type: z.ZodUnion<[z.ZodUnion<[z.ZodLiteral<"jira">, z.ZodLiteral<"bugzilla">]>, z.ZodLiteral<"unknown">]>;
                    url: z.ZodOptional<z.ZodString>;
                }, "strip", z.ZodTypeAny, {
                    id: string;
                    type: "unknown" | "jira" | "bugzilla";
                    keyword: string;
                    url?: string | undefined;
                }, {
                    id: string;
                    type: "unknown" | "jira" | "bugzilla";
                    keyword: string;
                    url?: string | undefined;
                }>>;
            }, "strip", z.ZodTypeAny, {
                exception?: string | undefined;
                data?: {
                    id: string;
                    type: "unknown" | "jira" | "bugzilla";
                    keyword: string;
                    url?: string | undefined;
                } | undefined;
            }, {
                exception?: string | undefined;
                data?: {
                    id: string;
                    type: "unknown" | "jira" | "bugzilla";
                    keyword: string;
                    url?: string | undefined;
                } | undefined;
            }>, "many">;
        }, "strip", z.ZodTypeAny, {
            message: string;
            status: "success" | "failure";
            data: {
                exception?: string | undefined;
                data?: {
                    id: string;
                    type: "unknown" | "jira" | "bugzilla";
                    keyword: string;
                    url?: string | undefined;
                } | undefined;
            }[];
        }, {
            message: string;
            status: "success" | "failure";
            data: {
                exception?: string | undefined;
                data?: {
                    id: string;
                    type: "unknown" | "jira" | "bugzilla";
                    keyword: string;
                    url?: string | undefined;
                } | undefined;
            }[];
        }>>;
        upstream: z.ZodOptional<z.ZodObject<{
            status: z.ZodUnion<[z.ZodLiteral<"success">, z.ZodLiteral<"failure">]>;
            exception: z.ZodOptional<z.ZodString>;
            data: z.ZodArray<z.ZodObject<{
                sha: z.ZodString;
                repo: z.ZodString;
                url: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                url: string;
                sha: string;
                repo: string;
            }, {
                url: string;
                sha: string;
                repo: string;
            }>, "many">;
        }, "strip", z.ZodTypeAny, {
            status: "success" | "failure";
            data: {
                url: string;
                sha: string;
                repo: string;
            }[];
            exception?: string | undefined;
        }, {
            status: "success" | "failure";
            data: {
                url: string;
                sha: string;
                repo: string;
            }[];
            exception?: string | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        message: string;
        status: "success" | "failure";
        upstream?: {
            status: "success" | "failure";
            data: {
                url: string;
                sha: string;
                repo: string;
            }[];
            exception?: string | undefined;
        } | undefined;
        tracker?: {
            message: string;
            status: "success" | "failure";
            data: {
                exception?: string | undefined;
                data?: {
                    id: string;
                    type: "unknown" | "jira" | "bugzilla";
                    keyword: string;
                    url?: string | undefined;
                } | undefined;
            }[];
        } | undefined;
    }, {
        message: string;
        status: "success" | "failure";
        upstream?: {
            status: "success" | "failure";
            data: {
                url: string;
                sha: string;
                repo: string;
            }[];
            exception?: string | undefined;
        } | undefined;
        tracker?: {
            message: string;
            status: "success" | "failure";
            data: {
                exception?: string | undefined;
                data?: {
                    id: string;
                    type: "unknown" | "jira" | "bugzilla";
                    keyword: string;
                    url?: string | undefined;
                } | undefined;
            }[];
        } | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    url: string;
    message: {
        title: string;
        body: string;
        cherryPick: {
            sha: string;
        }[];
    };
    validation: {
        message: string;
        status: "success" | "failure";
        upstream?: {
            status: "success" | "failure";
            data: {
                url: string;
                sha: string;
                repo: string;
            }[];
            exception?: string | undefined;
        } | undefined;
        tracker?: {
            message: string;
            status: "success" | "failure";
            data: {
                exception?: string | undefined;
                data?: {
                    id: string;
                    type: "unknown" | "jira" | "bugzilla";
                    keyword: string;
                    url?: string | undefined;
                } | undefined;
            }[];
        } | undefined;
    };
    sha: string;
}, {
    url: string;
    message: {
        title: string;
        body: string;
        cherryPick: {
            sha: string;
        }[];
    };
    validation: {
        message: string;
        status: "success" | "failure";
        upstream?: {
            status: "success" | "failure";
            data: {
                url: string;
                sha: string;
                repo: string;
            }[];
            exception?: string | undefined;
        } | undefined;
        tracker?: {
            message: string;
            status: "success" | "failure";
            data: {
                exception?: string | undefined;
                data?: {
                    id: string;
                    type: "unknown" | "jira" | "bugzilla";
                    keyword: string;
                    url?: string | undefined;
                } | undefined;
            }[];
        } | undefined;
    };
    sha: string;
}>, "many">;
export type OutputCommitMetadata = z.infer<typeof outputCommitMetadataSchema>;
export declare const outputValidatedPullRequestMetadataSchema: z.ZodObject<{
    validation: z.ZodObject<{
        status: z.ZodUnion<[z.ZodLiteral<"success">, z.ZodLiteral<"failure">]>;
        tracker: z.ZodOptional<z.ZodObject<{
            id: z.ZodOptional<z.ZodString>;
            type: z.ZodUnion<[z.ZodUnion<[z.ZodLiteral<"jira">, z.ZodLiteral<"bugzilla">]>, z.ZodLiteral<"unknown">]>;
            url: z.ZodOptional<z.ZodString>;
            message: z.ZodString;
            exception: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            message: string;
            type: "unknown" | "jira" | "bugzilla";
            id?: string | undefined;
            url?: string | undefined;
            exception?: string | undefined;
        }, {
            message: string;
            type: "unknown" | "jira" | "bugzilla";
            id?: string | undefined;
            url?: string | undefined;
            exception?: string | undefined;
        }>>;
        message: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        message: string;
        status: "success" | "failure";
        tracker?: {
            message: string;
            type: "unknown" | "jira" | "bugzilla";
            id?: string | undefined;
            url?: string | undefined;
            exception?: string | undefined;
        } | undefined;
    }, {
        message: string;
        status: "success" | "failure";
        tracker?: {
            message: string;
            type: "unknown" | "jira" | "bugzilla";
            id?: string | undefined;
            url?: string | undefined;
            exception?: string | undefined;
        } | undefined;
    }>;
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
    } & {
        validation: z.ZodObject<{
            status: z.ZodUnion<[z.ZodLiteral<"success">, z.ZodLiteral<"failure">]>;
            message: z.ZodString;
            tracker: z.ZodOptional<z.ZodObject<{
                status: z.ZodUnion<[z.ZodLiteral<"success">, z.ZodLiteral<"failure">]>;
                message: z.ZodString;
                data: z.ZodArray<z.ZodObject<{
                    exception: z.ZodOptional<z.ZodString>;
                    data: z.ZodOptional<z.ZodObject<{
                        keyword: z.ZodString;
                        id: z.ZodString;
                        type: z.ZodUnion<[z.ZodUnion<[z.ZodLiteral<"jira">, z.ZodLiteral<"bugzilla">]>, z.ZodLiteral<"unknown">]>;
                        url: z.ZodOptional<z.ZodString>;
                    }, "strip", z.ZodTypeAny, {
                        id: string;
                        type: "unknown" | "jira" | "bugzilla";
                        keyword: string;
                        url?: string | undefined;
                    }, {
                        id: string;
                        type: "unknown" | "jira" | "bugzilla";
                        keyword: string;
                        url?: string | undefined;
                    }>>;
                }, "strip", z.ZodTypeAny, {
                    exception?: string | undefined;
                    data?: {
                        id: string;
                        type: "unknown" | "jira" | "bugzilla";
                        keyword: string;
                        url?: string | undefined;
                    } | undefined;
                }, {
                    exception?: string | undefined;
                    data?: {
                        id: string;
                        type: "unknown" | "jira" | "bugzilla";
                        keyword: string;
                        url?: string | undefined;
                    } | undefined;
                }>, "many">;
            }, "strip", z.ZodTypeAny, {
                message: string;
                status: "success" | "failure";
                data: {
                    exception?: string | undefined;
                    data?: {
                        id: string;
                        type: "unknown" | "jira" | "bugzilla";
                        keyword: string;
                        url?: string | undefined;
                    } | undefined;
                }[];
            }, {
                message: string;
                status: "success" | "failure";
                data: {
                    exception?: string | undefined;
                    data?: {
                        id: string;
                        type: "unknown" | "jira" | "bugzilla";
                        keyword: string;
                        url?: string | undefined;
                    } | undefined;
                }[];
            }>>;
            upstream: z.ZodOptional<z.ZodObject<{
                status: z.ZodUnion<[z.ZodLiteral<"success">, z.ZodLiteral<"failure">]>;
                exception: z.ZodOptional<z.ZodString>;
                data: z.ZodArray<z.ZodObject<{
                    sha: z.ZodString;
                    repo: z.ZodString;
                    url: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    url: string;
                    sha: string;
                    repo: string;
                }, {
                    url: string;
                    sha: string;
                    repo: string;
                }>, "many">;
            }, "strip", z.ZodTypeAny, {
                status: "success" | "failure";
                data: {
                    url: string;
                    sha: string;
                    repo: string;
                }[];
                exception?: string | undefined;
            }, {
                status: "success" | "failure";
                data: {
                    url: string;
                    sha: string;
                    repo: string;
                }[];
                exception?: string | undefined;
            }>>;
        }, "strip", z.ZodTypeAny, {
            message: string;
            status: "success" | "failure";
            upstream?: {
                status: "success" | "failure";
                data: {
                    url: string;
                    sha: string;
                    repo: string;
                }[];
                exception?: string | undefined;
            } | undefined;
            tracker?: {
                message: string;
                status: "success" | "failure";
                data: {
                    exception?: string | undefined;
                    data?: {
                        id: string;
                        type: "unknown" | "jira" | "bugzilla";
                        keyword: string;
                        url?: string | undefined;
                    } | undefined;
                }[];
            } | undefined;
        }, {
            message: string;
            status: "success" | "failure";
            upstream?: {
                status: "success" | "failure";
                data: {
                    url: string;
                    sha: string;
                    repo: string;
                }[];
                exception?: string | undefined;
            } | undefined;
            tracker?: {
                message: string;
                status: "success" | "failure";
                data: {
                    exception?: string | undefined;
                    data?: {
                        id: string;
                        type: "unknown" | "jira" | "bugzilla";
                        keyword: string;
                        url?: string | undefined;
                    } | undefined;
                }[];
            } | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        url: string;
        message: {
            title: string;
            body: string;
            cherryPick: {
                sha: string;
            }[];
        };
        validation: {
            message: string;
            status: "success" | "failure";
            upstream?: {
                status: "success" | "failure";
                data: {
                    url: string;
                    sha: string;
                    repo: string;
                }[];
                exception?: string | undefined;
            } | undefined;
            tracker?: {
                message: string;
                status: "success" | "failure";
                data: {
                    exception?: string | undefined;
                    data?: {
                        id: string;
                        type: "unknown" | "jira" | "bugzilla";
                        keyword: string;
                        url?: string | undefined;
                    } | undefined;
                }[];
            } | undefined;
        };
        sha: string;
    }, {
        url: string;
        message: {
            title: string;
            body: string;
            cherryPick: {
                sha: string;
            }[];
        };
        validation: {
            message: string;
            status: "success" | "failure";
            upstream?: {
                status: "success" | "failure";
                data: {
                    url: string;
                    sha: string;
                    repo: string;
                }[];
                exception?: string | undefined;
            } | undefined;
            tracker?: {
                message: string;
                status: "success" | "failure";
                data: {
                    exception?: string | undefined;
                    data?: {
                        id: string;
                        type: "unknown" | "jira" | "bugzilla";
                        keyword: string;
                        url?: string | undefined;
                    } | undefined;
                }[];
            } | undefined;
        };
        sha: string;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    validation: {
        message: string;
        status: "success" | "failure";
        tracker?: {
            message: string;
            type: "unknown" | "jira" | "bugzilla";
            id?: string | undefined;
            url?: string | undefined;
            exception?: string | undefined;
        } | undefined;
    };
    commits: {
        url: string;
        message: {
            title: string;
            body: string;
            cherryPick: {
                sha: string;
            }[];
        };
        validation: {
            message: string;
            status: "success" | "failure";
            upstream?: {
                status: "success" | "failure";
                data: {
                    url: string;
                    sha: string;
                    repo: string;
                }[];
                exception?: string | undefined;
            } | undefined;
            tracker?: {
                message: string;
                status: "success" | "failure";
                data: {
                    exception?: string | undefined;
                    data?: {
                        id: string;
                        type: "unknown" | "jira" | "bugzilla";
                        keyword: string;
                        url?: string | undefined;
                    } | undefined;
                }[];
            } | undefined;
        };
        sha: string;
    }[];
}, {
    validation: {
        message: string;
        status: "success" | "failure";
        tracker?: {
            message: string;
            type: "unknown" | "jira" | "bugzilla";
            id?: string | undefined;
            url?: string | undefined;
            exception?: string | undefined;
        } | undefined;
    };
    commits: {
        url: string;
        message: {
            title: string;
            body: string;
            cherryPick: {
                sha: string;
            }[];
        };
        validation: {
            message: string;
            status: "success" | "failure";
            upstream?: {
                status: "success" | "failure";
                data: {
                    url: string;
                    sha: string;
                    repo: string;
                }[];
                exception?: string | undefined;
            } | undefined;
            tracker?: {
                message: string;
                status: "success" | "failure";
                data: {
                    exception?: string | undefined;
                    data?: {
                        id: string;
                        type: "unknown" | "jira" | "bugzilla";
                        keyword: string;
                        url?: string | undefined;
                    } | undefined;
                }[];
            } | undefined;
        };
        sha: string;
    }[];
}>;
export type OutputValidatedPullRequestMetadata = z.infer<typeof outputValidatedPullRequestMetadataSchema>;
export {};
