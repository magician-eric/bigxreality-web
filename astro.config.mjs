// @ts-check
import { defineConfig } from "astro/config";
import i18nCoverage from "./src/integrations/i18n-coverage.mjs";

export default defineConfig({
  site: "https://www.bigxreality.com",
  trailingSlash: "always",
  build: { format: "directory" },
  // Static output writes a meta-refresh page; Cloudflare `_redirects` turns it into a 301 in phase 2.
  redirects: { "/": "/en/" },
  integrations: [i18nCoverage()],
  devToolbar: { enabled: false },
});
