import { z } from 'zod';

export const configExceptionSchema = z.object({
  label: z.array(z.string()).optional(),
  note: z.array(z.string()).optional(),
});

export type ConfigException = z.infer<typeof configExceptionSchema>;

export const configCherryPickSchema = z.object({
  upstream: z.array(
    z.object({
      github: z.string(),
    })
  ),
  exception: configExceptionSchema.optional(),
});

export type ConfigCherryPick = z.infer<typeof configCherryPickSchema>;

export const configTrackerTypeSchema = z.union([
  z.literal('jira'),
  z.literal('bugzilla'),
]);

export type ConfigTrackerType = z.infer<typeof configTrackerTypeSchema>;

export const configTrackerSchema = z.object({
  keyword: z.array(z.string()),
  'issue-format': z.array(z.string()),
  type: configTrackerTypeSchema,
  url: z.string().optional(),
  exception: configExceptionSchema.optional(),
});

export type ConfigTracker = z.infer<typeof configTrackerSchema>;

export const configPolicySchema = z.object({
  'cherry-pick': configCherryPickSchema.optional().default({ upstream: [] }),
  tracker: z.array(configTrackerSchema).optional().default([]),
});

export type ConfigPolicy = z.infer<typeof configPolicySchema>;

export const configSchema = z.object({
  policy: configPolicySchema.optional().default({}),
});
