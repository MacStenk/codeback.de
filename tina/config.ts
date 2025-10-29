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
      // HOMEPAGE COLLECTION (Blocks-based)
      // ═══════════════════════════════════════════════════════════════
      {
        name: "homepage",
        label: "🏠 Homepage",
        path: "src/content/homepage",
        format: "json",
        ui: {
          allowedActions: {
            create: false,  // Nur eine Homepage
            delete: false,
          },
          router: () => {
            return '/';  // Visual Editing auf Homepage
          },
        },
        fields: [
          // ═══ SEO BASICS ═══
          {
            type: "string",
            name: "title",
            label: "Page Title",
            required: true,
            description: "Der Haupt-Titel für die Homepage (SEO)",
          },
          {
            type: "string",
            name: "description",
            label: "Meta Description",
            required: true,
            description: "Meta-Beschreibung für SEO (max 160 Zeichen)",
            ui: {
              component: "textarea",
            },
          },

          // ═══ BLOCKS SYSTEM ═══
          {
            type: "object",
            name: "blocks",
            label: "📦 Page Sections",
            description: "Die Sections der Homepage. Drag & Drop um Reihenfolge zu ändern!",
            list: true,
            templates: [

              // ═══════════════════════════════════════════════════════════════════════════════
              // HERO BLOCK - Homepage Hero Section
              // ═══════════════════════════════════════════════════════════════════════════════
              // Used for: Main homepage hero with headline + CTA buttons
              // Template-ready: Yes - Reusable for customer sites
              // LLM-Optimized: Headline structure optimized for AI parsing
              // ═══════════════════════════════════════════════════════════════════════════════
              {
                name: "hero",
                label: "🎯 Hero Section",
                ui: {
                  defaultItem: {
                    eyebrow: "Der Code ist zurück",
                    titlePart1: "ChatGPT empfiehlt",
                    titleHighlight: "deine Konkurrenz",
                    titlePart2: "– nicht dich",
                    subtitle: "Deine Expertise ist in Pagebuildern versteckt, statt maschinenlesbar strukturiert. Wir bauen die technische Grundlage, damit KI dein Wissen findet, versteht und als Antwort nutzt. Digitale Grundstruktur für nachhaltige Sichtbarkeit.",
                    ctaPrimary: "Website jetzt testen →",
                    ctaPrimaryLink: "/llm-checker",
                    ctaSecondary: "Wie funktioniert das?",
                    ctaSecondaryLink: "#problem",
                    showReadabilityCheck: true,
                    readabilityText: "Kostenloser LLM-Readability Check in 30 Sekunden",
                  },
                },
                fields: [
                  {
                    type: "string",
                    name: "eyebrow",
                    label: "Eyebrow Text",
                    description: "Kleiner Text über der Headline (z.B. 'Der Code ist zurück')",
                  },
                  {
                    type: "string",
                    name: "titlePart1",
                    label: "Headline Teil 1",
                    description: "Erster Teil der Headline",
                  },
                  {
                    type: "string",
                    name: "titleHighlight",
                    label: "Headline Highlight (grün)",
                    description: "Der Teil der grün hervorgehoben wird",
                  },
                  {
                    type: "string",
                    name: "titlePart2",
                    label: "Headline Teil 2",
                    description: "Zweiter Teil der Headline (nach dem Highlight)",
                  },
                  {
                    type: "string",
                    name: "subtitle",
                    label: "Untertitel",
                    description: "Der beschreibende Text unter der Headline",
                    ui: { component: "textarea" },
                  },
                  {
                    type: "string",
                    name: "ctaPrimary",
                    label: "Primary CTA Button Text",
                  },
                  {
                    type: "string",
                    name: "ctaPrimaryLink",
                    label: "Primary CTA Link",
                    description: "z.B. /llm-checker oder https://...",
                  },
                  {
                    type: "string",
                    name: "ctaSecondary",
                    label: "Secondary CTA Button Text",
                  },
                  {
                    type: "string",
                    name: "ctaSecondaryLink",
                    label: "Secondary CTA Link",
                    description: "z.B. #problem für Anchor-Link",
                  },
                  {
                    type: "boolean",
                    name: "showReadabilityCheck",
                    label: "LLM Readability Check anzeigen?",
                    description: "Zeigt den Trust Badge unter den Buttons",
                  },
                  {
                    type: "string",
                    name: "readabilityText",
                    label: "Readability Check Text",
                    description: "Text für den Trust Badge (z.B. 'Kostenloser LLM-Readability Check in 30 Sekunden')",
                  },
                ],
              },

              // ═══════════════════════════════════════════════════════════════════════════════
              // TARGET AUDIENCE BLOCK - Für wen ist das Angebot?
              // ═══════════════════════════════════════════════════════════════════════════════
              {
                name: "targetAudience",
                label: "👥 Zielgruppen",
                ui: {
                  defaultItem: {
                    headline: "Für wen ist CodeBack?",
                    subheadline: "Für Experten, die verstanden haben, dass KI-Sichtbarkeit entscheidend ist – und dass Pagebuilder sie nicht liefern können.",
                  },
                },
                fields: [
                  {
                    type: "string",
                    name: "headline",
                    label: "Headline",
                  },
                  {
                    type: "string",
                    name: "subheadline",
                    label: "Subheadline",
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
                      {
                        type: "string",
                        name: "description",
                        label: "Beschreibung",
                        ui: { component: "textarea" }
                      },
                      { type: "string", name: "bulletPoint", label: "Bullet Point (grün)", description: "z.B. '→ Strukturierte Inhalte = KI empfiehlt dich'" },
                    ],
                  },
                  {
                    type: "object",
                    name: "stats",
                    label: "Statistiken",
                    list: true,
                    description: "Die 3 Stats-Boxen unter den Zielgruppen",
                    fields: [
                      { type: "string", name: "value", label: "Wert", description: "z.B. '73%' oder '2025'" },
                      { type: "string", name: "description", label: "Beschreibung" },
                    ],
                  },
                  {
                    type: "object",
                    name: "earlyMover",
                    label: "Early Mover Box",
                    fields: [
                      { type: "string", name: "title", label: "Titel", default: "Early Mover Advantage" },
                      {
                        type: "string",
                        name: "text",
                        label: "Text",
                        ui: { component: "textarea" },
                      },
                    ],
                  },
                ],
              },

              // ═══════════════════════════════════════════════════════════════════════════════
              // LIVE DEMO BLOCK - Zeigt wie KI die Seite liest
              // ═══════════════════════════════════════════════════════════════════════════════
              {
                name: "liveDemo",
                label: "🔬 Live Demo",
                fields: [
                  { type: "string", name: "headline", label: "Headline" },
                  {
                    type: "string",
                    name: "description",
                    label: "Beschreibung",
                    ui: { component: "textarea" }
                  },
                  { type: "string", name: "ctaText", label: "CTA Button Text" },
                  { type: "string", name: "ctaLink", label: "CTA Link" },
                ],
              },

              // ═══════════════════════════════════════════════════════════════════════════════
              // PROBLEM BLOCK - Das Problem beschreiben
              // ═══════════════════════════════════════════════════════════════════════════════
              {
                name: "problem",
                label: "⚠️ Problem Section",
                fields: [
                  { type: "string", name: "headline", label: "Headline" },
                  {
                    type: "string",
                    name: "description",
                    label: "Beschreibung",
                    ui: { component: "textarea" }
                  },
                ],
              },

              // ═══════════════════════════════════════════════════════════════════════════════
              // CONCEPT BLOCK - Die Lösung / Das Konzept
              // ═══════════════════════════════════════════════════════════════════════════════
              {
                name: "concept",
                label: "💡 Konzept Section",
                fields: [
                  { type: "string", name: "headline", label: "Headline" },
                  {
                    type: "string",
                    name: "description",
                    label: "Beschreibung",
                    ui: { component: "textarea" }
                  },
                ],
              },

              // ═══════════════════════════════════════════════════════════════════════════════
              // PRICING BLOCK - Pricing Packages
              // ═══════════════════════════════════════════════════════════════════════════════
              {
                name: "pricing",
                label: "💰 Pricing Section",
                fields: [
                  { type: "string", name: "headline", label: "Headline" },
                  { type: "string", name: "subheadline", label: "Subheadline" },
                  {
                    type: "object",
                    name: "statusBadge",
                    label: "Status Badge",
                    fields: [
                      { type: "string", name: "text", label: "Text", description: "z.B. 'Launch Januar 2026'" },
                      { type: "string", name: "slots", label: "Slots Info", description: "z.B. '3 von 4 Slots belegt'" },
                    ],
                  },
                  {
                    type: "object",
                    name: "packages",
                    label: "Pricing Packages",
                    list: true,
                    fields: [
                      { type: "string", name: "icon", label: "Icon (Emoji)" },
                      { type: "string", name: "name", label: "Name", description: "z.B. 'Bronze', 'Silver', 'Gold'" },
                      { type: "string", name: "price", label: "Preis", description: "z.B. '5.000€'" },
                      { type: "string", name: "deliveryTime", label: "Lieferzeit", description: "z.B. '7 Tage Lieferzeit'" },
                      {
                        type: "string",
                        name: "features",
                        label: "Features",
                        list: true,
                        description: "Liste der Features für dieses Package",
                      },
                      { type: "string", name: "ctaText", label: "CTA Button Text" },
                      { type: "string", name: "ctaLink", label: "CTA Link" },
                      { type: "boolean", name: "featured", label: "Featured Package?", description: "Wird grün hervorgehoben" },
                    ],
                  },
                ],
              },

              // ═══════════════════════════════════════════════════════════════════════════════
              // FUTURE BLOCK - Zukunft der Suche
              // ═══════════════════════════════════════════════════════════════════════════════
              {
                name: "future",
                label: "🔮 Future Vision",
                fields: [
                  { type: "string", name: "headline", label: "Headline" },
                  {
                    type: "string",
                    name: "content",
                    label: "Content",
                    ui: { component: "textarea" }
                  },
                ],
              },

              // ═══════════════════════════════════════════════════════════════════════════════
              // TECH STACK BLOCK - Technologien
              // ═══════════════════════════════════════════════════════════════════════════════
              {
                name: "techStack",
                label: "⚙️ Tech Stack",
                fields: [
                  { type: "string", name: "headline", label: "Headline" },
                  {
                    type: "string",
                    name: "description",
                    label: "Beschreibung",
                    ui: { component: "textarea" }
                  },
                  {
                    type: "object",
                    name: "technologies",
                    label: "Technologien",
                    list: true,
                    fields: [
                      { type: "string", name: "icon", label: "Icon (Emoji)" },
                      { type: "string", name: "name", label: "Name" },
                      { type: "string", name: "description", label: "Beschreibung", ui: { component: "textarea" } },
                      { type: "string", name: "badge", label: "Badge Text", description: "z.B. 'Open Source' oder 'Made in Germany'" },
                      { type: "boolean", name: "featured", label: "Featured?", description: "Wird grün hervorgehoben" },
                    ],
                  },
                ],
              },

              // ═══════════════════════════════════════════════════════════════════════════════
              // FAQ BLOCK - Häufig gestellte Fragen
              // ═══════════════════════════════════════════════════════════════════════════════
              {
                name: "faq",
                label: "❓ FAQ Section",
                fields: [
                  { type: "string", name: "headline", label: "Headline" },
                  {
                    type: "object",
                    name: "faqs",
                    label: "FAQs",
                    list: true,
                    fields: [
                      { type: "string", name: "question", label: "Frage" },
                      {
                        type: "string",
                        name: "answer",
                        label: "Antwort",
                        ui: { component: "textarea" }
                      },
                    ],
                  },
                  {
                    type: "object",
                    name: "ctaBox",
                    label: "CTA Box (nach FAQs)",
                    fields: [
                      { type: "string", name: "headline", label: "Headline" },
                      { type: "string", name: "description", label: "Beschreibung" },
                      { type: "string", name: "buttonText", label: "Button Text" },
                      { type: "string", name: "buttonLink", label: "Button Link" },
                      { type: "string", name: "secondaryText", label: "Secondary Text (unter Button)" },
                    ],
                  },
                ],
              },

              // ═══════════════════════════════════════════════════════════════════════════════
              // CTA BLOCK - Final Call-to-Action
              // ═══════════════════════════════════════════════════════════════════════════════
              {
                name: "cta",
                label: "🎯 Call-to-Action",
                fields: [
                  { type: "string", name: "headline", label: "Headline" },
                  {
                    type: "string",
                    name: "description",
                    label: "Beschreibung",
                    ui: { component: "textarea" }
                  },
                  { type: "string", name: "buttonPrimaryText", label: "Primary Button Text" },
                  { type: "string", name: "buttonPrimaryLink", label: "Primary Button Link" },
                  { type: "string", name: "buttonSecondaryText", label: "Secondary Button Text" },
                  { type: "string", name: "buttonSecondaryLink", label: "Secondary Button Link" },
                  {
                    type: "object",
                    name: "blogLinks",
                    label: "Blog Links Section",
                    fields: [
                      { type: "string", name: "headline", label: "Headline" },
                      {
                        type: "string",
                        name: "links",
                        label: "Blog Link Texte",
                        list: true,
                        description: "Liste der Blog-Link-Texte",
                      },
                    ],
                  },
                  { type: "string", name: "footerText", label: "Footer Text", description: "z.B. 'Entwickelt von Steven Noack'" },
                ],
              },

            ],
          },
        ],
      },

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
            required: true,
            default: "WebPage",
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
    ],
  },
});