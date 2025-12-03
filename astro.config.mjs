// @ts-check
import { defineConfig } from 'astro/config';

import vue from '@astrojs/vue';

// https://astro.build/config
export default defineConfig({
  integrations: [vue()],
  // Set your GitHub Pages URL here
  // Replace 'username' with your GitHub username and 'portfolio' with your repo name
  site: 'https://phuocbaohuynh.github.io',
  base: '/',
});