import { defineCollection, z } from 'astro:content';

// Blog Collection (existing)
const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.object({
      src: z.string(),
      alt: z.string().optional(),
    }).optional(),
    author: z.string().optional(),
    tags: z.array(z.string()).optional(),
    draft: z.boolean().optional(),
  }),
});

// Pages Collection - LLM-native with full ecosystem integration
const pages = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    description: z.string(),

    // Author & Entity
    author: z.object({
      name: z.string(),
      url: z.string().url(),
      role: z.enum(['Developer', 'Entrepreneur', 'Writer', 'Music Enthusiast', 'Consultant']).optional(),
      bio: z.string().optional(),
    }).optional(),

    // Ecosystem Cross-References
    relatedProjects: z.array(z.object({
      name: z.string(),
      url: z.string().url(),
      description: z.string(),
      category: z.enum(['Professional', 'Product', 'Creative', 'Thought Leadership', 'Hub']),
    })).optional(),

    // SEO Basics
    metaTitle: z.string().optional(),
    metaKeywords: z.array(z.string()).optional(),
    canonicalUrl: z.string().url().optional(),

    // Open Graph / Social Media
    openGraph: z.object({
      title: z.string().optional(),
      description: z.string().optional(),
      image: z.string().optional(),
      type: z.enum(['website', 'article']).default('website'),
    }).optional(),

    // Twitter Card
    twitter: z.object({
      card: z.enum(['summary', 'summary_large_image']).default('summary_large_image'),
      title: z.string().optional(),
      description: z.string().optional(),
      image: z.string().optional(),
    }).optional(),

    // Schema.org
    schemaType: z.enum(['WebPage', 'AboutPage', 'ContactPage', 'Service', 'FAQPage', 'Article']),
    datePublished: z.coerce.date().optional(),
    dateModified: z.coerce.date().optional(),

    // LLM Optimization (THE MOST IMPORTANT!)
    llmOptimization: z.object({
      summary: z.string(),
      keyPoints: z.array(z.string()).optional(),
      context: z.string().optional(),
      entityConnections: z.string().optional(),
      citationGuidance: z.string().optional(),
    }),

    // FAQ Schema
    faqs: z.array(z.object({
      question: z.string(),
      answer: z.string(),
    })).optional(),
  }),
});

export const collections = {
  blog,
  pages,
};
