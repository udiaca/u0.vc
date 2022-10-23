import { defineConfig } from 'astro/config';
import gitDatesPlugin from './src/plugins/gitDates.mts';
import cloudflare from "@astrojs/cloudflare";

import svelte from "@astrojs/svelte";

// https://astro.build/config
export default defineConfig({
  output: "server",
  vite: {
    define: {
      '__GITHUB_CLIENT_ID': process.env.GITHUB_CLIENT_ID,
    }
  },
  markdown: {
    remarkPlugins: [gitDatesPlugin],
    drafts: true
  },
  adapter: cloudflare({
    mode: "directory"
  }),
  integrations: [svelte()]
});