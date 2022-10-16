import { defineConfig } from 'astro/config';
import gitDatesPlugin from './src/plugins/gitDates.mts';

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  output: "server",
  markdown: {
    remarkPlugins: [gitDatesPlugin],
    drafts: true,
  },
  adapter: cloudflare()
});