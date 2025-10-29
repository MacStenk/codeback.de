# TinaCMS Backup Info

**Datum:** 29. Oktober 2025  
**Version:** v1.0-tinacms-working  
**Status:** ✅ Funktioniert komplett

## Bei Problemen - Restore:

```bash
# Zurück zu dieser Version:
git checkout v1.0-tinacms-working

# Oder vom Backup-Branch:
git checkout backup/tinacms-oct29-2025
```

## Was funktioniert:

- ✅ TinaCMS Login bei https://codeback.de/admin/
- ✅ Build ohne Memory-Fehler
- ✅ Client ID hardcoded in tina/config.ts
- ✅ Token in Cloudflare ENV

## Setup wurde gelöst durch:

- Entfernung von src/pages/admin/index.astro
- Nutzung von tina/ statt .tina/
- Client ID hardcoded (nicht als ENV)
- astro check entfernt aus package.json

## Backup-Locations:

- Git Tag: v1.0-tinacms-working
- Branch: backup/tinacms-oct29-2025
- GitHub: https://github.com/MacStenk/codeback.de
