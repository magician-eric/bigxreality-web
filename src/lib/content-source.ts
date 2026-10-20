/**
 * Where content comes from at build time (BXR_CONTENT_SOURCE):
 * - "emdash"    production: published entries from the EmDash CMS (Cloudflare D1/R2)
 * - "markdown"  src/content Markdown, the phase 1 files kept as a backup; default for local builds
 * - "fixtures"  TEST FIXTURE content in tests/fixtures/content (falls back to src/content per
 *               collection); every page is noindex and nothing is listed in the sitemap
 * Workers Builds (WORKERS_CI=1) refuses anything but "emdash", so test or backup content
 * can never reach production.
 */
export type ContentSource = "emdash" | "markdown" | "fixtures";

export function contentSource(): ContentSource {
  const v = process.env.BXR_CONTENT_SOURCE ?? "markdown";
  if (v !== "emdash" && v !== "markdown" && v !== "fixtures") throw new Error(`BXR_CONTENT_SOURCE must be emdash, markdown or fixtures (got "${v}")`);
  if (process.env.WORKERS_CI && v !== "emdash") throw new Error(`Production builds must read content from EmDash (BXR_CONTENT_SOURCE=emdash), got "${v}"`);
  return v;
}

export const isFixtureBuild = () => contentSource() === "fixtures";
