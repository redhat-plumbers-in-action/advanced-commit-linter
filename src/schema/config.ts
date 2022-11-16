import { z } from 'zod';

export const configExceptionSchema = z.object({
  label: z.array(z.string()).optional(),
  note: z.array(z.string()).optional(),
});

export type ConfigExceptionT = z.infer<typeof configExceptionSchema>;

export const configCherryPickSchema = z.object({
  upstream: z.array(
    z.object({
      github: z.string(),
    })
  ),
  exception: configExceptionSchema.optional(),
});

export type ConfigCherryPickT = z.infer<typeof configCherryPickSchema>;

export const configTrackerSchema = z.object({
  keyword: z.array(z.string()),
  'issue-format': z.array(z.string()),
  url: z.string().optional(),
  exception: configExceptionSchema.optional(),
});

export type ConfigTrackerT = z.infer<typeof configTrackerSchema>;

export const configSchema = z.object({
  policy: z.object({
    'cherry-pick': configCherryPickSchema.optional().default({ upstream: [] }),
    tracker: z.array(configTrackerSchema).optional().default([]),
  }),
});

export type ConfigT = z.output<typeof configSchema>;
