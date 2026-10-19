/**
 * SPIKE (K2): Astro Content Layer loader that reads PUBLISHED EmDash content over the
 * public REST contract and hands it to the existing Zod schemas in content.config.ts.
 * Entry ids keep the phase 1 shape `<lang>/<slug>` (lang = URL segment en / tw / jp),
 * so lib/content.ts, relation validation and every page stay unchanged.
 */
import type { Loader } from "astro/loaders";
import { mkdir, writeFile, access } from "node:fs/promises";
import path from "node:path";

/** Media used by published entries is downloaded here at build time so Astro can
 * optimise it like any local asset (AVIF/WebP, widths). Not committed. */
const MEDIA_DIR = "src/assets/.emdash-media";

const LOCALES = { en: "en", tw: "zh-TW", jp: "ja" } as const; // URL segment → EmDash locale
const PENDING = "[待提供]";
type Lang = keyof typeof LOCALES;
type Json = Record<string, any>;

const base = () => (process.env.EMDASH_URL ?? "http://127.0.0.1:4400").replace(/\/$/, "");
async function get(path: string): Promise<Json> {
  const token = process.env.EMDASH_TOKEN;
  if (!token) throw new Error("EMDASH_TOKEN is not set (read-only token with content:read scope)");
  const r = await fetch(`${base()}/_emdash/api${path}`, { headers: { authorization: `Bearer ${token}` } });
  const j = await r.json();
  if (!r.ok || j.success === false) throw new Error(`EmDash ${path}: ${r.status} ${JSON.stringify(j.error ?? j)}`);
  return j.data;
}
async function listPublished(collection: string, locale: string): Promise<Json[]> {
  const items: Json[] = [];
  let cursor: string | undefined;
  do {
    const q = new URLSearchParams({ status: "published", locale, limit: "100", ...(cursor ? { cursor } : {}) });
    const page = await get(`/content/${collection}?${q}`);
    items.push(...page.items);
    cursor = page.nextCursor ?? undefined;
  } while (cursor);
  return items;
}
const slugs = (ref: Json | undefined) => (ref?.children ?? []).map((c: Json) => c.slug as string);
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
/** Portable Text → HTML for the block types phase 1 content uses (paragraphs). */
function ptHtml(blocks: Json[] | undefined): { text: string; html: string } {
  const paras = (blocks ?? []).filter((b) => b._type === "block").map((b) => (b.children ?? []).map((c: Json) => c.text ?? "").join(""));
  return { text: paras.join("\n\n"), html: paras.map((p) => `<p>${esc(p)}</p>`).join("\n") };
}
const numOrPending = (v: string | undefined) => (v === undefined ? undefined : v === PENDING ? PENDING : Number(v));
function personnel(v: string | undefined, approx: boolean) {
  if (v === undefined) return undefined;
  if (v === PENDING) return PENDING;
  const [min, max = min] = v.split("-").map(Number);
  return { min, max, approx };
}
const omitEmpty = (o: Json) => Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined && !(Array.isArray(v) && v.length === 0)));

type Mapper = (item: Json, refs: Json, mediaUrl: (m: Json | undefined) => string | undefined) => { data: Json; body?: string; html?: string };

const mappers: Record<string, Mapper> = {
  products: (it, refs, mediaUrl) => {
    const d = it.data;
    const ov = ptHtml(d.overview);
    const img = mediaUrl(d.hero_image);
    return {
      body: ov.text,
      html: ov.html,
      data: omitEmpty({
        translationStatus: d.translation_status, draft: false,
        publishDate: it.publishedAt, order: d.sort_order, domains: d.domains,
        hero: omitEmpty({ name: d.title, englishName: d.english_name, code: d.code, tagline: d.tagline, image: img ? { src: img, alt: d.hero_image.alt } : undefined }),
        summary: d.summary, capabilities: d.capabilities, howItWorks: d.how_it_works, scenarios: d.scenarios, components: d.components,
        integratedScenarios: slugs(refs.integrated_scenarios),
        deployment: d.deploy_personnel === undefined && d.deploy_area === undefined && d.deploy_setup_time === undefined ? undefined
          : omitEmpty({ personnel: personnel(d.deploy_personnel, !!d.deploy_personnel_approx), area: numOrPending(d.deploy_area), setupTime: numOrPending(d.deploy_setup_time) }),
        integratedOps: d.integrated_ops_description || slugs(refs.integrated_products).length
          ? omitEmpty({ description: d.integrated_ops_description, products: slugs(refs.integrated_products) }) : undefined,
        relatedSolutions: slugs(refs.related_solutions),
        cta: d.cta_title ? { title: d.cta_title, description: d.cta_description, brochure: Boolean(d.cta_brochure ?? true), demo: Boolean(d.cta_demo ?? true) } : undefined,
      }),
    };
  },
  solutions: (it) => ({ data: omitEmpty({ translationStatus: it.data.translation_status, draft: false, order: it.data.sort_order, domain: it.data.domain, name: it.data.title, englishName: it.data.english_name, summary: it.data.summary }) }),
  scenarios: (it, refs) => ({ data: omitEmpty({ translationStatus: it.data.translation_status, draft: false, order: it.data.sort_order, code: it.data.code, name: it.data.title, englishName: it.data.english_name, summary: it.data.summary, products: slugs(refs.products) }) }),
};

export function emdashLoader(collection: keyof typeof mappers): Loader {
  return {
    name: `emdash:${collection}`,
    async load({ store, parseData, generateDigest, logger }) {
      await mkdir(MEDIA_DIR, { recursive: true });
      const downloads: Promise<void>[] = [];
      // returns a path relative to the entry's virtual file (MEDIA_DIR/entry.json)
      const mediaUrl = (m: Json | undefined) => {
        const key = m?.meta?.storageKey;
        if (!key) return undefined;
        const dest = path.join(MEDIA_DIR, key);
        downloads.push(access(dest).catch(async () => {
          const r = await fetch(`${base()}/_emdash/api/media/file/${key}`);
          if (!r.ok) throw new Error(`media ${key}: ${r.status}`);
          await writeFile(dest, Buffer.from(await r.arrayBuffer()));
        }));
        return `./${key}`;
      };
      store.clear();
      let count = 0;
      for (const [lang, locale] of Object.entries(LOCALES) as [Lang, string][]) {
        for (const item of await listPublished(collection, locale)) {
          // references are not in list responses; read them per entry
          const full = await get(`/content/${collection}/${item.id}`);
          const { data, body, html } = mappers[collection](item, full.item.references ?? {}, mediaUrl);
          const id = `${lang}/${item.slug}`;
          await Promise.all(downloads.splice(0));
          const parsed2 = await parseData({ id, data, filePath: path.join(MEDIA_DIR, "entry.json") });
          store.set({ id, data: parsed2, body, filePath: path.join(MEDIA_DIR, "entry.json"), digest: generateDigest({ data, body }), ...(html !== undefined ? { rendered: { html } } : {}) });
          count++;
        }
      }
      logger.info(`${count} published entries from EmDash`);
    },
  };
}
