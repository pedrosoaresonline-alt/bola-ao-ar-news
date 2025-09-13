import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    excerpt: z.string().max(280),
    cover: z.string().optional(),
    author: z.string().default('Redação'),
    tags: z.array(z.string()).default([]),
    date: z.string(),            // ISO yyyy-mm-dd
    draft: z.boolean().default(false),
  })
});

// export const collections = { posts };

const newsPosts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    excerpt: z.string().max(500),
    cover: z.string().optional(),
    author: z.string().default('Redação'),
    tags: z.array(z.string()).default([]),
    date: z.string(),                 // ISO
    source: z.string(),               // ex.: Google News
    source_url: z.string().url(),     // link original
    guid: z.string().optional(),      // id/sha para dedupe
    draft: z.boolean().default(false)
  })
});

// If you want to export both collections, you can do:
export const collections = { posts, newsPosts };
