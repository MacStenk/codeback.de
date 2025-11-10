import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare'; 

export default defineConfig({
  site: 'https://codeback.de',
  trailingSlash: 'never',
  adapter: cloudflare({
    mode: 'directory'
  }),  // ← SCHLIESSE cloudflare() mit }),
  integrations: [
    mdx(), 
    sitemap({  // ← ÖFFNE sitemap mit ({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      serialize(item) {
        // Homepage
        if (item.url === 'https://codeback.de/') {
          item.changefreq = 'daily';
          item.priority = 1.0;
        }
        // Blog index
        if (item.url === 'https://codeback.de/blog/') {
          item.changefreq = 'weekly';
          item.priority = 0.9;
        }
        // Blog posts
        if (item.url.includes('/blog/')) {
          item.changefreq = 'monthly';
          item.priority = 0.8;
        }
        return item;
      },
    }), 
    tailwind()
  ]
});