import { z } from 'zod';

export const singleCommitMetadataSchema = z.object({
  sha: z.string(),
  url: z.string().url(),
  message: z.object({
    title: z.string(),
    body: z.string(),
    cherryPick: z.array(
      z.object({
        sha: z.string(),
      })
    ),
  }),
});

export type SingleCommitMetadata = z.infer<typeof singleCommitMetadataSchema>;

export const commitMetadataSchema = z.array(singleCommitMetadataSchema);

export type CommitMetadata = z.infer<typeof commitMetadataSchema>;

export const pullRequestMetadataSchema = z.object({
  number: z.number(),
  commits: commitMetadataSchema,
});

export type PullRequestMetadata = z.infer<typeof pullRequestMetadataSchema>;
