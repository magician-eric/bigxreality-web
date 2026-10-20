/**
 * Where content comes from at build time (BXR_CONTENT_SOURCE):
 * - "emdash"     production: published entries from the EmDash CMS (Cloudflare D1/R2)
 * - "bootstrap"  first deployment only: the Markdown in src/content, so the Worker (and with it
 *                the EmDash admin) can go live before the CMS has any content. Every page is
 *                noindex and robots.txt blocks crawlers. scripts/cms/check-source.mjs refuses
 *                it once the CMS has an admin account (docs/DEPLOY.md §2.4).
 * - "markdown"   src/content Markdown, the phase 1 files kept as a backup; default for local builds
 * - "fixtures"   TEST FIXTURE content in tests/fixtures/content (falls back to src/content per
 *                collection); every page is noindex and nothing is listed in the sitemap
 * Workers Builds (WORKERS_CI=1) accepts only "emdash" and "bootstrap", so test content and
 * the Markdown backup can never become the production site.
 */
export type ContentSource = "emdash" | "bootstrap" | "markdown" | "fixtures";
const SOURCES: readonly string[] = ["emdash", "bootstrap", "markdown", "fixtures"];
const PRODUCTION_SOURCES: readonly string[] = ["emdash", "bootstrap"];

declare const __BXR_CONTENT_SOURCE__: string | undefined;
declare const __BXR_WORKERS_CI__: boolean | undefined;
declare const __BXR_PREVIEW__: boolean | undefined;

/** Pure rule, exported for tests. */
export function resolveContentSource(value: string | undefined, ci: boolean): ContentSource {
  const v = value ?? "markdown";
  if (!SOURCES.includes(v)) throw new Error(`BXR_CONTENT_SOURCE must be emdash, bootstrap, markdown or fixtures (got "${v}")`);
  if (ci && !PRODUCTION_SOURCES.includes(v)) {
    throw new Error(`Production builds must read content from EmDash (BXR_CONTENT_SOURCE=emdash; bootstrap only for the first deployment), got "${v}"`);
  }
  return v as ContentSource;
}

export function contentSource(): ContentSource {
  const v = typeof __BXR_CONTENT_SOURCE__ === "string" ? __BXR_CONTENT_SOURCE__ : process.env.BXR_CONTENT_SOURCE;
  const ci = typeof __BXR_WORKERS_CI__ === "boolean" ? __BXR_WORKERS_CI__ : !!process.env.WORKERS_CI;
  return resolveContentSource(v, ci);
}

/** BXR_PREVIEW=1: the GitHub Pages review site (docs/PREVIEW.md), never indexed. */
export const isPreviewBuild = () => (typeof __BXR_PREVIEW__ === "boolean" ? __BXR_PREVIEW__ : process.env.BXR_PREVIEW === "1");
/** Builds that must never be indexed: test fixtures, the temporary bootstrap site and the preview site. */
export const isNoIndexBuild = () => isPreviewBuild() || ["fixtures", "bootstrap"].includes(contentSource());

/**
 * Bootstrap is allowed only while the CMS has not been set up. `status` is the parsed
 * response of GET <EMDASH_URL>/_emdash/api/setup/status, or null when the Worker does not
 * exist yet / cannot be reached (the very first deployment). Exported for tests.
 */
export function bootstrapDecision(status: { success?: boolean; data?: { needsSetup?: boolean } } | null): { ok: true } | { ok: false; reason: string } {
  if (status?.success && status.data?.needsSetup === false) {
    return {
      ok: false,
      reason:
        "The EmDash CMS is already set up (an admin account exists), so the bootstrap build is no longer allowed. " +
        "Import the content (npm run cms:import), then set BXR_CONTENT_SOURCE=emdash with EMDASH_URL and EMDASH_TOKEN (docs/DEPLOY.md §2.4).",
    };
  }
  return { ok: true };
}
