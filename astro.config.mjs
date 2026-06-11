import { defineConfig } from 'astro/config';

// Static output: Astro builds plain HTML at build time, Cloudflare serves
// it exactly as the current site does — just with a build step in front.
// `trailingSlash: 'never'` + `build.format: 'file'` preserve the existing
// extensionless URLs (/blog, /story-james-..., /uk-glp1-price-comparison).
//
// NOTE: @astrojs/sitemap is intentionally deferred to Phase 3, where the
// full content collections exist and the sitemap can be generated complete.
export default defineConfig({
  site: 'https://understandglp1.com',
  output: 'static',
  trailingSlash: 'never',
  build: {
    format: 'file',
  },
});
