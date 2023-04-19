import { z } from 'zod';
declare const statusSchema: z.ZodUnion<[z.ZodLiteral<"success">, z.ZodLiteral<"failure">]>;
export type StatusT = z.infer<typeof statusSchema>;
declare const trackerSchema: z.ZodObject<{
    exception: z.ZodOptional<z.ZodString>;
    data: z.ZodOptional<z.ZodObject<{
        keyword: z.ZodString;
        id: z.ZodString;
        url: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        keyword: string;
        id: string;
        url?: string | undefined;
    }, {
        keyword: string;
        id: string;
        url?: string | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    exception?: string | undefined;
    data?: {
        keyword: string;
        id: string;
        url?: string | undefined;
    } | undefined;
}, {
    exception?: string | undefined;
    data?: {
        keyword: string;
        id: string;
        url?: string | undefined;
    } | undefined;
}>;
export type TrackerT = z.infer<typeof trackerSchema>;
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
export type UpstreamDataT = z.infer<typeof upstreamDataSchema>;
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
export type UpstreamT = z.infer<typeof upstreamSchema>;
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
                url: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                keyword: string;
                id: string;
                url?: string | undefined;
            }, {
                keyword: string;
                id: string;
                url?: string | undefined;
            }>>;
        }, "strip", z.ZodTypeAny, {
            exception?: string | undefined;
            data?: {
                keyword: string;
                id: string;
                url?: string | undefined;
            } | undefined;
        }, {
            exception?: string | undefined;
            data?: {
                keyword: string;
                id: string;
                url?: string | undefined;
            } | undefined;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        message: string;
        status: "success" | "failure";
        data: {
            exception?: string | undefined;
            data?: {
                keyword: string;
                id: string;
                url?: string | undefined;
            } | undefined;
        }[];
    }, {
        message: string;
        status: "success" | "failure";
        data: {
            exception?: string | undefined;
            data?: {
                keyword: string;
                id: string;
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
    tracker?: {
        message: string;
        status: "success" | "failure";
        data: {
            exception?: string | undefined;
            data?: {
                keyword: string;
                id: string;
                url?: string | undefined;
            } | undefined;
        }[];
    } | undefined;
    upstream?: {
        status: "success" | "failure";
        data: {
            url: string;
            sha: string;
            repo: string;
        }[];
        exception?: string | undefined;
    } | undefined;
}, {
    message: string;
    status: "success" | "failure";
    tracker?: {
        message: string;
        status: "success" | "failure";
        data: {
            exception?: string | undefined;
            data?: {
                keyword: string;
                id: string;
                url?: string | undefined;
            } | undefined;
        }[];
    } | undefined;
    upstream?: {
        status: "success" | "failure";
        data: {
            url: string;
            sha: string;
            repo: string;
        }[];
        exception?: string | undefined;
    } | undefined;
}>;
export type ValidatedCommitT = z.infer<typeof validatedCommitSchema>;
declare const outputCommitMetadataSchema: z.ZodArray<z.ZodObject<{
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
    url: z.ZodString;
    sha: z.ZodString;
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
                    url: z.ZodOptional<z.ZodString>;
                }, "strip", z.ZodTypeAny, {
                    keyword: string;
                    id: string;
                    url?: string | undefined;
                }, {
                    keyword: string;
                    id: string;
                    url?: string | undefined;
                }>>;
            }, "strip", z.ZodTypeAny, {
                exception?: string | undefined;
                data?: {
                    keyword: string;
                    id: string;
                    url?: string | undefined;
                } | undefined;
            }, {
                exception?: string | undefined;
                data?: {
                    keyword: string;
                    id: string;
                    url?: string | undefined;
                } | undefined;
            }>, "many">;
        }, "strip", z.ZodTypeAny, {
            message: string;
            status: "success" | "failure";
            data: {
                exception?: string | undefined;
                data?: {
                    keyword: string;
                    id: string;
                    url?: string | undefined;
                } | undefined;
            }[];
        }, {
            message: string;
            status: "success" | "failure";
            data: {
                exception?: string | undefined;
                data?: {
                    keyword: string;
                    id: string;
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
        tracker?: {
            message: string;
            status: "success" | "failure";
            data: {
                exception?: string | undefined;
                data?: {
                    keyword: string;
                    id: string;
                    url?: string | undefined;
                } | undefined;
            }[];
        } | undefined;
        upstream?: {
            status: "success" | "failure";
            data: {
                url: string;
                sha: string;
                repo: string;
            }[];
            exception?: string | undefined;
        } | undefined;
    }, {
        message: string;
        status: "success" | "failure";
        tracker?: {
            message: string;
            status: "success" | "failure";
            data: {
                exception?: string | undefined;
                data?: {
                    keyword: string;
                    id: string;
                    url?: string | undefined;
                } | undefined;
            }[];
        } | undefined;
        upstream?: {
            status: "success" | "failure";
            data: {
                url: string;
                sha: string;
                repo: string;
            }[];
            exception?: string | undefined;
        } | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
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
        tracker?: {
            message: string;
            status: "success" | "failure";
            data: {
                exception?: string | undefined;
                data?: {
                    keyword: string;
                    id: string;
                    url?: string | undefined;
                } | undefined;
            }[];
        } | undefined;
        upstream?: {
            status: "success" | "failure";
            data: {
                url: string;
                sha: string;
                repo: string;
            }[];
            exception?: string | undefined;
        } | undefined;
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
    validation: {
        message: string;
        status: "success" | "failure";
        tracker?: {
            message: string;
            status: "success" | "failure";
            data: {
                exception?: string | undefined;
                data?: {
                    keyword: string;
                    id: string;
                    url?: string | undefined;
                } | undefined;
            }[];
        } | undefined;
        upstream?: {
            status: "success" | "failure";
            data: {
                url: string;
                sha: string;
                repo: string;
            }[];
            exception?: string | undefined;
        } | undefined;
    };
    url: string;
    sha: string;
}>, "many">;
export type OutputCommitMetadataT = z.infer<typeof outputCommitMetadataSchema>;
export declare const outputValidatedPullRequestMetadataSchema: z.ZodObject<{
    validation: z.ZodObject<{
        status: z.ZodUnion<[z.ZodLiteral<"success">, z.ZodLiteral<"failure">]>;
        tracker: z.ZodOptional<z.ZodObject<{
            id: z.ZodOptional<z.ZodString>;
            url: z.ZodOptional<z.ZodString>;
            message: z.ZodString;
            exception: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            message: string;
            id?: string | undefined;
            url?: string | undefined;
            exception?: string | undefined;
        }, {
            message: string;
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
            id?: string | undefined;
            url?: string | undefined;
            exception?: string | undefined;
        } | undefined;
    }, {
        message: string;
        status: "success" | "failure";
        tracker?: {
            message: string;
            id?: string | undefined;
            url?: string | undefined;
            exception?: string | undefined;
        } | undefined;
    }>;
    commits: z.ZodArray<z.ZodObject<{
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
        url: z.ZodString;
        sha: z.ZodString;
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
                        url: z.ZodOptional<z.ZodString>;
                    }, "strip", z.ZodTypeAny, {
                        keyword: string;
                        id: string;
                        url?: string | undefined;
                    }, {
                        keyword: string;
                        id: string;
                        url?: string | undefined;
                    }>>;
                }, "strip", z.ZodTypeAny, {
                    exception?: string | undefined;
                    data?: {
                        keyword: string;
                        id: string;
                        url?: string | undefined;
                    } | undefined;
                }, {
                    exception?: string | undefined;
                    data?: {
                        keyword: string;
                        id: string;
                        url?: string | undefined;
                    } | undefined;
                }>, "many">;
            }, "strip", z.ZodTypeAny, {
                message: string;
                status: "success" | "failure";
                data: {
                    exception?: string | undefined;
                    data?: {
                        keyword: string;
                        id: string;
                        url?: string | undefined;
                    } | undefined;
                }[];
            }, {
                message: string;
                status: "success" | "failure";
                data: {
                    exception?: string | undefined;
                    data?: {
                        keyword: string;
                        id: string;
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
            tracker?: {
                message: string;
                status: "success" | "failure";
                data: {
                    exception?: string | undefined;
                    data?: {
                        keyword: string;
                        id: string;
                        url?: string | undefined;
                    } | undefined;
                }[];
            } | undefined;
            upstream?: {
                status: "success" | "failure";
                data: {
                    url: string;
                    sha: string;
                    repo: string;
                }[];
                exception?: string | undefined;
            } | undefined;
        }, {
            message: string;
            status: "success" | "failure";
            tracker?: {
                message: string;
                status: "success" | "failure";
                data: {
                    exception?: string | undefined;
                    data?: {
                        keyword: string;
                        id: string;
                        url?: string | undefined;
                    } | undefined;
                }[];
            } | undefined;
            upstream?: {
                status: "success" | "failure";
                data: {
                    url: string;
                    sha: string;
                    repo: string;
                }[];
                exception?: string | undefined;
            } | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
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
            tracker?: {
                message: string;
                status: "success" | "failure";
                data: {
                    exception?: string | undefined;
                    data?: {
                        keyword: string;
                        id: string;
                        url?: string | undefined;
                    } | undefined;
                }[];
            } | undefined;
            upstream?: {
                status: "success" | "failure";
                data: {
                    url: string;
                    sha: string;
                    repo: string;
                }[];
                exception?: string | undefined;
            } | undefined;
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
        validation: {
            message: string;
            status: "success" | "failure";
            tracker?: {
                message: string;
                status: "success" | "failure";
                data: {
                    exception?: string | undefined;
                    data?: {
                        keyword: string;
                        id: string;
                        url?: string | undefined;
                    } | undefined;
                }[];
            } | undefined;
            upstream?: {
                status: "success" | "failure";
                data: {
                    url: string;
                    sha: string;
                    repo: string;
                }[];
                exception?: string | undefined;
            } | undefined;
        };
        url: string;
        sha: string;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    validation: {
        message: string;
        status: "success" | "failure";
        tracker?: {
            message: string;
            id?: string | undefined;
            url?: string | undefined;
            exception?: string | undefined;
        } | undefined;
    };
    commits: {
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
            tracker?: {
                message: string;
                status: "success" | "failure";
                data: {
                    exception?: string | undefined;
                    data?: {
                        keyword: string;
                        id: string;
                        url?: string | undefined;
                    } | undefined;
                }[];
            } | undefined;
            upstream?: {
                status: "success" | "failure";
                data: {
                    url: string;
                    sha: string;
                    repo: string;
                }[];
                exception?: string | undefined;
            } | undefined;
        };
        url: string;
        sha: string;
    }[];
}, {
    validation: {
        message: string;
        status: "success" | "failure";
        tracker?: {
            message: string;
            id?: string | undefined;
            url?: string | undefined;
            exception?: string | undefined;
        } | undefined;
    };
    commits: {
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
            tracker?: {
                message: string;
                status: "success" | "failure";
                data: {
                    exception?: string | undefined;
                    data?: {
                        keyword: string;
                        id: string;
                        url?: string | undefined;
                    } | undefined;
                }[];
            } | undefined;
            upstream?: {
                status: "success" | "failure";
                data: {
                    url: string;
                    sha: string;
                    repo: string;
                }[];
                exception?: string | undefined;
            } | undefined;
        };
        url: string;
        sha: string;
    }[];
}>;
export type OutputValidatedPullRequestMetadataT = z.infer<typeof outputValidatedPullRequestMetadataSchema>;
export {};
