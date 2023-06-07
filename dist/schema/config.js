import { z } from 'zod';
export const configExceptionSchema = z.object({
    label: z.array(z.string()).optional(),
    note: z.array(z.string()).optional(),
});
export const configCherryPickSchema = z.object({
    upstream: z.array(z.object({
        github: z.string(),
    })),
    exception: configExceptionSchema.optional(),
});
export const configTrackerTypeSchema = z.union([
    z.literal('jira'),
    z.literal('bugzilla'),
]);
export const configTrackerSchema = z.object({
    keyword: z.array(z.string()),
    'issue-format': z.array(z.string()),
    type: configTrackerTypeSchema,
    url: z.string().optional(),
    exception: configExceptionSchema.optional(),
});
export const configPolicySchema = z.object({
    'cherry-pick': configCherryPickSchema.optional().default({ upstream: [] }),
    tracker: z.array(configTrackerSchema).optional().default([]),
});
export const configSchema = z.object({
    policy: configPolicySchema.optional().default({}),
});
//# sourceMappingURL=config.js.map