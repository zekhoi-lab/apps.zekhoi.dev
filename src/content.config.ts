import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const apps = defineCollection({
  loader: glob({ pattern: "*/index.md", base: "./src/content/apps" }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      tagline: z.string(),
      description: z.string(),
      type: z.enum(["app", "game"]),
      platforms: z.array(z.enum(["android", "ios", "web"])),
      status: z.enum(["live", "beta", "coming-soon"]),
      icon: image(),
      ogImage: image().optional(),
      screenshots: z.array(image()).default([]),
      features: z
        .array(z.object({ title: z.string(), description: z.string() }))
        .default([]),
      links: z.object({
        website: z.url().optional(),
        playStore: z.url().optional(),
        appStore: z.url().optional(),
        web: z.url().optional(),
        github: z.url().optional(),
      }),
      supportEmail: z.email(),
      hasAccounts: z.boolean().default(false),
      faq: z
        .array(z.object({ question: z.string(), answer: z.string() }))
        .default([]),
      order: z.number().default(0),
    }),
});

const docs = defineCollection({
  loader: glob({
    pattern: "*/{privacy,terms,delete-account}.md",
    base: "./src/content/apps",
  }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    updatedAt: z.coerce.date(),
  }),
});

export const collections = { apps, docs };
