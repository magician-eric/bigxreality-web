import type { APIRoute } from "astro";
import { getEntry } from "astro:content";
import { HREFLANG, LANGS, DEFAULT_LANG, segmentOf, type Lang } from "../i18n";
import { ARTICLE_COLLECTIONS, getLocalized } from "../lib/content";
import { articlesWithTag, getArticles, pageSize, paginate, TAG_INDEX_MIN } from "../lib/articles";
import { isNoIndexBuild } from "../lib/content-source";
import { site } from "../lib/site";

/*
 * Lists every built page that may be indexed, with hreflang alternates. Each page
 * type applies the same rule its template uses for `noindex`:
 * - translation pending → out (owner decision 2026-10-19)
 * - list with no articles → out; tag page with fewer than TAG_INDEX_MIN articles → out
 * - search page → never; TEST FIXTURE and bootstrap builds → empty sitemap
 * tests/ (qa:sitemap) checks that this list equals the built pages without noindex.
 */
interface Page { lang: Lang; path: string; alternates: Lang[] }

export const GET: APIRoute = async () => {
  const pages: Page[] = [];
  /** Adds one URL pattern for every language in which it is indexable. */
  const add = (path: string, langs: Lang[]) => {
    for (const lang of langs) pages.push({ lang, path, alternates: langs });
  };
  const copyOk = async (page: string, l: Lang) => (await getEntry("pages", `${l}/${page}`))?.data.translationStatus !== "pending";
  const filter = async (test: (l: Lang) => Promise<boolean>) => {
    const ok = await Promise.all(LANGS.map(test));
    return LANGS.filter((_, i) => ok[i]);
  };

  if (!isNoIndexBuild()) {
    add("/{lang}/products/", await filter((l) => copyOk("products", l)));
    add("/{lang}/solutions/", await filter((l) => copyOk("solutions", l)));
    add("/{lang}/contact/", await filter((l) => copyOk("contact", l)));
    add("/{lang}/company/", await filter((l) => copyOk("company", l)));

    for (const collection of ["products", "solutions"] as const) {
      const indexable = new Map<string, Lang[]>();
      for (const lang of LANGS) {
        for (const e of await getLocalized(collection, lang)) if (!e.pendingTranslation) indexable.set(e.slug, [...(indexable.get(e.slug) ?? []), lang]);
      }
      for (const [slug, langs] of indexable) add(`/{lang}/${collection}/${slug}/`, langs);
    }

    for (const collection of ARTICLE_COLLECTIONS) {
      const pageCount = new Map<Lang, number>();
      for (const l of LANGS) {
        const all = await getArticles(collection, l);
        if (all.length && (await copyOk(collection, l))) pageCount.set(l, paginate(all, pageSize(collection)).length);
      }
      const maxPages = Math.max(0, ...pageCount.values());
      for (let n = 1; n <= maxPages; n++) {
        add(n === 1 ? `/{lang}/${segmentOf(collection)}/` : `/{lang}/${segmentOf(collection)}/page/${n}/`, LANGS.filter((l) => (pageCount.get(l) ?? 0) >= n));
      }
      const indexable = new Map<string, Lang[]>();
      for (const lang of LANGS) {
        for (const a of await getArticles(collection, lang)) if (!a.pendingTranslation) indexable.set(a.slug, [...(indexable.get(a.slug) ?? []), lang]);
      }
      for (const [slug, langs] of indexable) add(`/{lang}/${segmentOf(collection)}/${slug}/`, langs);
    }

    const tagPages = new Map<string, Lang[]>();
    const tagIndex: Lang[] = [];
    for (const lang of LANGS) {
      let any = false;
      for (const t of await getLocalized("tags", lang)) {
        const n = (await articlesWithTag(t.slug, lang)).length;
        if (n > 0) any = true;
        if (n >= TAG_INDEX_MIN && !t.pendingTranslation) tagPages.set(t.slug, [...(tagPages.get(t.slug) ?? []), lang]);
      }
      if (any && (await copyOk("tags", lang))) tagIndex.push(lang);
    }
    add("/{lang}/tags/", tagIndex);
    for (const [slug, langs] of tagPages) add(`/{lang}/tags/${slug}/`, langs);
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
