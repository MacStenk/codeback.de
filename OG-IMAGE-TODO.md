# OG-IMAGE TODO

## Was ist das?

Open Graph Images sind die Vorschaubilder, die angezeigt werden wenn deine Seite auf Social Media geteilt wird (Twitter, LinkedIn, Facebook, etc.)

## Wo speichern?

```
public/og-image.png
```

## Specs:

- **Größe:** 1200x630px (optimal für alle Plattformen)
- **Format:** PNG oder JPG
- **Dateigröße:** < 1MB
- **Text:** Gut lesbar auch in kleiner Ansicht

## Content Ideen:

```
CodeBack
LLM-native Webentwicklung
Deine Kunden fragen ChatGPT, nicht Google
```

**Design:**
- Grüner Hintergrund (#16a34a)
- Weißer Text
- CodeBack Logo
- Clean & Professional

## Später: Blog-spezifische OG-Images

Für jeden Blogpost kannst du individuelle OG-Images erstellen:

```astro
// In BlogPost.astro
<SEO 
  title={title}
  description={description}
  type="article"
  image={heroImage.src}
/>
```

## Tools:

- Canva: canva.com
- Figma: figma.com
- OG Image Generator: https://og-playground.vercel.app/
