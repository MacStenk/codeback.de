#!/usr/bin/env python3
"""
Embeddings Upload Script für CodeBack Briefing Knowledge Base
Liest .md Files, erstellt Embeddings, lädt in Supabase hoch
"""

import os
from pathlib import Path
from openai import OpenAI
from supabase import create_client, Client

# === CONFIG ===
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "sk-proj-YOUR-KEY-HERE")
SUPABASE_URL = "https://dnphtlvwrqalfjtzdchg.supabase.co"
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY", "YOUR-SERVICE-ROLE-KEY-HERE")

# Knowledge Base Files
KB_DIR = Path("src/content/briefing-knowledge")
FILES = [
    "briefing-questions.md",
    "codeback-services.md",
    "process.md"
]

# === INIT ===
openai = OpenAI(api_key=OPENAI_API_KEY)
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def chunk_text(text: str, chunk_size: int = 1000, overlap: int = 200) -> list[str]:
    """Split text into overlapping chunks"""
    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunk = text[start:end]
        chunks.append(chunk.strip())
        start = end - overlap
    return chunks

def create_embedding(text: str) -> list[float]:
    """Create embedding using OpenAI"""
    response = openai.embeddings.create(
        model="text-embedding-3-small",
        input=text
    )
    return response.data[0].embedding

def upload_to_supabase(content: str, metadata: dict, embedding: list[float]):
    """Upload to Supabase vector store"""
    data = {
        "content": content,
        "metadata": metadata,
        "embedding": embedding
    }
    result = supabase.table("briefing_knowledge").insert(data).execute()
    return result

def main():
    print("🚀 Starting Knowledge Base Upload...")
    
    total_chunks = 0
    
    for filename in FILES:
        filepath = KB_DIR / filename
        
        if not filepath.exists():
            print(f"⚠️  File not found: {filepath}")
            continue
            
        print(f"\n📄 Processing: {filename}")
        
        # Read file
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Chunk text
        chunks = chunk_text(content)
        print(f"   Split into {len(chunks)} chunks")
        
        # Process each chunk
        for i, chunk in enumerate(chunks, 1):
            print(f"   Chunk {i}/{len(chunks)}...", end=" ")
            
            # Create embedding
            embedding = create_embedding(chunk)
            
            # Metadata
            metadata = {
                "source": filename,
                "chunk_index": i,
                "total_chunks": len(chunks)
            }
            
            # Upload
            upload_to_supabase(chunk, metadata, embedding)
            print("✅")
            
            total_chunks += 1
    
    print(f"\n🎉 Done! Uploaded {total_chunks} chunks to Supabase")
    print(f"   Table: briefing_knowledge")
    print(f"   Ready for vector search!")

if __name__ == "__main__":
    main()
