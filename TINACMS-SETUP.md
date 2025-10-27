# TinaCMS Setup - Die 5-Minuten-Anleitung

**Für Astro + Cloudflare Pages + GitHub**

---

## 1. TinaCMS installieren (2 Min)

```bash
npm install tinacms @tinacms/cli
```

**package.json Scripts anpassen:**

```json
{
  "scripts": {
    "dev": "tinacms dev -c \"astro dev\"",
    "build": "tinacms build && astro check && astro build"
  }
}
```

---

## 2. TinaCloud Projekt erstellen (1 Min)

1. Gehe zu: https://app.tina.io/
2. Click "New Project"
3. Verbinde GitHub Repository
4. **Client ID kopieren!**

---

## 3. Config erstellen (1 Min)

**Datei: `tina/config.ts`**

```typescript
import { defineConfig } from "tinacms";

const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  "main";

export default defineConfig({
  branch,

  clientId: "DEINE_CLIENT_ID_HIER", // ← Von TinaCloud!
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
            label: "Published Date",
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
  },
});
```

**Wichtig:**

- Ersetze `DEINE_CLIENT_ID_HIER` mit der Client ID von TinaCloud!
- Passe `fields` an dein Astro Content Schema an!

---

## 4. Token generieren und zu Cloudflare (1 Min)

**TinaCloud Dashboard → Tokens Tab:**

- Click "New Token"
- Type: "Content (Read-only)"
- Branches: `main` (explizit eintragen!)
- **Token kopieren**

**Cloudflare Pages → Settings → Environment variables:**

- Variable name: `TINA_TOKEN`
- Value: _dein Token_
- Save

---

## 5. Deployen (30 Sek)

```bash
git add tina/
git commit -m "feat: Add TinaCMS"
git push origin main
```

Cloudflare deployed automatisch!

---

## 6. Testen

**Lokal:**

```bash
npm run dev
# http://localhost:4321/admin/index.html
```

**Production:**

```
https://deine-domain.de/admin/index.html
```

Click "Log in" → GitHub OAuth → Fertig! ✅

---

## Troubleshooting

### Build Error: "403 Forbidden"

→ Token hat keinen Zugriff auf Branch  
→ In TinaCloud: Branches explizit auf `main` setzen (nicht `*`)

### "You are in local mode"

→ Client ID fehlt oder falsch in `tina/config.ts`

### `/admin` bleibt weiß

→ Normal! Nutze `/admin/index.html`

---

## Was du jetzt hast

✅ TinaCMS läuft lokal und in Production  
✅ Automatische Commits zu GitHub  
✅ Automatisches Deployment durch Cloudflare  
✅ Blog Posts überall editieren - kein Terminal nötig!

**Setup-Zeit nächstes Mal: 5 Minuten statt 2 Stunden!** 🚀
