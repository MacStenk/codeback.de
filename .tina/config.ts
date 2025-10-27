import { defineConfig } from "tinacms";

const branch = process.env.HEAD || process.env.VERCEL_GIT_COMMIT_REF || "main";

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
          type: "string",  // ← String statt datetime
          name: "pubDate",
          label: "Published Date (z.B. Oct 26 2024)",
          required: true,
        },
        {
          type: "rich-text",
          name: "body",
          label: "Body",
          isBody: true,
        },
      ],
    },
  ],
}