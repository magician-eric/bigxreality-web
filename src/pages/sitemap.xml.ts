import type { APIRoute } from "astro";
import { HREFLANG, LANGS, DEFAULT_LANG, type Lang } from "../i18n";
import { getLocalized } from "../lib/content";
import { getEntry } from "astro:content";
import { site } from "../lib/site";

/*
 * Lists every built page that may be indexed, with hreflang alternates.
 * Pages whose translation is pending are noindex and left out (owner decision 2026-10-19).
 */
interface Page { lang: Lang; path: string; alternates: Lang[] }

export const GET: APIRoute = async () => {
  const pages: Page[] = [];

  const overviewOk = await Promise.all(LANGS.map(async (l) => (await getEntry("pages", `${l}/products`))?.data.translationStatus !== "pending"));
  const overviewLangs = LANGS.filter((_, i) => overviewOk[i]);
  for (const lang of overviewLangs) pages.push({ lang, path: "/{lang}/products/", alternates: overviewLangs });

  const indexable = new Map<string, Lang[]>();
  for (const lang of LANGS) {
    for (const p of await getLocalized("products", lang)) {
      if (p.pendingTranslation) continue;
      indexable.set(p.slug, [...(indexable.get(p.slug) ?? []), lang]);
    }
  }
  for (const [slug, langs] of indexable) {
    for (const lang of langs) pages.push({ lang, path: `/{lang}/products/${slug}/`, alternates: langs });
  }

  const abs = (path: string, l: Lang) => new URL(path.replace("{lang}", l), site.url).toString();
  const body = pages
    .map((p) => {
      const alts = p.alternates.map((l) => `    <xhtml:link rel="alternate" hreflang="${HREFLANG[l]}" href="${abs(p.path, l)}"/>`);
      if (p.alternates.includes(DEFAULT_LANG)) alts.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${abs(p.path, DEFAULT_LANG)}"/>`);
      return `  <url>\n    <loc>${abs(p.path, p.lang)}</loc>\n${alts.join("\n")}\n  </url>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${body}\n</urlset>\n`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
};
