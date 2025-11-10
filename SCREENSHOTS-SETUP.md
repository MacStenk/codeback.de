# 📸 Screenshots Setup - Manual Installation

## Was du machen musst:

### 1. Screenshots umbenennen und speichern

**Du hast 2 Screenshots hochgeladen:**
- `1762706553316_image.png` → Google Ranking
- `1762706705343_image.png` → Perplexity Ranking

**Speichere sie um als:**
```
/Users/stevennoack/dev/codeback.de/public/images/proof/
├── google-ranking.png
└── perplexity-ranking.png
```

---

### 2. Manuelle Schritte:

```bash
# 1. Gehe zu deinem Downloads Ordner (oder wo die Screenshots sind)
cd ~/Downloads

# 2. Kopiere und benenne sie um:
cp 1762706553316_image.png /Users/stevennoack/dev/codeback.de/public/images/proof/google-ranking.png

cp 1762706705343_image.png /Users/stevennoack/dev/codeback.de/public/images/proof/perplexity-ranking.png

# 3. Verifiziere dass sie da sind:
ls -lh /Users/stevennoack/dev/codeback.de/public/images/proof/
```

**Du solltest sehen:**
```
google-ranking.png
perplexity-ranking.png
```

---

### 3. Optional: Bilder optimieren (für Performance)

```bash
# Falls du imagemagick hast (optional, aber empfohlen):
cd /Users/stevennoack/dev/codeback.de/public/images/proof/

# PNG optimieren (ca. 50% kleiner):
convert google-ranking.png -quality 85 -strip google-ranking.png
convert perplexity-ranking.png -quality 85 -strip perplexity-ranking.png

# WebP Versionen erstellen (noch kleiner):
convert google-ranking.png -quality 85 google-ranking.webp
convert perplexity-ranking.png -quality 85 perplexity-ranking.webp
```

---

### 4. Dev Server refreshen

```bash
# Im codeback.de Verzeichnis:
npm run dev

# Browser öffnen:
# http://localhost:4321

# Scroll zur ProofSection → Du solltest die Screenshots sehen!
```

---

## ✅ Verification Checklist:

Nach dem Kopieren solltest du sehen:

**In der ProofSection:**
- [ ] Heading "📸 Die Beweise in Bildern"
- [ ] 2 Screenshots nebeneinander (Grid)
- [ ] Hover-Effekt (Border wird grün)
- [ ] "Click to Zoom" Overlay beim Hover
- [ ] Captions unter den Bildern

**File Structure:**
```
/public/images/proof/
├── google-ranking.png     ✓ vorhanden
└── perplexity-ranking.png ✓ vorhanden
```

---

## 🚨 Troubleshooting:

**Problem: Bilder werden nicht angezeigt**
```bash
# Check ob Files existieren:
ls -lh /Users/stevennoack/dev/codeback.de/public/images/proof/

# Check File-Namen (müssen EXAKT sein):
# ✓ google-ranking.png (nicht Google-Ranking.png!)
# ✓ perplexity-ranking.png
```

**Problem: Bilder sind riesig / laden langsam**
→ Optimiere sie mit imagemagick (siehe oben)

**Problem: Nur ein Bild wird angezeigt**
→ Check dass BEIDE Files korrekt benannt sind

---

## 🎨 Was die Component macht:

**ProofImages.astro Features:**
- ✅ Responsive Grid (2 Spalten Desktop, 1 Spalte Mobile)
- ✅ Hover-Effekte (Border grün, Bild zoom leicht)
- ✅ "Click to Zoom" Overlay
- ✅ Lazy Loading (Performance)
- ✅ Captions unter Bildern
- ✅ Link "Jetzt selbst testen" zu Google

**Styling:**
- Matches dein existierendes Design
- Green-600 Accents
- Zinc grays
- Smooth transitions

---

## 📊 Alternative: Drag & Drop

**Falls Kommandozeile zu kompliziert:**

1. Öffne **Finder**
2. Navigiere zu: `/Users/stevennoack/dev/codeback.de/public/images/proof/`
3. Ziehe die 2 Screenshots rein
4. Benenne sie um:
   - → `google-ranking.png`
   - → `perplexity-ranking.png`
5. Done! 🎉

---

**Sobald die Bilder da sind, sollte alles automatisch funktionieren!** 🚀

*Erstellt: 2025-11-09*
*Für: v2.3 Homepage Update*
