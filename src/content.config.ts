import { defineCollection, z } from 'astro:content';

// Legal Pages Collection (Impressum, Datenschutz)
const legalCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    lastUpdated: z.date(),
    noindex: z.boolean().default(true),
  }),
});

export const collections = {
  'legal': legalCollection,
};