// @ts-check
// Hybrid site (docs/PHASE-2-PLAN.md §14): public pages are prerendered to static files;
// the EmDash admin (/_emdash/*) and its API run on demand in the same Cloudflare Worker.
import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";
import emdash from "emdash/astro";
import { d1, r2 } from "@emdash-cms/cloudflare";
import { bxrCmsPlugin } from "bxr-cms";
import i18nCoverage from "./src/integrations/i18n-coverage.mjs";

export default defineConfig({
  site: "https://www.bigxreality.com",
  // Public URLs keep their trailing slash (all links and the sitemap use it);
  // "always" would make the EmDash API answer 404.
  trailingSlash: "ignore",
  build: { format: "directory" },
  // TEST FIXTURE builds never write to dist/ (docs/PHASE-2-PLAN.md §11.5).
  outDir: process.env.BXR_CONTENT_SOURCE === "fixtures" ? "./dist-fixtures" : "./dist",
  // The adapter writes this as a 301 in dist/client/_redirects.
  redirects: { "/": "/en/" },
  adapter: cloudflare(),
  // The site routes by its own [lang] segment; these are the CMS locales (see src/lib/cms-locales.ts).
  i18n: { defaultLocale: "en", locales: ["en", "zh-TW", "ja"], routing: "manual" },
  integrations: [
    i18nCoverage(),
    react(),
    emdash({
      database: d1({ binding: "DB" }),
      storage: r2({ binding: "MEDIA" }),
      // The deploy hook URL is entered in the admin (plugin settings, stored encrypted);
      // DEPLOY_HOOK_URL=log: makes local tests log instead of calling Cloudflare.
      plugins: [bxrCmsPlugin({ url: process.env.DEPLOY_HOOK_URL })],
    }),
  ],
  // A local build reads content from the running `astro dev` CMS; separate Vite caches
  // keep the build from replacing the dependencies the dev server is using.
  vite: {
    cacheDir: process.argv.includes("build") ? "node_modules/.vite-build" : "node_modules/.vite",
    // Pages are prerendered inside workerd, which does not see the build's environment;
    // the content source is fixed into the code here (read in src/lib/content-source.ts).
    define: {
      __BXR_CONTENT_SOURCE__: JSON.stringify(process.env.BXR_CONTENT_SOURCE ?? "markdown"),
      __BXR_WORKERS_CI__: JSON.stringify(!!process.env.WORKERS_CI),
      __BXR_PREVIEW__: JSON.stringify(process.env.BXR_PREVIEW === "1"),
    },
  },
  devToolbar: { enabled: false },
});
