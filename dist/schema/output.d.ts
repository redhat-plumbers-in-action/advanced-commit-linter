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
        url?: string | undefined;
        keyword: string;
        id: string;
    }, {
        url?: string | undefined;
        keyword: string;
        id: string;
    }>>;
}, "strip", z.ZodTypeAny, {
    data?: {
        url?: string | undefined;
        keyword: string;
        id: string;
    } | undefined;
    exception?: string | undefined;
}, {
    data?: {
        url?: string | undefined;
        keyword: string;
        id: string;
    } | undefined;
    exception?: string | undefined;
}>;
export type TrackerT = z.infer<typeof trackerSchema>;
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
    exception?: string | undefined;
    status: "success" | "failure";
    data: {
        url: string;
        sha: string;
        repo: string;
    }[];
}, {
    exception?: string | undefined;
    status: "success" | "failure";
    data: {
        url: string;
        sha: string;
        repo: string;
    }[];
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
                url?: string | undefined;
                keyword: string;
                id: string;
            }, {
                url?: string | undefined;
                keyword: string;
                id: string;
            }>>;
        }, "strip", z.ZodTypeAny, {
            data?: {
                url?: string | undefined;
                keyword: string;
                id: string;
            } | undefined;
            exception?: string | undefined;
        }, {
            data?: {
                url?: string | undefined;
                keyword: string;
                id: string;
            } | undefined;
            exception?: string | undefined;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        message: string;
        status: "success" | "failure";
        data: {
            data?: {
                url?: string | undefined;
                keyword: string;
                id: string;
            } | undefined;
            exception?: string | undefined;
        }[];
    }, {
        message: string;
        status: "success" | "failure";
        data: {
            data?: {
                url?: string | undefined;
                keyword: string;
                id: string;
            } | undefined;
            exception?: string | undefined;
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
        exception?: string | undefined;
        status: "success" | "failure";
        data: {
            url: string;
            sha: string;
            repo: string;
        }[];
    }, {
        exception?: string | undefined;
        status: "success" | "failure";
        data: {
            url: string;
            sha: string;
            repo: string;
        }[];
    }>>;
}, "strip", z.ZodTypeAny, {
    upstream?: {
        exception?: string | undefined;
        status: "success" | "failure";
        data: {
            url: string;
            sha: string;
            repo: string;
        }[];
    } | undefined;
    tracker?: {
        message: string;
        status: "success" | "failure";
        data: {
            data?: {
                url?: string | undefined;
                keyword: string;
                id: string;
            } | undefined;
            exception?: string | undefined;
        }[];
    } | undefined;
    message: string;
    status: "success" | "failure";
}, {
    upstream?: {
        exception?: string | undefined;
        status: "success" | "failure";
        data: {
            url: string;
            sha: string;
            repo: string;
        }[];
    } | undefined;
    tracker?: {
        message: string;
        status: "success" | "failure";
        data: {
            data?: {
                url?: string | undefined;
                keyword: string;
                id: string;
            } | undefined;
            exception?: string | undefined;
        }[];
    } | undefined;
    message: string;
    status: "success" | "failure";
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
                    url?: string | undefined;
                    keyword: string;
                    id: string;
                }, {
                    url?: string | undefined;
                    keyword: string;
                    id: string;
                }>>;
            }, "strip", z.ZodTypeAny, {
                data?: {
                    url?: string | undefined;
                    keyword: string;
                    id: string;
                } | undefined;
                exception?: string | undefined;
            }, {
                data?: {
                    url?: string | undefined;
                    keyword: string;
                    id: string;
                } | undefined;
                exception?: string | undefined;
            }>, "many">;
        }, "strip", z.ZodTypeAny, {
            message: string;
            status: "success" | "failure";
            data: {
                data?: {
                    url?: string | undefined;
                    keyword: string;
                    id: string;
                } | undefined;
                exception?: string | undefined;
            }[];
        }, {
            message: string;
            status: "success" | "failure";
            data: {
                data?: {
                    url?: string | undefined;
                    keyword: string;
                    id: string;
                } | undefined;
                exception?: string | undefined;
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
            exception?: string | undefined;
            status: "success" | "failure";
            data: {
                url: string;
                sha: string;
                repo: string;
            }[];
        }, {
            exception?: string | undefined;
            status: "success" | "failure";
            data: {
                url: string;
                sha: string;
                repo: string;
            }[];
        }>>;
    }, "strip", z.ZodTypeAny, {
        upstream?: {
            exception?: string | undefined;
            status: "success" | "failure";
            data: {
                url: string;
                sha: string;
                repo: string;
            }[];
        } | undefined;
        tracker?: {
            message: string;
            status: "success" | "failure";
            data: {
                data?: {
                    url?: string | undefined;
                    keyword: string;
                    id: string;
                } | undefined;
                exception?: string | undefined;
            }[];
        } | undefined;
        message: string;
        status: "success" | "failure";
    }, {
        upstream?: {
            exception?: string | undefined;
            status: "success" | "failure";
            data: {
                url: string;
                sha: string;
                repo: string;
            }[];
        } | undefined;
        tracker?: {
            message: string;
            status: "success" | "failure";
            data: {
                data?: {
                    url?: string | undefined;
                    keyword: string;
                    id: string;
                } | undefined;
                exception?: string | undefined;
            }[];
        } | undefined;
        message: string;
        status: "success" | "failure";
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
        upstream?: {
            exception?: string | undefined;
            status: "success" | "failure";
            data: {
                url: string;
                sha: string;
                repo: string;
            }[];
        } | undefined;
        tracker?: {
            message: string;
            status: "success" | "failure";
            data: {
                data?: {
                    url?: string | undefined;
                    keyword: string;
                    id: string;
                } | undefined;
                exception?: string | undefined;
            }[];
        } | undefined;
        message: string;
        status: "success" | "failure";
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
        upstream?: {
            exception?: string | undefined;
            status: "success" | "failure";
            data: {
                url: string;
                sha: string;
                repo: string;
            }[];
        } | undefined;
        tracker?: {
            message: string;
            status: "success" | "failure";
            data: {
                data?: {
                    url?: string | undefined;
                    keyword: string;
                    id: string;
                } | undefined;
                exception?: string | undefined;
            }[];
        } | undefined;
        message: string;
        status: "success" | "failure";
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
            exception?: string | undefined;
            url?: string | undefined;
            id?: string | undefined;
            message: string;
        }, {
            exception?: string | undefined;
            url?: string | undefined;
            id?: string | undefined;
            message: string;
        }>>;
        message: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        tracker?: {
            exception?: string | undefined;
            url?: string | undefined;
            id?: string | undefined;
            message: string;
        } | undefined;
        message: string;
        status: "success" | "failure";
    }, {
        tracker?: {
            exception?: string | undefined;
            url?: string | undefined;
            id?: string | undefined;
            message: string;
        } | undefined;
        message: string;
        status: "success" | "failure";
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
                        url?: string | undefined;
                        keyword: string;
                        id: string;
                    }, {
                        url?: string | undefined;
                        keyword: string;
                        id: string;
                    }>>;
                }, "strip", z.ZodTypeAny, {
                    data?: {
                        url?: string | undefined;
                        keyword: string;
                        id: string;
                    } | undefined;
                    exception?: string | undefined;
                }, {
                    data?: {
                        url?: string | undefined;
                        keyword: string;
                        id: string;
                    } | undefined;
                    exception?: string | undefined;
                }>, "many">;
            }, "strip", z.ZodTypeAny, {
                message: string;
                status: "success" | "failure";
                data: {
                    data?: {
                        url?: string | undefined;
                        keyword: string;
                        id: string;
                    } | undefined;
                    exception?: string | undefined;
                }[];
            }, {
                message: string;
                status: "success" | "failure";
                data: {
                    data?: {
                        url?: string | undefined;
                        keyword: string;
                        id: string;
                    } | undefined;
                    exception?: string | undefined;
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
                exception?: string | undefined;
                status: "success" | "failure";
                data: {
                    url: string;
                    sha: string;
                    repo: string;
                }[];
            }, {
                exception?: string | undefined;
                status: "success" | "failure";
                data: {
                    url: string;
                    sha: string;
                    repo: string;
                }[];
            }>>;
        }, "strip", z.ZodTypeAny, {
            upstream?: {
                exception?: string | undefined;
                status: "success" | "failure";
                data: {
                    url: string;
                    sha: string;
                    repo: string;
                }[];
            } | undefined;
            tracker?: {
                message: string;
                status: "success" | "failure";
                data: {
                    data?: {
                        url?: string | undefined;
                        keyword: string;
                        id: string;
                    } | undefined;
                    exception?: string | undefined;
                }[];
            } | undefined;
            message: string;
            status: "success" | "failure";
        }, {
            upstream?: {
                exception?: string | undefined;
                status: "success" | "failure";
                data: {
                    url: string;
                    sha: string;
                    repo: string;
                }[];
            } | undefined;
            tracker?: {
                message: string;
                status: "success" | "failure";
                data: {
                    data?: {
                        url?: string | undefined;
                        keyword: string;
                        id: string;
                    } | undefined;
                    exception?: string | undefined;
                }[];
            } | undefined;
            message: string;
            status: "success" | "failure";
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
            upstream?: {
                exception?: string | undefined;
                status: "success" | "failure";
                data: {
                    url: string;
                    sha: string;
                    repo: string;
                }[];
            } | undefined;
            tracker?: {
                message: string;
                status: "success" | "failure";
                data: {
                    data?: {
                        url?: string | undefined;
                        keyword: string;
                        id: string;
                    } | undefined;
                    exception?: string | undefined;
                }[];
            } | undefined;
            message: string;
            status: "success" | "failure";
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
            upstream?: {
                exception?: string | undefined;
                status: "success" | "failure";
                data: {
                    url: string;
                    sha: string;
                    repo: string;
                }[];
            } | undefined;
            tracker?: {
                message: string;
                status: "success" | "failure";
                data: {
                    data?: {
                        url?: string | undefined;
                        keyword: string;
                        id: string;
                    } | undefined;
                    exception?: string | undefined;
                }[];
            } | undefined;
            message: string;
            status: "success" | "failure";
        };
        url: string;
        sha: string;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    validation: {
        tracker?: {
            exception?: string | undefined;
            url?: string | undefined;
            id?: string | undefined;
            message: string;
        } | undefined;
        message: string;
        status: "success" | "failure";
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
            upstream?: {
                exception?: string | undefined;
                status: "success" | "failure";
                data: {
                    url: string;
                    sha: string;
                    repo: string;
                }[];
            } | undefined;
            tracker?: {
                message: string;
                status: "success" | "failure";
                data: {
                    data?: {
                        url?: string | undefined;
                        keyword: string;
                        id: string;
                    } | undefined;
                    exception?: string | undefined;
                }[];
            } | undefined;
            message: string;
            status: "success" | "failure";
        };
        url: string;
        sha: string;
    }[];
}, {
    validation: {
        tracker?: {
            exception?: string | undefined;
            url?: string | undefined;
            id?: string | undefined;
            message: string;
        } | undefined;
        message: string;
        status: "success" | "failure";
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
            upstream?: {
                exception?: string | undefined;
                status: "success" | "failure";
                data: {
                    url: string;
                    sha: string;
                    repo: string;
                }[];
            } | undefined;
            tracker?: {
                message: string;
                status: "success" | "failure";
                data: {
                    data?: {
                        url?: string | undefined;
                        keyword: string;
                        id: string;
                    } | undefined;
                    exception?: string | undefined;
                }[];
            } | undefined;
            message: string;
            status: "success" | "failure";
        };
        url: string;
        sha: string;
    }[];
}>;
export type OutputValidatedPullRequestMetadataT = z.infer<typeof outputValidatedPullRequestMetadataSchema>;
export {};
