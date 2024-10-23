import { z } from 'zod';
import { singleCommitMetadataSchema } from './input';
import { configTrackerTypeSchema } from './config';
const statusSchema = z.union([z.literal('success'), z.literal('failure')]);
const trackerSchema = z.object({
    exception: z.string().optional(),
    data: z
        .object({
        keyword: z.string(),
        id: z.string(),
        type: z.union([configTrackerTypeSchema, z.literal('unknown')]),
        url: z.string().optional(),
    })
        .optional(),
});
export const upstreamDataSchema = z.object({
    sha: z.string(),
    repo: z.string(),
    url: z.string(),
});
const upstreamSchema = z.object({
    status: statusSchema,
    exception: z.string().optional(),
    data: z.array(upstreamDataSchema),
});
const validatedCommitSchema = z.object({
    status: statusSchema,
    message: z.string(),
    tracker: z
        .object({
        status: statusSchema,
        message: z.string(),
        data: z.array(trackerSchema),
    })
        .optional(),
    upstream: upstreamSchema.optional(),
});
const outputCommitMetadataSchema = z.array(singleCommitMetadataSchema.extend({ validation: validatedCommitSchema }));
export const outputValidatedPullRequestMetadataSchema = z.object({
    validation: z.object({
        status: statusSchema,
        tracker: z
            .object({
            id: z.string().optional(),
            type: z.union([configTrackerTypeSchema, z.literal('unknown')]),
            url: z.string().optional(),
            message: z.string(),
            exception: z.string().optional(),
        })
            .optional(),
        message: z.string(),
    }),
    commits: outputCommitMetadataSchema,
});
//# sourceMappingURL=output.js.map