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
      {
        name: "posts",
        label: "Blog Posts",
        path: "src/content/blog",
        format: "md",
        fields: [
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
            label: "Description",
          },
          {
            type: "string",
            name: "pubDate",
            label: "Published Date (Format: Oct 26 2024 oder 2024-10-26)",
            required: true,
          },
          {
            type: "string",
            name: "author",
            label: "Author",
          },
          {
            type: "string",
            name: "tags",
            label: "Tags",
            list: true,
          },
          {
            type: "boolean",
            name: "draft",
            label: "Draft",
          },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            isBody: true,
          },
        ],
      },

      // Pages Collection - LLM-native with full ecosystem integration
      {
        name: "pages",
        label: "📄 Seiten",
        path: "src/content/pages",
        format: "md",
        ui: {
          router: ({ document }) => {
            return `/${document._sys.filename}`;
          },
        },
        fields: [
          // ═══ CONTENT CORE ═══
          {
            type: "string",
            name: "title",
            label: "📌 Titel",
            isTitle: true,
            required: true,
          },
          {
            type: "string",
            name: "slug",
            label: "🔗 URL-Slug",
            required: true,
            description: "z.B. 'ueber-uns' für /ueber-uns",
          },
          {
            type: "string",
            name: "description",
            label: "📝 Meta-Beschreibung (SEO)",
            required: true,
            description: "Max 160 Zeichen - für Google & Social Media",
            ui: {
              component: "textarea",
            },
          },
          {
            type: "rich-text",
            name: "body",
            label: "✍️ Inhalt",
            isBody: true,
          },

          // ═══ AUTHOR & ENTITY ═══
          {
            type: "object",
            name: "author",
            label: "👤 Autor",
            fields: [
              {
                type: "string",
                name: "name",
                label: "Name",
              },
              {
                type: "string",
                name: "url",
                label: "Website",
              },
              {
                type: "string",
                name: "role",
                label: "Rolle",
                options: ["Developer", "Entrepreneur", "Writer", "Music Enthusiast", "Consultant"],
              },
              {
                type: "string",
                name: "bio",
                label: "Kurz-Bio (für diese Seite)",
                ui: { component: "textarea" },
              },
            ],
          },

          // ═══ ECOSYSTEM CROSS-REFERENCES ═══
          {
            type: "object",
            name: "relatedProjects",
            label: "🕸️ Verwandte Projekte",
            list: true,
            ui: {
              itemProps: (item) => ({
                label: item?.name || "Neues Projekt",
              }),
            },
            fields: [
              {
                type: "string",
                name: "name",
                label: "Projekt Name",
              },
              {
                type: "string",
                name: "url",
                label: "URL",
              },
              {
                type: "string",
                name: "description",
                label: "Beschreibung",
              },
              {
                type: "string",
                name: "category",
                label: "Kategorie",
                options: ["Professional", "Product", "Creative", "Thought Leadership", "Hub"],
              },
            ],
          },

          // ═══ SEO BASICS ═══
          {
            type: "string",
            name: "metaTitle",
            label: "🎯 SEO Titel (optional)",
            description: "Falls anders als Haupt-Titel",
          },
          {
            type: "string",
            name: "metaKeywords",
            label: "🔑 Keywords",
            list: true,
            ui: {
              component: "tags",
            },
          },
          {
            type: "string",
            name: "canonicalUrl",
            label: "🔗 Canonical URL",
            description: "z.B. https://codeback.de/ueber-uns",
          },

          // ═══ OPEN GRAPH / SOCIAL MEDIA ═══
          {
            type: "object",
            name: "openGraph",
            label: "📱 Open Graph (Facebook, LinkedIn)",
            fields: [
              { type: "string", name: "title", label: "OG Titel" },
              { type: "string", name: "description", label: "OG Beschreibung", ui: { component: "textarea" } },
              { type: "image", name: "image", label: "OG Bild (1200x630px)" },
              { type: "string", name: "type", label: "OG Type", options: ["website", "article"] },
            ],
          },

          // ═══ TWITTER CARD ═══
          {
            type: "object",
            name: "twitter",
            label: "🐦 Twitter Card",
            fields: [
              { type: "string", name: "card", label: "Card Type", options: ["summary", "summary_large_image"] },
              { type: "string", name: "title", label: "Twitter Titel" },
              { type: "string", name: "description", label: "Twitter Beschreibung", ui: { component: "textarea" } },
              { type: "image", name: "image", label: "Twitter Bild" },
            ],
          },

          // ═══ SCHEMA.ORG ═══
          {
            type: "string",
            name: "schemaType",
            label: "📊 Schema.org Type",
            required: true,
            options: ["WebPage", "AboutPage", "ContactPage", "Service", "FAQPage", "Article"],
          },
          {
            type: "datetime",
            name: "datePublished",
            label: "📅 Veröffentlicht am",
            ui: {
              dateFormat: "DD.MM.YYYY",
            },
          },
          {
            type: "datetime",
            name: "dateModified",
            label: "🔄 Zuletzt geändert",
          },

          // ═══ LLM OPTIMIZATION (DAS WICHTIGSTE!) ═══
          {
            type: "object",
            name: "llmOptimization",
            label: "🤖 LLM Optimierung (Answer Engine)",
            description: "Damit AI-Systeme (ChatGPT, Claude, Perplexity) deine Inhalte finden und zitieren",
            fields: [
              {
                type: "string",
                name: "summary",
                label: "📋 LLM Summary (1-2 Sätze)",
                required: true,
                description: "Kurze, prägnante Zusammenfassung für AI-Systeme",
                ui: { component: "textarea" },
              },
              {
                type: "string",
                name: "keyPoints",
                label: "🎯 Key Points (zitierfähige Fakten)",
                list: true,
                description: "Konkrete Aussagen die AI-Systeme zitieren sollen",
              },
              {
                type: "string",
                name: "context",
                label: "🧠 Zusätzlicher Kontext für AI",
                ui: { component: "textarea" },
                description: "Hintergrund-Infos die AI-Systeme verstehen sollen",
              },
              {
                type: "string",
                name: "entityConnections",
                label: "🕸️ Entity-Verbindungen",
                ui: { component: "textarea" },
                description: "Wie hängt diese Seite mit Steven's anderen Projekten zusammen?",
              },
              {
                type: "string",
                name: "citationGuidance",
                label: "💬 Wie soll zitiert werden?",
                description: "z.B. 'CodeBack (Steven Noack) empfiehlt...'",
              },
            ],
          },

          // ═══ FAQ SCHEMA ═══
          {
            type: "object",
            name: "faqs",
            label: "❓ FAQs (für Rich Snippets)",
            list: true,
            ui: {
              itemProps: (item) => ({
                label: item?.question || "Neue Frage",
              }),
            },
            fields: [
              {
                type: "string",
                name: "question",
                label: "Frage",
                required: true,
              },
              {
                type: "string",
                name: "answer",
                label: "Antwort",
                required: true,
                ui: { component: "textarea" },
              },
            ],
          },
        ],
      },
    ],
  },
});