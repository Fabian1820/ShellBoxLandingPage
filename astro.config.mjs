// @ts-check
import { defineConfig } from 'astro/config';

import svelte from '@astrojs/svelte';
import tailwindcss from '@tailwindcss/vite';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: node({
    mode: 'standalone'
  }),
  integrations: [svelte()],

  vite: {
    plugins: [tailwindcss()],

    // Leaflet es CommonJS y solo se carga con un import dinámico. Sin declararlo
    // aquí, Vite lo descubre en caliente durante el desarrollo, reoptimiza las
    // dependencias y acaba con dos copias del runtime de Svelte cargadas a la vez
    // (que fallan con «lifecycle_outside_component»). Pre-empaquetarlo al
    // arrancar lo evita; la compilación de producción no se ve afectada.
    optimizeDeps: {
      include: ['leaflet'],
    },

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