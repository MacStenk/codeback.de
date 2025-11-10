-- Flowise Briefing Chat - Supabase Vector Setup
-- Ausführen im Supabase SQL Editor

-- 1. Extension aktivieren
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Knowledge-Base Tabelle
CREATE TABLE briefing_knowledge (
  id bigserial PRIMARY KEY,
  content text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  embedding vector(1536),
  created_at timestamp DEFAULT now()
);

-- 3. Vector Index
CREATE INDEX ON briefing_knowledge
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- 4. Chat-Konversationen
CREATE TABLE chat_conversations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id text UNIQUE NOT NULL,
  messages jsonb DEFAULT '[]'::jsonb,
  metadata jsonb DEFAULT '{}'::jsonb,
  status text DEFAULT 'active', -- active, qualified, rejected, completed
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- 5. Trigger für updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_chat_conversations_updated_at
BEFORE UPDATE ON chat_conversations
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 6. View für qualifizierte Leads
CREATE VIEW qualified_leads AS
SELECT
  session_id,
  metadata->>'name' AS name,
  metadata->>'email' AS email,
  metadata->>'business' AS business,
  metadata->>'budget' AS budget,
  metadata->>'timeline' AS timeline,
  created_at
FROM chat_conversations
WHERE status = 'qualified'
ORDER BY created_at DESC;

