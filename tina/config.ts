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
      // 📝 BLOG POSTS - Original Collection
      // ==========================================
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
      
      // ==========================================
      // 🆕 PAGES - NEU mit Blocks/Komponenten
      // ==========================================
      {
        name: "pages",
        label: "Pages",
        path: "src/content/pages",
        format: "mdx",
        fields: [
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
          },
          
          // 🎨 BLOCKS
          {
            type: "object",
            name: "blocks",
            label: "Page Sections",
            list: true,
            templates: [

            // Template 1: Hero Section
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
              // Template 2: Feature Grid
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

              // Template 3: Content Section
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
              
              // Template 4: CTA Section
              {
                name: "cta",
                label: "Call to Action",
                fields: [
                  {
                    type: "string",
                    name: "headline",
                    label: "Headline",
                    // ✅ Auch KEIN required - beide sind jetzt optional
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
        ],
      },
    ],
  },
});