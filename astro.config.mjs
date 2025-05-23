import { defineConfig } from 'astro/config';

import tailwind from "@astrojs/tailwind";

// Import the Vercel adapter
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  site: 'https://theImperat0r.github.io',
  base: '/CoFounder-AI',
  integrations: [tailwind()],
  output: 'static',
  adapter: vercel(),
});