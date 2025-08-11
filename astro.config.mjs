// @ts-check
import { defineConfig } from 'astro/config';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

import icon from 'astro-icon';

import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@components': path.resolve('./src/components'),
        '@layouts': path.resolve('./src/layouts')
      }
    }
  },

  integrations: [react(), icon()],
  adapter: vercel({
    maxDuration: 30,
    memory: 1024
  })
});