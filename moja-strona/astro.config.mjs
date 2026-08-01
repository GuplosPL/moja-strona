import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://moja-strona-yi0.pages.dev',
  output: 'static',
  vite: {
    plugins: [tailwindcss()],
  },
});
