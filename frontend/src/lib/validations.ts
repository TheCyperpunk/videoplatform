import { z } from "zod";

export const VideoSchema = z.object({
    id: z.string(),
    title: z.string(),
    thumbnail: z.string().url(),
    duration: z.string(),
    views: z.number(),
    likes: z.number(),
    publishedAt: z.string(),
    channel: z.object({
        name: z.string(),
        avatar: z.string(),
        subscribers: z.number(),
        verified: z.boolean(),
    }),
    category: z.string(),
    tags: z.array(z.string()),
    description: z.string(),
    quality: z.enum(["720p", "1080p", "4K"]),
    trending_rank: z.number().nullable(),
    source_url: z.string(),
    scraped_at: z.string(),
});

export const CategorySchema = z.object({
    id: z.string(),
    name: z.string(),
    icon: z.string(),
    color: z.string(),
    description: z.string(),
    count: z.number(),
});

export const SearchParamsSchema = z.object({
    q: z.string().min(1).optional(),
    category: z.string().optional(),
    quality: z.enum(["all", "720p", "1080p", "4K"]).optional().default("all"),
    page: z.coerce.number().min(1).optional().default(1),
    limit: z.coerce.number().min(1).max(48).optional().default(12),
});

export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
    z.object({
        data: dataSchema,
        total: z.number(),
        page: z.number(),
        limit: z.number(),
        hasMore: z.boolean(),
        error: z.string().nullable(),
    });
