import { defineConfig } from "tinacms";

const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  "main";

export default defineConfig({
  branch,

  // Deine TinaCloud Client ID
  clientId: "c2b183f6-e2c7-495c-aee1-7cdcf967ecfa",
  token: process.env.TINA_TOKEN,

  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  
  media: {
    tina: {
      mediaRoot: "images",
      publicFolder: "public",
    },
  },
  
  schema: {
    collections: [
      // ==========================================
      // 📝 BLOG POSTS - ERWEITERT MIT LLM-FEATURES
      // ==========================================
      {
        name: "posts",
        label: "Blog Posts",
        path: "src/content/blog",
        format: "md",
        fields: [
          // === BASIC INFO ===
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true,
          },
          {
            type: "string",
            name: "description",
            label: "Meta Description (150-160 chars)",
            ui: {
              component: "textarea",
            },
            required: true,
          },
          {
            type: "string",
            name: "tldr",
            label: "TL;DR (kurze Zusammenfassung)",
            description: "Kurze Zusammenfassung für Quick Answers",
            ui: {
              component: "textarea",
            },
          },

          // === AUTHOR & DATES ===
          {
            type: "string",
            name: "author",
            label: "Author",
            options: ["Steven Noack", "Guest Author"],
          },
          {
            type: "datetime",
            name: "pubDate",
            label: "Published Date",
            required: true,
          },
          {
            type: "datetime",
            name: "lastUpdated",
            label: "Last Updated",
            description: "Zeigt Google dass Content aktuell ist",
          },

          // === CATEGORIZATION ===
          {
            type: "string",
            name: "categories",
            label: "Kategorien (Mehrfachauswahl)",
            list: true,
            options: [
              { value: "tech", label: "🔧 Tech & Development" },
              { value: "ai", label: "🤖 AI & Machine Learning" },
              { value: "privacy", label: "🔒 Privacy & Security" },
              { value: "devops", label: "🚀 DevOps & Docker" },
              { value: "tutorial", label: "📖 Tutorial" },
              { value: "jamstack", label: "⚡ JAMstack" },
              { value: "llm-seo", label: "🎯 LLM SEO" },
            ],
          },
          {
            type: "string",
            name: "tags",
            label: "Tags",
            list: true,
            description: "Spezifische Technologien/Tools, z.B. Docker, Ollama, Astro",
          },

          // === CONTENT TYPE & AUDIENCE ===
          {
            type: "string",
            name: "contentType",
            label: "Content Type",
            options: [
              "Tutorial",
              "Guide", 
              "Case Study",
              "Opinion",
              "News",
              "Documentation",
              "Review"
            ],
          },
          {
            type: "string",
            name: "level",
            label: "Difficulty Level",
            options: ["Beginner", "Intermediate", "Advanced", "Expert"],
            description: "Hilft LLMs den richtigen Kontext zu verstehen",
          },
          {
            type: "string",
            name: "audience",
            label: "Target Audience",
            description: "Wer ist die Zielgruppe? z.B. 'Coaches & Berater' oder 'Entwickler'",
          },

          // === SEO & OPEN GRAPH ===
          {
            type: "string",
            name: "canonicalUrl",
            label: "Canonical URL (optional)",
            description: "Nur wenn Content woanders original veröffentlicht wurde",
          },
          {
            type: "string",
            name: "keywords",
            label: "SEO Keywords",
            list: true,
            description: "Top 5-7 Keywords für diesen Post",
          },
          {
            type: "image",
            name: "featuredImage",
            label: "Featured Image (OG Image)",
            description: "1200x630px für Social Sharing",
          },
          {
            type: "string",
            name: "featuredImageAlt",
            label: "Featured Image Alt Text",
            description: "Beschreibung für SEO & Accessibility",
          },
          {
            type: "string",
            name: "ogTitle",
            label: "Open Graph Title (optional)",
            description: "Wenn anders als Haupt-Title gewünscht",
          },
          {
            type: "string",
            name: "ogDescription",
            label: "Open Graph Description (optional)",
            ui: {
              component: "textarea",
            },
          },

          // === SCHEMA.ORG / STRUCTURED DATA ===
          {
            type: "string",
            name: "schemaType",
            label: "Schema.org Type",
            options: [
              { value: "BlogPosting", label: "BlogPosting (Standard)" },
              { value: "Article", label: "Article (Journalistisch)" },
              { value: "HowTo", label: "HowTo (Tutorial)" },
              { value: "TechArticle", label: "TechArticle (Technical)" }
            ],
          },

          // === E-E-A-T (Google Quality Signals) ===
          {
            type: "string",
            name: "authorBio",
            label: "Author Bio (für E-E-A-T)",
            ui: {
              component: "textarea",
            },
            description: "Expertise-Nachweis des Autors",
          },
          {
            type: "string",
            name: "authorWebsite",
            label: "Author Website",
            description: "z.B. https://stevennoack.de",
          },

          // === CONTENT STRUCTURE ===
          {
            type: "string",
            name: "keyTakeaways",
            label: "Key Takeaways",
            list: true,
            description: "3-5 wichtigste Punkte - perfekt für LLM Quick Answers",
          },
          {
            type: "string",
            name: "relatedPosts",
            label: "Related Posts (Slugs)",
            list: true,
            description: "Slugs von ähnlichen Posts, z.B. 'warum-llm-optimierung'",
          },
          {
            type: "string",
            name: "series",
            label: "Series Name (optional)",
            description: "Teil einer Serie? z.B. 'JAMstack Basics'",
          },
          {
            type: "number",
            name: "seriesOrder",
            label: "Series Order",
            description: "Position in der Serie (1, 2, 3...)",
          },

          // === ADVANCED FEATURES ===
          {
            type: "boolean",
            name: "featured",
            label: "Featured Post",
            description: "Auf Homepage hervorheben?",
          },
          {
            type: "boolean",
            name: "draft",
            label: "Draft Mode",
            description: "Nicht veröffentlicht",
          },
          {
            type: "number",
            name: "readingTime",
            label: "Reading Time (minutes)",
            description: "Wird meist automatisch berechnet, kann aber überschrieben werden",
          },
          {
            type: "string",
            name: "robotsMeta",
            label: "Robots Meta Tag",
            options: [
              "index, follow",
              "noindex, follow",
              "index, nofollow", 
              "noindex, nofollow"
            ],
          },

          // === CONTENT ===
          {
            type: "rich-text",
            name: "body",
            label: "Content",
            isBody: true,
          },
        ],
      },
      
      // ==========================================
      // 🆕 PAGES - ERWEITERT MIT SEO + DEINE BLOCKS
      // ==========================================
      {
        name: "pages",
        label: "Pages",
        path: "src/content/pages",
        format: "mdx",
        fields: [
          // === BASIC INFO ===
          {
            type: "string",
            name: "title",
            label: "Page Title",
            isTitle: true,
            required: true,
          },
          {
            type: "string",
            name: "description",
            label: "Meta Description",
            ui: {
              component: "textarea",
            },
            required: true,
          },

          // === SEO META ===
          {
            type: "string",
            name: "keywords",
            label: "SEO Keywords",
            list: true,
            description: "Top Keywords für diese Page",
          },
          {
            type: "image",
            name: "ogImage",
            label: "Open Graph Image",
            description: "1200x630px für Social Sharing",
          },
          {
            type: "string",
            name: "canonicalUrl",
            label: "Canonical URL (optional)",
            description: "Nur wenn Content woanders original ist",
          },
          {
            type: "string",
            name: "robotsMeta",
            label: "Robots Meta",
            options: [
              "index, follow",
              "noindex, follow"
            ],
          },

          // === SERVICE INFO (für Schema.org) ===
          {
            type: "string",
            name: "serviceType",
            label: "Service Type",
            description: "z.B. 'LLM SEO', 'Web Development', 'Consulting'",
          },
          {
            type: "string",
            name: "targetAudience",
            label: "Target Audience",
            list: true,
            description: "z.B. ['Coaches & Berater', 'Therapeuten']",
          },
          {
            type: "string",
            name: "offerings",
            label: "Offerings / Services",
            list: true,
            description: "Was bietest du an? Wird zu Schema.org Offers",
          },
          {
            type: "string",
            name: "benefits",
            label: "Benefits / Vorteile",
            list: true,
            description: "Hauptvorteile für Kunden",
          },

          // === LOCATION ===
          {
            type: "string",
            name: "areaServed",
            label: "Area Served",
            list: true,
            options: [
              { value: "Deutschland", label: "Deutschland" },
              { value: "DACH", label: "DACH" },
              { value: "Europa", label: "Europa" },
              { value: "Weltweit", label: "Weltweit" },
            ],
          },

          // === SCHEMA.ORG TYPE ===
          {
            type: "string",
            name: "schemaType",
            label: "Schema.org Type",
            options: [
              { value: "WebPage", label: "WebPage (Standard)" },
              { value: "Service", label: "Service (Dienstleistung)" },
              { value: "Product", label: "Product (Produkt)" },
              { value: "Organization", label: "Organization" },
            ],
          },

          // === GLOBAL CTA (optional) ===
          {
            type: "string",
            name: "ctaText",
            label: "Global CTA Button Text",
            description: "z.B. 'Jetzt starten' (optional, für Fallback)",
          },
          {
            type: "string",
            name: "ctaLink",
            label: "Global CTA Link",
            description: "z.B. '/llm-checker' (optional)",
          },
          
          // === PAGE BLOCKS (DEINE SECTIONS!) ===
          {
            type: "object",
            name: "blocks",
            label: "Page Sections",
            list: true,
            templates: [

              // ========================================
              // TEMPLATE 1: HERO SECTION (DEINE VERSION)
              // ========================================
              {
                name: "hero",
                label: "Hero Section",
                fields: [
                  {
                    type: "string",
                    name: "badge",
                    label: "Badge Text (z.B. 'Der Code ist zurück')",
                  },
                  {
                    type: "string",
                    name: "headline",
                    label: "Hauptüberschrift",
                  },
                  {
                    type: "string",
                    name: "highlightedText",
                    label: "Hervorgehobener Text (grün, 2. Zeile)",
                  },
                  {
                    type: "string",
                    name: "description",
                    label: "Beschreibungstext",
                    ui: {
                      component: "textarea",
                    },
                  },
                  {
                    type: "string",
                    name: "primaryButtonText",
                    label: "Primärer Button Text",
                    required: true,
                  },
                  {
                    type: "string",
                    name: "primaryButtonLink",
                    label: "Primärer Button Link",
                    required: true,
                  },
                  {
                    type: "string",
                    name: "secondaryButtonText",
                    label: "Sekundärer Button Text (optional)",
                  },
                  {
                    type: "string",
                    name: "secondaryButtonLink",
                    label: "Sekundärer Button Link (optional)",
                  },
                  {
                    type: "string",
                    name: "trustBadgeIcon",
                    label: "Trust Badge Icon (z.B. ⚡)",
                  },
                  {
                    type: "string",
                    name: "trustBadgeText",
                    label: "Trust Badge Text",
                    ui: {
                      component: "textarea",
                    },
                  },
                ],
              },

              // ========================================
              // TEMPLATE 2: FEATURES GRID (DEINE VERSION)
              // ========================================
              {
                name: "features",
                label: "Feature Grid",
                fields: [
                  {
                    type: "string",
                    name: "title",
                    label: "Section Title",
                  },
                  {
                    type: "object",
                    name: "items",
                    label: "Features",
                    list: true,
                    fields: [
                      {
                        type: "string",
                        name: "icon",
                        label: "Icon Name (z.B. shield, rocket, lock)",
                      },
                      {
                        type: "string",
                        name: "title",
                        label: "Feature Title",
                      },
                      {
                        type: "string",
                        name: "description",
                        label: "Description",
                        ui: {
                          component: "textarea",
                        },
                      },
                    ],
                  },
                ],
              },

              // ========================================
              // TEMPLATE 3: CONTENT SECTION (DEINE VERSION)
              // ========================================
              {
                name: "content",
                label: "Content Section",
                fields: [
                  {
                    type: "rich-text",
                    name: "body",
                    label: "Content",
                  },
                ],
              },
              
              // ========================================
              // TEMPLATE 4: CTA SECTION (DEINE VERSION)
              // ========================================
              {
                name: "cta",
                label: "Call to Action",
                fields: [
                  {
                    type: "string",
                    name: "headline",
                    label: "Headline",
                  },
                  {
                    type: "string",
                    name: "description",
                    label: "Description",
                    ui: {
                      component: "textarea",
                    },
                  },
                  {
                    type: "string",
                    name: "buttonText",
                    label: "Button Text",
                  },
                  {
                    type: "string",
                    name: "buttonLink",
                    label: "Button Link",
                  },
                ],
              },
              
            ],
          },

          // === OPTIONAL BODY (zusätzlicher Content) ===
          {
            type: "rich-text",
            name: "body",
            label: "Additional Content (optional)",
            description: "Zusätzlicher Content außerhalb der Blocks",
            isBody: true,
          },
        ],
      },
    ],
  },
});