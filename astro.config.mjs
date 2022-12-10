import { defineConfig } from 'astro/config';
import gitDatesPlugin from './src/plugins/gitDates.mts';
import indexEntry from './src/plugins/indexEntry';
import cloudflare from "@astrojs/cloudflare";

import svelte from "@astrojs/svelte";

// https://astro.build/config
export default defineConfig({
  output: "server",
  markdown: {
    remarkPlugins: [gitDatesPlugin],
    drafts: true
  },
  vite: {
    build: {
      sourcemap: true,
    },
  },
  adapter: cloudflare({
    mode: "directory"
  }),
  integrations: [svelte(), indexEntry()]
});