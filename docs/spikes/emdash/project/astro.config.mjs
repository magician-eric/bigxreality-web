// @ts-check
// SPIKE ONLY (K2): EmDash on Cloudflare local emulation. Public pages stay prerendered;
// EmDash admin/API routes are on-demand (they declare prerender = false themselves).
import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";
import emdash from "emdash/astro";
import { d1, r2 } from "@emdash-cms/cloudflare";
import { deployHookPlugin } from "bxr-deploy-hook";
import i18nCoverage from "./src/integrations/i18n-coverage.mjs";

export default defineConfig({
  site: "https://www.bigxreality.com",
  trailingSlash: "ignore",
  build: { format: "directory" },
  redirects: { "/": "/en/" },
  // Static pages are prerendered in Node, like phase 1 (workerd prerender fails on local image processing).
  adapter: cloudflare(),
  i18n: {
    defaultLocale: "en",
    locales: ["en", "zh-TW", "ja"],
    routing: "manual",
  },
  integrations: [
    i18nCoverage(),
    react(),
    emdash({
      database: d1({ binding: "DB" }),
      storage: r2({ binding: "MEDIA" }),
      // SPIKE: local mock of the Workers Builds Deploy Hook
      plugins: [deployHookPlugin({ url: process.env.DEPLOY_HOOK_URL ?? "log:" })],
    }),
  ],
  // SPIKE: allow build-time optimisation of media served by the EmDash media route
  image: { domains: ["127.0.0.1"] },
  devToolbar: { enabled: false },
});
