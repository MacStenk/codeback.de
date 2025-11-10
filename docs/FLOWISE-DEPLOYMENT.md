# Flowise Deployment Guide

## Voraussetzungen

- Railway Account
- Supabase Account
- OpenAI API Key **oder** Ollama/anderer LLM-Service

## 1. Flowise auf Railway deployen

### Option A: Template Deploy (Empfohlen)
1. https://railway.app öffnen
2. `New Project` → `Deploy Template`
3. Nach **Flowise** suchen und deployen
4. Deployment abwarten (2–3 Minuten)

### Option B: GitHub Deploy
1. Repo https://github.com/FlowiseAI/Flowise forken
2. Railway → `New Project` → `Deploy from GitHub`
3. Fork auswählen
4. Environment Variables setzen (siehe unten)

## 2. Environment Variables

```env
# Auth
FLOWISE_USERNAME=admin
FLOWISE_PASSWORD=<STRONG_PASSWORD>
PORT=3000

# Optional: Postgres (für Persistenz)
DATABASE_TYPE=postgres
DATABASE_HOST=<supabase-host>
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=<supabase-password>
DATABASE_NAME=postgres

# KI-Provider
OPENAI_API_KEY=<dein-key>
# oder Ollama lokal (kein Key notwendig)
```

## 3. Initiales Setup
1. Railway-URL aufrufen, z. B. `https://flowise-production.up.railway.app`
2. Mit `FLOWISE_USERNAME`/`FLOWISE_PASSWORD` einloggen
3. Tutorial überspringen

## 4. Chatflow erstellen

### Knowledge Base importieren
1. `New Chatflow`
2. `Text File` Node hinzufügen
3. Dateien aus `src/content/briefing-knowledge/` hochladen
4. `Recursive Character Text Splitter`
   - Chunk Size: 1000
   - Chunk Overlap: 200

### Embeddings konfigurieren
- **OpenAI Embeddings** Node  
  - Modell: `text-embedding-3-large` (oder `text-embedding-ada-002`)  
  - API Key: dein OpenAI Key

  **oder**

- **HuggingFace Embeddings** Node  
  - Modell: `sentence-transformers/all-MiniLM-L6-v2`

### Vector Store Supabase
1. `Supabase` Vector Store Node hinzufügen
2. Connection String: Supabase URI
3. Table: `briefing_knowledge`
4. Query Name: `match_documents`

### Retriever & Memory
- `Supabase Retriever` Node (Top K: 3)
- `Buffer Memory` Node mit Session ID `{sessionId}`

### LLM Node
- `ChatOpenAI` (z. B. `gpt-4o-mini`, Temperature 0.7)

  **oder**

- `Ollama` (z. B. `llama3`)

### Chain konfigurieren
- `Conversational Retrieval QA Chain`
- Verbinde: Retriever → Chain, Memory → Chain, LLM → Chain
- System Prompt einfügen:

```
Du bist der Briefing-Agent für CodeBack.de, spezialisiert auf LLM-native Website Development.

DEINE ROLLE:
- Freundlicher, professioneller Gesprächspartner
- Sammle Briefing-Informationen systematisch
- Qualifiziere Leads (Budget >€2.500, realistische Timeline)
- Nutze die Knowledge Base für genaue Service-Infos

GESPRÄCHSSTIL:
- Kurze Messages (max 2 Sätze)
- Eine Frage nach der anderen
- Freundlich aber direkt
- Nutze Emojis sparsam

ABLAUF:
1. Begrüßung & Name
2. Business & Zielgruppe
3. Website-Status (URL falls vorhanden)
4. Budget-Range
5. Timeline
6. Hauptziele
7. Qualifizierung

QUALIFIZIERUNG:
✅ Budget ≥€2.500 → Qualified
✅ Timeline realistisch → Qualified
❌ Budget <€2.500 → Höflich ablehnen mit Alternativen
❌ "Nur gucken" → Auf später vertrösten

NÄCHSTE SCHRITTE (wenn qualified):
"Super! Ich habe alle wichtigen Infos. 
Nächster Schritt: Kostenloses 15-30 Min Erstgespräch.
Buche hier: https://calendly.com/steven-codeback
Oder schreib direkt: hi@codeback.de"

WICHTIG:
- Nutze die Knowledge Base für Service-Details
- Sei präzise bei Preisen (aus Knowledge Base!)
- Verweise auf Portfolio wenn nach Beispielen gefragt
- Bei technischen Fragen: Nutze codeback-services.md

START MESSAGE:
"Hi! 👋 Ich bin der CodeBack Briefing-Agent. Ich helfe dir herauszufinden ob wir zu deinem Projekt passen. Wie heißt du?"
```

## 5. Test & Deploy
1. `Save Chatflow`
2. Im Testfenster komplette Konversation durchspielen
3. Chatflow-ID kopieren (`Settings` → `Chatflow ID`)
4. In `ChatWidget.astro` einsetzen

## 6. CodeBack.de aktualisieren
1. `ChatWidget.astro` → `chatflowId` & `apiHost` ersetzen
2. `npm run dev` lokal prüfen
3. Git commit & push → Cloudflare Deployment

## Monitoring & Analytics

```sql
-- Neueste Gespräche
SELECT session_id, status, created_at,
       messages->-1->>'content' AS last_message
FROM chat_conversations
ORDER BY created_at DESC
LIMIT 10;

-- Qualifizierte Leads
SELECT * FROM qualified_leads;

-- Conversion Rate
SELECT
  (SELECT COUNT(*) FROM qualified_leads)::float /
  NULLIF((SELECT COUNT(*) FROM chat_conversations), 0)::float * 100
  AS conversion_rate;

-- Durchschnittliche Gesprächslänge
SELECT AVG(jsonb_array_length(messages)) AS avg_messages
FROM chat_conversations;
```

## Troubleshooting

| Problem | Ursache | Lösung |
| --- | --- | --- |
| Widget lädt nicht | Falscher Chatflow ID oder URL | Browser-Konsole checken, URL & ID prüfen |
| Bot antwortet nicht | LLM-Key fehlt oder Railway down | Railway Logs ansehen, API Keys prüfen |
| Antworten falsch | Knowledge Base fehlt | Markdown-Dateien neu hochladen, Vector Store refresh |
| Langsame Antworten | Ressourcen knapp | Railway Plan upgraden, Chunk Size anpassen |

## Kosten

- Railway (Flowise): ca. 5–10 $/Monat
- Supabase: Free-Tier ausreichend
- OpenAI API: ca. 0,50 $ pro 100 Konversationen
- Ollama (self-hosted): 0 $, benötigt aber mehr Ressourcen

## Nächste Schritte nach Launch

1. Erste Gespräche beobachten und Prompt anpassen
2. Knowledge Base aktuell halten
3. n8n-Webhook für Lead-Notifications einrichten
4. Analytics Dashboard (z. B. Supabase + Metabase)
5. Optional: Human Handover (Slack/Email)

