import { z, defineCollection } from 'astro:content';

// ═══════════════════════════════════════════════════════════════
// BLOG COLLECTION SCHEMA
// ═══════════════════════════════════════════════════════════════

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    // ═══ BASIC FIELDS ═══
    title: z.string(),
    description: z.string().optional(),
    pubDate: z.string(),
    updatedDate: z.string().optional(),
    heroImage: z.string().optional(),
    tags: z.array(z.string()).optional(),
    draft: z.boolean().optional(),

    // ═══ AUTOR INFORMATION ═══
    author: z.object({
      name: z.string().default("Steven Noack"),
      url: z.string().url().default("https://stevennoack.de"),
      bio: z.string().optional(),
    }).optional(),

    // ═══ KATEGORISIERUNG ═══
    category: z.enum([
      "Tutorial",
      "Case Study",
      "Opinion",
      "News",
      "Deep Dive",
      "How-To",
      "Best Practices"
    ]).optional(),

    series: z.string().optional(),
    readingTime: z.number().optional(),

    // ═══ LLM OPTIMIZATION ═══
    llmOptimization: z.object({
      summary: z.string(),
      keyPoints: z.array(z.string()).optional(),
      context: z.string().optional(),
      entityConnections: z.string().optional(),
      citationGuidance: z.string().optional(),
    }).optional(),

    // ═══ ECOSYSTEM CROSS-REFERENCES ═══
    relatedProjects: z.array(z.object({
      name: z.enum([
        "Steven Noack",
        "Privacy AI OS",
        "VisionFusen",
        "QuantenBeatz",
        "SOG Transformation"
      ]).optional(),
      url: z.string().url().optional(),
      description: z.string().optional(),
      category: z.enum([
        "Professional",
        "Product",
        "Creative",
        "Thought Leadership",
        "Hub"
      ]).optional(),
    })).optional(),

    // ═══ ERWEITERTE SEO ═══
    metaKeywords: z.array(z.string()).optional(),
    canonicalUrl: z.string().url().optional(),

    // ═══ OPEN GRAPH (Facebook, LinkedIn) ═══
    openGraph: z.object({
      title: z.string().optional(),
      description: z.string().optional(),
      image: z.string().optional(),
      type: z.enum(["article", "website"]).default("article"),
    }).optional(),

    // ═══ TWITTER CARD ═══
    twitter: z.object({
      card: z.enum(["summary", "summary_large_image"]).default("summary_large_image"),
      title: z.string().optional(),
      description: z.string().optional(),
      image: z.string().optional(),
    }).optional(),

    // ═══ SCHEMA.ORG TYPE ═══
    schemaType: z.enum([
      "Article",
      "BlogPosting",
      "TechArticle",
      "HowTo"
    ]).default("BlogPosting"),

    // ═══ FAQ SCHEMA (Rich Snippets) ═══
    faqs: z.array(z.object({
      question: z.string(),
      answer: z.string(),
    })).optional(),
  }),
});

// ═══════════════════════════════════════════════════════════════
// HOMEPAGE COLLECTION SCHEMA (JSON-based, TinaCMS managed)
// ═══════════════════════════════════════════════════════════════

const homepageCollection = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    blocks: z.array(z.any()), // TinaCMS managed, flexible schema
  }),
});

// ═══════════════════════════════════════════════════════════════
// PAGES COLLECTION SCHEMA
// ═══════════════════════════════════════════════════════════════

const pagesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    // ═══ CONTENT CORE ═══
    title: z.string(),
    slug: z.string(),
    description: z.string(),

    // ═══ AUTHOR & ENTITY ═══
    author: z.object({
      name: z.string().default("Steven Noack"),
      url: z.string().url().default("https://stevennoack.de"),
      role: z.enum([
        "Developer",
        "Entrepreneur",
        "Writer",
        "Music Enthusiast",
        "Consultant"
      ]).optional(),
      bio: z.string().optional(),
    }).optional(),

    // ═══ ECOSYSTEM CROSS-REFERENCES ═══
    relatedProjects: z.array(z.object({
      name: z.enum([
        "Steven Noack",
        "Privacy AI OS",
        "VisionFusen",
        "QuantenBeatz",
        "SOG Transformation"
      ]).optional(),
      url: z.string().url().optional(),
      description: z.string().optional(),
      category: z.enum([
        "Professional",
        "Product",
        "Creative",
        "Thought Leadership",
        "Hub"
      ]).optional(),
    })).optional(),

    // ═══ SEO BASICS ═══
    metaTitle: z.string().optional(),
    metaKeywords: z.array(z.string()).optional(),
    canonicalUrl: z.string().url().optional(),

    // ═══ OPEN GRAPH / SOCIAL MEDIA ═══
    openGraph: z.object({
      title: z.string().optional(),
      description: z.string().optional(),
      image: z.string().optional(),
      type: z.enum(["website", "article"]).default("website"),
    }).optional(),

    // ═══ TWITTER CARD ═══
    twitter: z.object({
      card: z.enum(["summary", "summary_large_image"]).default("summary_large_image"),
      title: z.string().optional(),
      description: z.string().optional(),
      image: z.string().optional(),
    }).optional(),

    // ═══ SCHEMA.ORG ═══
    schemaType: z.enum([
      "WebPage",
      "AboutPage",
      "ContactPage",
      "Service",
      "FAQPage",
      "Article"
    ]).default("WebPage"),
    datePublished: z.string().optional(),
    dateModified: z.string().optional(),

    // ═══ LLM OPTIMIZATION ═══
    llmOptimization: z.object({
      summary: z.string(),
      keyPoints: z.array(z.string()).optional(),
      context: z.string().optional(),
      entityConnections: z.string().optional(),
      citationGuidance: z.string().optional(),
    }).optional(),

    // ═══ FAQ SCHEMA ═══
    faqs: z.array(z.object({
      question: z.string(),
      answer: z.string(),
    })).optional(),
  }),
});

// ═══════════════════════════════════════════════════════════════
// EXPORT COLLECTIONS
// ═══════════════════════════════════════════════════════════════

export const collections = {
  'blog': blogCollection,
  'pages': pagesCollection,
  'homepage': homepageCollection,
};