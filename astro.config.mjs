// @ts-check
import { defineConfig } from 'astro/config';

import svelte from '@astrojs/svelte';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  integrations: [svelte()],

  vite: {
    plugins: [tailwindcss()],
    build: {
      cssMinify: 'lightningcss',
    }
  },

  // Optimizaciones de rendimiento
  build: {
    inlineStylesheets: 'auto',
  },

  // Compresión de assets
  compressHTML: true,
});