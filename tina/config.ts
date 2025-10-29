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
                // @ts-ignore - TinaCMS doesn't support default for nested fields in types but it works
                default: "Steven Noack",
                description: "Vollständiger Name des Autors",
              },
              {
                type: "string",
                name: "url",
                label: "Website",
                // @ts-ignore
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
          // ═══ OPEN GRAPH (Facebook, LinkedIn) ═══
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
                // @ts-ignore
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
                // @ts-ignore
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
            // @ts-ignore
            default: "BlogPosting",
            description: "Welche Art von Artikel ist das für strukturierte Daten? Hilft Google und AI-Systemen den Content-Typ zu verstehen. BlogPosting = Standard Blog-Artikel, TechArticle = Technischer/wissenschaftlicher Artikel, HowTo = Schritt-für-Schritt Anleitung/Tutorial, Article = Generischer Artikel",
          },
          // ═══ FAQ SCHEMA (Rich Snippets) ═══
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
    ],
  },
});