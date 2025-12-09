// @ts-check
import { defineConfig } from 'astro/config';

import vue from '@astrojs/vue';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  integrations: [vue()],
  output: 'server', // Use server mode for SSR with API routes
  adapter: node({
    mode: 'standalone'
  }),
  // Set your GitHub Pages URL here
  // Replace 'username' with your GitHub username and 'portfolio' with your repo name
  site: 'https://phuocbaohuynh.github.io',
  base: '/',
});