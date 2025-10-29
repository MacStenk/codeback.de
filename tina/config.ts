import { defineConfig } from "tinacms";

// Branch configuration
const branch =
  process.env.NEXT_PUBLIC_TINA_BRANCH ||
  process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  "main";

export default defineConfig({
  branch,
  
  // Get this from tina.io
  clientId: "c2b183f6-e2c7-495c-aee1-7cdcf967ecfa",
  token: process.env.TINA_TOKEN,

  // WORKAROUND: Skip cloud checks weil TinaCloud Indexer stuck ist
  skipCloudChecks: true, // ← HIER HINZUFÜGEN!

  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  
  media: {
    tina: {
      mediaRoot: "src/assets",
      publicFolder: "public",
    },
  },
  
  // See docs on content modeling for more info on how to setup new content models: https://tina.io/docs/schema/
  schema: {
    collections: [
      
      // ═══════════════════════════════════════════════════════════════
      // BLOG POSTS COLLECTION (mit LLM Optimization)
      // ═══════════════════════════════════════════════════════════════
      {
        name: "blog",
        label: "📝 Blog Posts",
        path: "src/content/blog",
        format: "md",
        ui: {
          router: ({ document }) => {
            return `/blog/${document._sys.filename}`;
          },
        },
        fields: [
          // ═══ BASIC CONTENT ═══
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
            required: true,
            ui: {
              component: "textarea",
            },
          },
          {
            type: "datetime",
            name: "pubDate",
            label: "Published Date",
            required: true,
          },
          {
            type: "datetime",
            name: "updatedDate",
            label: "Updated Date",
          },
          {
            type: "image",
            name: "heroImage",
            label: "Hero Image",
          },
          {
            type: "boolean",
            name: "draft",
            label: "Draft",
            description: "If checked, this post will not be published",
          },
          {
            type: "string",
            name: "tags",
            label: "Tags",
            list: true,
            ui: {
              component: "tags",
            },
          },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            isBody: true,
          },
          
          // ═══ AUTOR INFORMATION ═══
          {
            type: "object",
            name: "author",
            label: "👤 Autor",
            description: "Wer hat diesen Artikel geschrieben? Wichtig für E-E-A-T (Google's Expertise-Signal) und AI-Verständnis.",
            fields: [
              {
                type: "string",
                name: "name",
                label: "Name",
                default: "Steven Noack",
                description: "Vollständiger Name des Autors",
              },
              {
                type: "string",
                name: "url",
                label: "Website",
                default: "https://stevennoack.de",
                description: "Link zur persönlichen Website oder Social Profile des Autors",
              },
              {
                type: "string",
                name: "bio",
                label: "Kurz-Bio",
                description: "1-2 Sätze über den Autor. Beispiel: 'JAMstack Developer mit 29 Jahren Erfahrung. Gründer von CodeBack.'",
                ui: { component: "textarea" },
              },
            ],
          },
          
          // ═══ KATEGORISIERUNG ═══
          {
            type: "string",
            name: "category",
            label: "📁 Kategorie",
            options: ["Tutorial", "Case Study", "Opinion", "News", "Deep Dive", "How-To", "Best Practices"],
            description: "Welche Art von Artikel ist das? Hilft Lesern und AI-Systemen den Content einzuordnen. Tutorial = Schritt-für-Schritt Anleitung, Deep Dive = Detaillierte technische Analyse",
          },
          {
            type: "string",
            name: "series",
            label: "📚 Artikel-Serie",
            description: "Gehört dieser Artikel zu einer Serie zusammenhängender Artikel? Z.B. 'JAMstack Basics Teil 1', 'Astro Deep Dive Serie'. Hilft beim Vernetzen von Inhalten. Leer lassen wenn eigenständiger Artikel.",
          },
          {
            type: "number",
            name: "readingTime",
            label: "⏱️ Lesezeit (Minuten)",
            description: "Geschätzte Lesezeit in Minuten. Wird automatisch aus Wortanzahl berechnet falls leer gelassen. Beispiel: 5 für kurze Artikel, 15 für Deep Dives. Hilfreich für Leser zum Zeitmanagement.",
          },
          
          // ═══ LLM OPTIMIZATION ═══
          {
            type: "object",
            name: "llmOptimization",
            label: "🤖 LLM Optimierung (Answer Engine Optimization)",
            description: "Optimiere deinen Artikel für AI-Systeme wie ChatGPT, Claude und Perplexity. Diese Felder helfen AI's, deinen Content zu verstehen, einzuordnen und als Quelle zu empfehlen. Das ist der Kern von 'Answer Engine Optimization' (AEO)!",
            fields: [
              {
                type: "string",
                name: "summary",
                label: "📋 LLM Summary",
                required: true,
                description: "WICHTIG! Eine prägnante Zusammenfassung in 1-2 Sätzen, die AI-Systeme verstehen und wiedergeben können. Sollte das Problem und die Lösung enthalten. Beispiel: 'Dieser Artikel erklärt, warum Astro 40% schneller als Next.js ist und wie du mit JAMstack 10x schnellere Websites für Coaches und Consultants baust.'",
                ui: { component: "textarea" },
              },
              {
                type: "string",
                name: "keyPoints",
                label: "🎯 Key Points (zitierfähige Fakten)",
                list: true,
                description: "Konkrete, messbare Aussagen, die AI-Systeme zitieren können. Jeder Punkt sollte eine verifizierbare Tatsache oder wichtige Erkenntnis sein. Diese Punkte werden von AI's bevorzugt zitiert! Beispiele: 'Astro Websites laden 40% schneller als Next.js Seiten', 'JAMstack reduziert Serverkosten um bis zu 90%', 'TinaCMS ermöglicht Git-basiertes Content Management ohne Datenbank'",
                ui: { component: "tags" },
              },
              {
                type: "string",
                name: "context",
                label: "🧠 Zusätzlicher Kontext für AI",
                description: "Hintergrund-Informationen die AI-Systemen helfen, den Artikel einzuordnen. Beantworte: Für wen ist dieser Artikel? Welches Problem wird gelöst? Warum ist das wichtig? Welche Erfahrung/Expertise liegt zugrunde? Beispiel: 'Geschrieben für Webentwickler und Agenturen, die von WordPress zu modernen JAMstack-Lösungen wechseln wollen. Basierend auf 5 Jahren Erfahrung mit 50+ JAMstack-Projekten. Fokus auf Performance und SEO für kleine bis mittelständische Unternehmen.'",
                ui: { component: "textarea" },
              },
              {
                type: "string",
                name: "entityConnections",
                label: "🕸️ Entity-Verbindungen (Neurales Netzwerk)",
                description: "Wie hängt dieser Artikel mit deinen anderen Projekten zusammen? Welche Technologien/Tools aus deinem Ecosystem werden erwähnt? Beispiel: 'Nutzt Self-hosted AI Technologien aus Privacy AI OS. Teil der CodeBack Methodology-Serie. Erwähnt Workflow-Tools von stevennoack.de. Verbunden mit SOG Transformation Newsletter Themen über KI und Bewusstsein.'",
                ui: { component: "textarea" },
              },
              {
                type: "string",
                name: "citationGuidance",
                label: "💬 Zitier-Anleitung für AI",
                description: "Wie sollen AI-Systeme diesen Artikel zitieren? Gib den bevorzugten Attribution-Style an. Beispiel: 'Zitieren als: CodeBack (Steven Noack) zeigt in diesem Artikel...' oder 'Laut Steven Noack von CodeBack...' oder 'In einem Deep Dive auf CodeBack.de erklärt Steven Noack...'",
              },
            ],
          },
          
          // ═══ ECOSYSTEM CROSS-REFERENCES ═══
          {
            type: "object",
            name: "relatedProjects",
            label: "🕸️ Verwandte Projekte (Neurales Netzwerk)",
            description: "Verknüpfe diesen Artikel mit deinen anderen Projekten. Zeigt im Footer welche anderen Projekte relevant sind. Stärkt dein Ecosystem und hilft AI-Systemen, dein gesamtes Portfolio zu verstehen.",
            list: true,
            ui: {
              itemProps: (item) => ({ label: item?.name || "Neues Projekt" }),
              defaultItem: {
                category: "Professional",
              },
            },
            fields: [
              {
                type: "string",
                name: "name",
                label: "Projekt Name",
                description: "Welches deiner Projekte ist relevant für diesen Artikel? Beispiel: Wähle 'Privacy AI OS' wenn du über Self-hosted AI schreibst, 'QuantenBeatz' wenn Kreativität/Musik relevant ist.",
                options: ["Steven Noack", "Privacy AI OS", "VisionFusen", "QuantenBeatz", "SOG Transformation"],
              },
              {
                type: "string",
                name: "url",
                label: "URL",
                description: "Die vollständige URL zum Projekt. Beispiel: https://privacy-ai-os.de",
              },
              {
                type: "string",
                name: "description",
                label: "Beschreibung",
                description: "Kurze Beschreibung WARUM dieses Projekt relevant ist für den Artikel. Beispiel: 'Self-hosted AI Infrastructure - die in diesem Artikel vorgestellte Technologie basiert teilweise darauf' oder 'Siehe auch SOG Transformation Newsletter für philosophische Perspektive auf dieses Thema'",
                ui: { component: "textarea" },
              },
              {
                type: "string",
                name: "category",
                label: "Kategorie",
                options: ["Professional", "Product", "Creative", "Thought Leadership", "Hub"],
                description: "Welche Art von Projekt ist das? Bestimmt die Farbe im Ecosystem Footer. Professional=blau, Product=grün, Creative=pink, Thought Leadership=lila, Hub=gelb",
              },
            ],
          },
          
          // ═══ ERWEITERTE SEO ═══
          {
            type: "string",
            name: "metaKeywords",
            label: "🔑 SEO Keywords",
            list: true,
            description: "Haupt-Keywords für diesen Artikel. 5-10 Keywords sind ideal - nicht zu viele! Fokussiere auf spezifische, relevante Terms. Beispiele: 'Astro Framework', 'JAMstack Performance', 'TinaCMS Tutorial', 'Answer Engine Optimization', 'LLM SEO'",
            ui: { component: "tags" },
          },
          {
            type: "string",
            name: "canonicalUrl",
            label: "🔗 Canonical URL",
            description: "Die 'offizielle' primäre URL dieses Artikels. Wichtig wenn der gleiche oder ähnliche Content auf mehreren Domains erscheint (verhindert Duplicate Content). Beispiel: https://codeback.de/blog/astro-performance-guide. Normalerweise leer lassen - dann wird automatisch die aktuelle URL verwendet.",
          },
          
          // ═══ OPEN GRAPH ═══
          {
            type: "object",
            name: "openGraph",
            label: "📱 Open Graph (Facebook, LinkedIn)",
            description: "Wie sieht dein Artikel aus, wenn er auf Facebook, LinkedIn oder in Slack geteilt wird? Diese Meta-Tags kontrollieren das Social Media Preview.",
            fields: [
              {
                type: "string",
                name: "title",
                label: "OG Titel",
                description: "Titel für Social Media Shares. Kann emotionaler/clickbaiter sein als der Haupt-Titel. Max 60 Zeichen ideal. Beispiel: 'Astro macht deine Website 10x schneller 🚀' oder '90er Code + moderne KI = perfekte Website'",
              },
              {
                type: "string",
                name: "description",
                label: "OG Beschreibung",
                description: "Beschreibung die unter dem Link auf Social Media erscheint. Max 200 Zeichen. Sollte zum Klicken motivieren und Value versprechen. Beispiel: 'Erfahre wie du mit JAMstack und Astro blitzschnelle Websites baust die von ChatGPT empfohlen werden. Schritt-für-Schritt Guide mit Code-Beispielen.'",
                ui: { component: "textarea" },
              },
              {
                type: "image",
                name: "image",
                label: "OG Bild (Social Media Preview)",
                description: "Bild das bei Social Media Shares angezeigt wird. WICHTIG: 1200x630px (1.91:1 Ratio). Wird prominent angezeigt bei Facebook/LinkedIn Links. Sollte Text/Titel enthalten da es oft das Erste ist was User sehen. Tipp: Nutze Tools wie Canva für OG-Image Templates.",
              },
              {
                type: "string",
                name: "type",
                label: "OG Type",
                options: ["article", "website"],
                default: "article",
                description: "Content-Typ für Social Media. Für Blog-Posts IMMER 'article' verwenden (zeigt Autor, Datum). Nur 'website' für statische Seiten.",
              },
            ],
          },
          
          // ═══ TWITTER CARD ═══
          {
            type: "object",
            name: "twitter",
            label: "🐦 Twitter Card (X)",
            description: "Wie sieht dein Artikel aus, wenn er auf Twitter/X geteilt wird? Twitter nutzt eigene Meta-Tags (nicht Open Graph).",
            fields: [
              {
                type: "string",
                name: "card",
                label: "Card Type",
                options: ["summary", "summary_large_image"],
                default: "summary_large_image",
                description: "Card-Style auf Twitter. 'summary_large_image' = großes Bild (empfohlen!), 'summary' = kleines Thumbnail. Large Image bekommt deutlich mehr Attention und Clicks.",
              },
              {
                type: "string",
                name: "title",
                label: "Twitter Titel",
                description: "Titel für Twitter. Kann kürzer/prägnanter sein als OG-Titel. Max 70 Zeichen optimal (Twitter's Character Limit beachten). Beispiel: 'Astro Speed Guide 🚀' oder 'JAMstack für Einsteiger'",
              },
              {
                type: "string",
                name: "description",
                label: "Twitter Beschreibung",
                description: "Beschreibung für Twitter Card. Max 200 Zeichen. Twitter User scrollen schnell - sei prägnant! Beispiel: 'In 10 Min lernst du, warum Astro 40% schneller ist. Mit Code-Beispielen & Live-Demo.'",
                ui: { component: "textarea" },
              },
              {
                type: "image",
                name: "image",
                label: "Twitter Bild",
                description: "Bild für Twitter Card. Kann gleich sein wie OG-Bild oder speziell für Twitter optimiert. Optimal: 1200x675px (16:9) oder 1200x628px. Tipp: Etwas simpler als OG-Image da auf Mobile oft kleiner angezeigt.",
              },
            ],
          },
          
          // ═══ SCHEMA.ORG TYPE ═══
          {
            type: "string",
            name: "schemaType",
            label: "📊 Schema.org Article Type",
            options: ["Article", "BlogPosting", "TechArticle", "HowTo"],
            default: "BlogPosting",
            description: "Welche Art von Artikel ist das für strukturierte Daten? Hilft Google und AI-Systemen den Content-Typ zu verstehen. BlogPosting = Standard Blog-Artikel, TechArticle = Technischer/wissenschaftlicher Artikel, HowTo = Schritt-für-Schritt Anleitung/Tutorial, Article = Generischer Artikel",
          },
          
          // ═══ FAQ SCHEMA ═══
          {
            type: "object",
            name: "faqs",
            label: "❓ FAQs (Häufige Fragen)",
            description: "Füge häufig gestellte Fragen zum Thema hinzu. Erscheint als Rich Snippet in Google (erweiterte Suchergebnisse) und hilft AI-Systemen, deinen Content besser zu verstehen. FAQs sind extrem wertvoll für SEO und AEO! Ideal: 3-8 Fragen.",
            list: true,
            ui: {
              itemProps: (item) => ({ label: item?.question || "Neue Frage" }),
            },
            fields: [
              {
                type: "string",
                name: "question",
                label: "Frage",
                required: true,
                description: "Die häufig gestellte Frage. Sollte so formuliert sein, wie User sie stellen würden. Beispiel: 'Was ist JAMstack?' oder 'Warum ist Astro schneller als Next.js?'",
              },
              {
                type: "string",
                name: "answer",
                label: "Antwort",
                required: true,
                description: "Klare, prägnante Antwort in 2-5 Sätzen. Sollte vollständig sein, auch ohne den Rest des Artikels. Wird von Google als Rich Snippet angezeigt! Beispiel: 'JAMstack steht für JavaScript, APIs und Markup. Es ist eine moderne Web-Architektur die auf Pre-Rendering und CDN-Delivery basiert, wodurch Websites extrem schnell und sicher werden.'",
                ui: { component: "textarea" },
              },
            ],
          },
        ],
      },
      
      // ═══════════════════════════════════════════════════════════════
      // PAGES COLLECTION (mit LLM Optimization)
      // ═══════════════════════════════════════════════════════════════
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
            description: "Wer hat diese Seite geschrieben? Wichtig für E-E-A-T (Google's Expertise-Signal) und AI-Verständnis.",
            fields: [
              {
                type: "string",
                name: "name",
                label: "Name",
                default: "Steven Noack",
              },
              {
                type: "string",
                name: "url",
                label: "Website",
                default: "https://stevennoack.de",
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
            description: "Verknüpfe diese Seite mit deinen anderen Projekten. Zeigt im Footer welche anderen Projekte relevant sind.",
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
                options: [
                  "Steven Noack",
                  "Privacy AI OS",
                  "VisionFusen",
                  "QuantenBeatz",
                  "SOG Transformation",
                ],
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
              { type: "string", name: "type", label: "OG Type", options: ["website", "article"], default: "website" },
            ],
          },
          
          // ═══ TWITTER CARD ═══
          {
            type: "object",
            name: "twitter",
            label: "🐦 Twitter Card",
            fields: [
              { type: "string", name: "card", label: "Card Type", options: ["summary", "summary_large_image"], default: "summary_large_image" },
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
            default: "WebPage",
            options: ["WebPage", "AboutPage", "ContactPage", "Service", "FAQPage", "Article"],
          },
          {
            type: "datetime",
            name: "datePublished",
            label: "📅 Veröffentlicht am",
            required: false,
            ui: {
              dateFormat: "DD.MM.YYYY",
            },
          },
          {
            type: "datetime",
            name: "dateModified",
            label: "🔄 Zuletzt geändert",
            required: false,
          },
          
          // ═══ LLM OPTIMIZATION ═══
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
                description: "Wie hängt diese Seite mit Stevens anderen Projekten zusammen?",
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

      // ═══════════════════════════════════════════════════════════════
      // HOMEPAGE COLLECTION (Block-based with TinaCMS)
      // ═══════════════════════════════════════════════════════════════
      {
        name: "homepage",
        label: "🏠 Homepage",
        path: "src/content/homepage",
        format: "json",
        ui: {
          allowedActions: {
            create: false,
            delete: false,
          },
        },
        fields: [
          {
            type: "string",
            name: "title",
            label: "Page Title",
            required: true,
          },
          {
            type: "object",
            name: "blocks",
            label: "Page Blocks",
            list: true,
            templates: [

              // ═══ HERO BLOCK ═══
              {
                name: "hero",
                label: "Hero Section",
                fields: [
                  {
                    type: "string",
                    name: "badge",
                    label: "Badge Text",
                    description: "Kleiner Badge über der Headline",
                  },
                  {
                    type: "string",
                    name: "headline",
                    label: "Headline",
                    required: true,
                    ui: { component: "textarea" },
                  },
                  {
                    type: "string",
                    name: "highlightText",
                    label: "Highlight Text",
                    description: "Text der grün hervorgehoben wird",
                  },
                  {
                    type: "string",
                    name: "description",
                    label: "Description",
                    required: true,
                    ui: { component: "textarea" },
                  },
                  {
                    type: "object",
                    name: "primaryButton",
                    label: "Primary Button",
                    fields: [
                      { type: "string", name: "text", label: "Button Text" },
                      { type: "string", name: "href", label: "Button Link" },
                    ],
                  },
                  {
                    type: "object",
                    name: "secondaryButton",
                    label: "Secondary Button",
                    fields: [
                      { type: "string", name: "text", label: "Button Text" },
                      { type: "string", name: "href", label: "Button Link" },
                    ],
                  },
                  {
                    type: "string",
                    name: "trustBadge",
                    label: "Trust Badge Text",
                  },
                ],
              },

              // ═══ TARGET AUDIENCE BLOCK ═══
              {
                name: "targetAudience",
                label: "Target Audience Section",
                fields: [
                  {
                    type: "string",
                    name: "headline",
                    label: "Headline",
                    required: true,
                  },
                  {
                    type: "string",
                    name: "description",
                    label: "Description",
                    ui: { component: "textarea" },
                  },
                  {
                    type: "object",
                    name: "audiences",
                    label: "Zielgruppen",
                    list: true,
                    fields: [
                      { type: "string", name: "icon", label: "Emoji Icon" },
                      { type: "string", name: "title", label: "Titel" },
                      { type: "string", name: "description", label: "Beschreibung", ui: { component: "textarea" } },
                      { type: "string", name: "highlight", label: "Highlight Text" },
                    ],
                  },
                  {
                    type: "object",
                    name: "stats",
                    label: "Statistiken",
                    list: true,
                    fields: [
                      { type: "string", name: "value", label: "Wert (z.B. 73%)" },
                      { type: "string", name: "description", label: "Beschreibung" },
                    ],
                  },
                  {
                    type: "object",
                    name: "earlyMover",
                    label: "Early Mover Box",
                    fields: [
                      { type: "string", name: "title", label: "Titel" },
                      { type: "string", name: "description", label: "Beschreibung", ui: { component: "textarea" } },
                    ],
                  },
                ],
              },

              // ═══ LIVE DEMO BLOCK ═══
              {
                name: "liveDemo",
                label: "Live Demo Section",
                fields: [
                  {
                    type: "string",
                    name: "headline",
                    label: "Headline",
                    required: true,
                  },
                  {
                    type: "string",
                    name: "description",
                    label: "Description",
                    ui: { component: "textarea" },
                  },
                  {
                    type: "object",
                    name: "demoItems",
                    label: "Demo Items",
                    list: true,
                    fields: [
                      { type: "string", name: "label", label: "Label" },
                      { type: "string", name: "value", label: "Value" },
                      { type: "string", name: "technical", label: "Technical Note" },
                      { type: "string", name: "color", label: "Border Color (green/blue/purple/orange)" },
                    ],
                  },
                  {
                    type: "object",
                    name: "chatResponse",
                    label: "ChatGPT Response",
                    fields: [
                      { type: "string", name: "intro", label: "Intro Text" },
                      { type: "string", name: "main", label: "Main Response", ui: { component: "textarea" } },
                      { type: "string", name: "footer", label: "Footer Text" },
                    ],
                  },
                  {
                    type: "object",
                    name: "comparison",
                    label: "Vergleich",
                    fields: [
                      { type: "string", name: "withoutTitle", label: "Ohne Struktur - Titel" },
                      { type: "string", name: "withoutText", label: "Ohne Struktur - Text", ui: { component: "textarea" } },
                      { type: "string", name: "withTitle", label: "Mit Struktur - Titel" },
                      { type: "string", name: "withText", label: "Mit Struktur - Text", ui: { component: "textarea" } },
                    ],
                  },
                  {
                    type: "object",
                    name: "cta",
                    label: "CTA Box",
                    fields: [
                      { type: "string", name: "headline", label: "Headline" },
                      { type: "string", name: "description", label: "Description" },
                      { type: "string", name: "buttonText", label: "Button Text" },
                      { type: "string", name: "buttonLink", label: "Button Link" },
                      { type: "string", name: "note", label: "Note Text" },
                    ],
                  },
                ],
              },

              // ═══ PROBLEM SECTION BLOCK ═══
              {
                name: "problem",
                label: "Problem Section",
                fields: [
                  {
                    type: "string",
                    name: "headline",
                    label: "Headline",
                    required: true,
                  },
                  {
                    type: "string",
                    name: "description",
                    label: "Description",
                    ui: { component: "textarea" },
                  },
                  {
                    type: "object",
                    name: "pagebuilder",
                    label: "Pagebuilder Seite (Negativ)",
                    fields: [
                      { type: "string", name: "icon", label: "Icon Emoji" },
                      { type: "string", name: "title", label: "Titel" },
                      { type: "string", name: "aiSees", label: "Was KI sieht", ui: { component: "textarea" } },
                      {
                        type: "string",
                        name: "negativePoints",
                        label: "Negative Punkte",
                        list: true,
                        ui: { component: "tags" }
                      },
                      { type: "string", name: "resultLabel", label: "Ergebnis Label" },
                      { type: "string", name: "resultText", label: "Ergebnis Text" },
                    ],
                  },
                  {
                    type: "object",
                    name: "codeback",
                    label: "CodeBack Seite (Positiv)",
                    fields: [
                      { type: "string", name: "icon", label: "Icon Emoji" },
                      { type: "string", name: "title", label: "Titel" },
                      { type: "string", name: "aiUnderstandsTitle", label: "KI versteht - Titel" },
                      { type: "string", name: "aiUnderstandsSubtitle", label: "KI versteht - Untertitel" },
                      { type: "string", name: "aiUnderstandsDetails", label: "KI versteht - Details" },
                      {
                        type: "string",
                        name: "positivePoints",
                        label: "Positive Punkte",
                        list: true,
                        ui: { component: "tags" }
                      },
                      { type: "string", name: "resultLabel", label: "Ergebnis Label" },
                      { type: "string", name: "resultText", label: "Ergebnis Text" },
                    ],
                  },
                  {
                    type: "object",
                    name: "realExample",
                    label: "Real-World Beispiel",
                    fields: [
                      { type: "string", name: "title", label: "Titel" },
                      { type: "string", name: "question", label: "ChatGPT Frage", ui: { component: "textarea" } },
                      { type: "string", name: "pagebuilderResponse", label: "Pagebuilder Antwort", ui: { component: "textarea" } },
                      { type: "string", name: "codebackResponse", label: "CodeBack Antwort", ui: { component: "textarea" } },
                    ],
                  },
                  {
                    type: "object",
                    name: "schemaExplanation",
                    label: "Schema.org Erklärung",
                    fields: [
                      { type: "string", name: "title", label: "Titel" },
                      { type: "string", name: "description", label: "Beschreibung", ui: { component: "textarea" } },
                      {
                        type: "object",
                        name: "benefits",
                        label: "Benefits",
                        list: true,
                        fields: [
                          { type: "string", name: "icon", label: "Icon Emoji" },
                          { type: "string", name: "title", label: "Titel" },
                          { type: "string", name: "description", label: "Beschreibung" },
                        ],
                      },
                      { type: "string", name: "resultTitle", label: "Ergebnis Titel" },
                      { type: "string", name: "resultMain", label: "Ergebnis Haupt-Text", ui: { component: "textarea" } },
                      { type: "string", name: "resultFooter", label: "Ergebnis Footer" },
                    ],
                  },
                ],
              },

              // ═══ CONCEPT SECTION BLOCK ═══
              {
                name: "concept",
                label: "Concept Section",
                fields: [
                  {
                    type: "string",
                    name: "headline",
                    label: "Headline",
                    required: true,
                  },
                  {
                    type: "string",
                    name: "description",
                    label: "Description",
                    ui: { component: "textarea" },
                  },
                  {
                    type: "object",
                    name: "pillars",
                    label: "3 Säulen",
                    list: true,
                    fields: [
                      { type: "number", name: "number", label: "Nummer (1-3)" },
                      { type: "string", name: "title", label: "Titel" },
                      { type: "string", name: "description", label: "Beschreibung", ui: { component: "textarea" } },
                      { type: "string", name: "technicalLabel", label: "Technical Label" },
                      { type: "string", name: "technicalDetails", label: "Technical Details", ui: { component: "textarea" } },
                    ],
                  },
                  {
                    type: "object",
                    name: "techComparison",
                    label: "Tech vs Pagebuilder",
                    fields: [
                      { type: "string", name: "title", label: "Titel" },
                      { type: "string", name: "subtitle", label: "Untertitel", ui: { component: "textarea" } },
                      { type: "string", name: "pagebuilderLabel", label: "Pagebuilder Label" },
                      { type: "string", name: "pagebuilderText", label: "Pagebuilder Text", ui: { component: "textarea" } },
                      { type: "string", name: "codebackLabel", label: "CodeBack Label" },
                      { type: "string", name: "codebackText", label: "CodeBack Text", ui: { component: "textarea" } },
                    ],
                  },
                  {
                    type: "object",
                    name: "practiceExample",
                    label: "Praxis-Beispiel",
                    fields: [
                      { type: "string", name: "title", label: "Titel" },
                      { type: "string", name: "description", label: "Beschreibung", ui: { component: "textarea" } },
                      { type: "string", name: "highlight", label: "Highlight Text" },
                    ],
                  },
                ],
              },

              // ═══ PRICING SECTION BLOCK ═══
              {
                name: "pricing",
                label: "Pricing Section",
                fields: [
                  {
                    type: "string",
                    name: "headline",
                    label: "Headline",
                    required: true,
                  },
                  {
                    type: "string",
                    name: "subheadline",
                    label: "Subheadline",
                  },
                  {
                    type: "object",
                    name: "statusBadge",
                    label: "Status Badge",
                    fields: [
                      { type: "string", name: "launchDate", label: "Launch Datum" },
                      { type: "number", name: "slotsTotal", label: "Slots Gesamt" },
                      { type: "number", name: "slotsTaken", label: "Slots Belegt" },
                    ],
                  },
                  {
                    type: "object",
                    name: "packages",
                    label: "Packages",
                    list: true,
                    fields: [
                      { type: "string", name: "icon", label: "Icon Emoji" },
                      { type: "string", name: "name", label: "Package Name (Bronze/Silver/Gold)" },
                      { type: "number", name: "price", label: "Preis in EUR" },
                      { type: "string", name: "deliveryTime", label: "Lieferzeit" },
                      { type: "boolean", name: "featured", label: "Featured (empfohlen)" },
                      {
                        type: "string",
                        name: "features",
                        label: "Features",
                        list: true,
                        ui: { component: "tags" }
                      },
                      { type: "string", name: "buttonText", label: "Button Text" },
                    ],
                  },
                  {
                    type: "object",
                    name: "faqs",
                    label: "Mini FAQs",
                    list: true,
                    fields: [
                      { type: "string", name: "question", label: "Frage" },
                      { type: "string", name: "answer", label: "Antwort", ui: { component: "textarea" } },
                    ],
                  },
                ],
              },

              // ═══ FUTURE SECTION BLOCK ═══
              {
                name: "future",
                label: "Future Section",
                fields: [
                  {
                    type: "string",
                    name: "headline",
                    label: "Headline",
                    required: true,
                  },
                  {
                    type: "object",
                    name: "searchEra",
                    label: "Search Engine Era",
                    fields: [
                      { type: "string", name: "timeframe", label: "Zeitraum" },
                      { type: "string", name: "query", label: "Beispiel-Query" },
                      { type: "string", name: "result", label: "Ergebnis" },
                    ],
                  },
                  {
                    type: "object",
                    name: "answerEra",
                    label: "Answer Engine Era",
                    fields: [
                      { type: "string", name: "timeframe", label: "Zeitraum" },
                      { type: "string", name: "query", label: "Beispiel-Query" },
                      { type: "string", name: "result", label: "Ergebnis" },
                    ],
                  },
                  {
                    type: "object",
                    name: "criticalQuestion",
                    label: "Kritische Frage",
                    fields: [
                      { type: "string", name: "label", label: "Label" },
                      { type: "string", name: "question", label: "Frage", ui: { component: "textarea" } },
                    ],
                  },
                  {
                    type: "string",
                    name: "firstMoverText",
                    label: "First Mover Text",
                  },
                ],
              },

              // ═══ TECH STACK BLOCK ═══
              {
                name: "techStack",
                label: "Tech Stack Section",
                fields: [
                  {
                    type: "string",
                    name: "headline",
                    label: "Headline",
                    required: true,
                  },
                  {
                    type: "string",
                    name: "description",
                    label: "Description",
                    ui: { component: "textarea" },
                  },
                  {
                    type: "object",
                    name: "technologies",
                    label: "Technologien",
                    list: true,
                    fields: [
                      { type: "string", name: "icon", label: "Icon Emoji" },
                      { type: "string", name: "title", label: "Titel" },
                      { type: "string", name: "description", label: "Beschreibung", ui: { component: "textarea" } },
                      { type: "string", name: "badge", label: "Badge Text" },
                      { type: "boolean", name: "featured", label: "Featured (grün highlightet)" },
                    ],
                  },
                  {
                    type: "object",
                    name: "privacyBadge",
                    label: "Privacy First Badge",
                    fields: [
                      { type: "string", name: "icon", label: "Icon Emoji" },
                      { type: "string", name: "title", label: "Titel" },
                      { type: "string", name: "subtitle", label: "Untertitel" },
                      {
                        type: "object",
                        name: "features",
                        label: "Privacy Features",
                        list: true,
                        fields: [
                          { type: "string", name: "title", label: "Titel" },
                          { type: "string", name: "description", label: "Beschreibung" },
                        ],
                      },
                    ],
                  },
                  {
                    type: "object",
                    name: "whyNotWordPress",
                    label: "Why not WordPress Box",
                    fields: [
                      { type: "string", name: "title", label: "Titel" },
                      { type: "string", name: "description", label: "Beschreibung", ui: { component: "textarea" } },
                      { type: "string", name: "highlight", label: "Highlight Text", ui: { component: "textarea" } },
                      { type: "string", name: "footer", label: "Footer Text", ui: { component: "textarea" } },
                    ],
                  },
                ],
              },

              // ═══ FAQ SECTION BLOCK ═══
              {
                name: "faq",
                label: "FAQ Section",
                fields: [
                  {
                    type: "string",
                    name: "headline",
                    label: "Headline",
                    required: true,
                  },
                  {
                    type: "object",
                    name: "faqs",
                    label: "FAQs",
                    list: true,
                    fields: [
                      { type: "string", name: "question", label: "Frage", required: true },
                      { type: "string", name: "answer", label: "Antwort", required: true, ui: { component: "textarea" } },
                    ],
                  },
                  {
                    type: "object",
                    name: "ctaBox",
                    label: "CTA Box nach FAQs",
                    fields: [
                      { type: "string", name: "title", label: "Titel" },
                      { type: "string", name: "description", label: "Beschreibung" },
                      { type: "string", name: "buttonText", label: "Button Text" },
                      { type: "string", name: "buttonLink", label: "Button Link" },
                      { type: "string", name: "note", label: "Note Text" },
                    ],
                  },
                ],
              },

              // ═══ CTA SECTION BLOCK ═══
              {
                name: "cta",
                label: "CTA Section",
                fields: [
                  {
                    type: "string",
                    name: "headline",
                    label: "Headline",
                    required: true,
                  },
                  {
                    type: "string",
                    name: "description",
                    label: "Description",
                    ui: { component: "textarea" },
                  },
                  {
                    type: "object",
                    name: "primaryButton",
                    label: "Primary Button",
                    fields: [
                      { type: "string", name: "text", label: "Button Text" },
                      { type: "string", name: "href", label: "Button Link" },
                    ],
                  },
                  {
                    type: "object",
                    name: "secondaryButton",
                    label: "Secondary Button",
                    fields: [
                      { type: "string", name: "text", label: "Button Text" },
                      { type: "string", name: "href", label: "Button Link" },
                    ],
                  },
                  {
                    type: "object",
                    name: "blogLinks",
                    label: "Blog Links Box",
                    fields: [
                      { type: "string", name: "title", label: "Titel" },
                      {
                        type: "string",
                        name: "links",
                        label: "Link Texte",
                        list: true,
                        ui: { component: "tags" }
                      },
                    ],
                  },
                  {
                    type: "object",
                    name: "footer",
                    label: "Footer Info",
                    fields: [
                      { type: "string", name: "line1", label: "Zeile 1" },
                      { type: "string", name: "line2", label: "Zeile 2" },
                    ],
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