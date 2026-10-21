/**
 * Astro Content Layer loader: reads PUBLISHED entries from EmDash at build time and
 * hands them to the Zod schemas in src/content.config.ts in exactly the shape the
 * Markdown backup files have, so pages and lib/content.ts work with either source.
 *
 * - Entry ids are `<lang>/<slug>` (lang = URL segment); every language uses the tw slug.
 * - Relations come from the tw entry and are copied to its translations; links to
 *   unpublished entries are dropped (they would otherwise point at missing pages).
 * - Images used by published entries are downloaded once per build into
 *   src/assets/.emdash-media (field images, optimised by Astro) and public/media
 *   (images inside rich text). Neither folder is committed.
 */
import type { Loader } from "astro/loaders";
import { mkdir, writeFile, access } from "node:fs/promises";
import path from "node:path";
import { CMS_LOCALES, SOURCE_LOCALE, cmsFile, cmsGet, groupSlugs, listPublished, type Json, type UrlLang } from "./client";
import { portableTextToHtml, portableTextToPlain } from "./portable-text";

const PENDING = "[待提供]";
const ASSET_DIR = "src/assets/.emdash-media";
const PUBLIC_DIR = "public/media";
/** Virtual file every entry claims to come from, so `image()` resolves `./<key>` inside ASSET_DIR. */
const ENTRY_FILE = path.join(ASSET_DIR, "entry.json");
const MEDIA_ROUTE = "/_emdash/api/media/file/";

type Refs = Record<string, string[]>;
interface Ctx {
  item: Json;
  d: Json;
  refs: Refs;
  /** Field image → `./<key>` relative to ENTRY_FILE (downloaded before parsing). */
  image: (m: Json | undefined) => { src: string; alt: string } | undefined;
  structural: Json;
  rich: (blocks: Json[] | undefined) => { html: string; text: string };
}
type Mapped = { data: Json; body?: string; html?: string };

/** Reference field → target collection: `related_news_by` → news, `tags` → tags, … */
function targetOf(field: string): string | undefined {
  if (field === "tags") return "tags";
  const m = /^(?:related|integrated)_(products|solutions|news|insights|case_studies)(?:_by)?$/.exec(field);
  return m?.[1];
}
const REF_TARGET: Record<string, string> = { integrated_products: "products", integrated_by: "products", parent_solution: "solutions" };

const omitEmpty = (o: Json) =>
  Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined && v !== null && v !== "" && !(Array.isArray(v) && v.length === 0)));
const numOrPending = (v: string | undefined) => (v === undefined || v === null || v === "" ? undefined : v === PENDING ? PENDING : Number(v));
const bool = (v: unknown, fallback: boolean) => (v === undefined || v === null ? fallback : v === true || v === 1 || v === "1");
function personnel(v: string | undefined, approx: unknown) {
  if (!v) return undefined;
  if (v === PENDING) return PENDING;
  const [min, max = min] = v.split("-").map(Number);
  return { min, max, approx: bool(approx, false) };
}
const titledList = (v: Json[] | undefined) => v?.map((x) => ({ title: x.title, description: x.description }));
const date = (v: string | null | undefined) => (v ? v : undefined);
function seo(ctx: Ctx) {
  const s = ctx.item.seo ?? {};
  const og = ctx.image(s.image && typeof s.image === "object" ? { ...s.image, alt: "-" } : undefined);
  return omitEmpty({ title: s.title, description: s.description, ogImage: og?.src });
}
/** Flat EmDash fields (landing_*) → the nested `landing` object of the content schema. */
function landingFrom(d: Json, image: Ctx["image"]): Json | undefined {
  if (!d.landing_headline) return undefined;
  /** Image position: the CMS image (downloaded for optimisation) plus its material note and caption. */
  const slot = (x: Json | undefined, img?: Json) => {
    const pic = image(img ?? x?.image);
    const stand = image(x?.substitute);
    return omitEmpty({ src: pic?.src, alt: pic?.alt, need: x?.need, caption: x?.caption, ratio: x?.ratio, kind: x?.kind, status: x?.status, substitute: stand?.src ? { src: stand.src, alt: stand.alt } : undefined });
  };
  const withSlot = (x: Json, keys: string[]) => {
    const base = Object.fromEntries(keys.map((k) => [k, x[k]]).filter(([, v]) => v !== undefined && v !== null && v !== ""));
    const s = slot(x);
    return Object.keys(s).length ? { ...base, image: s } : base;
  };
  const list = (v: Json[] | undefined, keys: string[]) => v?.map((x) => Object.fromEntries(keys.map((k) => [k, x[k]]).filter(([, val]) => val !== undefined && val !== null && val !== "")));
  const opt = (o: Json) => omitEmpty(o);
  return omitEmpty({
    headline: d.landing_headline,
    subheadline: d.landing_subheadline,
    intro: d.landing_intro,
    heroImage: slot({ need: d.landing_hero_need, kind: d.landing_hero_kind, status: d.landing_hero_status, substitute: d.landing_hero_substitute }, d.landing_hero_image),
    ctaLabel: d.landing_cta_label,
    challenge: opt({ title: d.landing_challenge_title, intro: d.landing_challenge_intro, cards: list(d.landing_challenge_cards, ["title", "description"]), note: d.landing_challenge_note }),
    approach: opt({ title: d.landing_approach_title, intro: d.landing_approach_intro, images: d.landing_approach_images?.map((x: Json) => slot(x)), pillars: list(d.landing_approach_pillars, ["title", "description"]) }),
    capabilities: d.landing_capabilities?.length ? opt({ title: d.landing_capabilities_title, intro: d.landing_capabilities_intro, items: d.landing_capabilities.map((x: Json) => withSlot(x, ["title", "content", "value"])) }) : undefined,
    flow: d.landing_flow_steps?.length ? opt({ title: d.landing_flow_title, intro: d.landing_flow_intro, steps: d.landing_flow_steps.map((x: Json) => withSlot(x, ["title", "description", "icon"])), note: d.landing_flow_note }) : undefined,
    scenarios: d.landing_scenarios?.length ? opt({ title: d.landing_scenarios_title, intro: d.landing_scenarios_intro, items: d.landing_scenarios.map((x: Json) => withSlot(x, ["title", "description", "focus"])) }) : undefined,
    values: d.landing_values_cards?.length ? opt({ title: d.landing_values_title, intro: d.landing_values_intro, cards: list(d.landing_values_cards, ["title", "description"]), note: d.landing_values_note }) : undefined,
    casesIntro: d.landing_cases_intro,
    featured: d.landing_featured_title ? opt({ title: d.landing_featured_title, intro: d.landing_featured_intro, items: list(d.landing_featured_items, ["title", "description", "ctaLabel", "solution"]) }) : undefined,
    audience: d.landing_audience_title ? opt({ title: d.landing_audience_title, intro: d.landing_audience_intro, cards: list(d.landing_audience_cards, ["title", "description"]), note: d.landing_audience_note }) : undefined,
    blocks: d.landing_blocks?.length ? d.landing_blocks.map((b: Json) => omitEmpty({ kind: b.kind, eyebrow: b.eyebrow, title: b.title, intro: b.intro, body: b.body, items: blockItems(b.items) })) : undefined,
    related: d.landing_related_title ? opt({ title: d.landing_related_title, intro: d.landing_related_intro }) : undefined,
    closing: opt({ title: d.landing_closing_title, description: d.landing_closing_description }),
  });
}
/** `landing_blocks.items` text: one item per line, `Title || Text || Button || solution:slug|product:slug` (trailing parts optional). */
function blockItems(text: string | undefined) {
  const out = (text ?? "")
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      const [title, content, cta, target] = line.split(/\s*\|\|\s*/);
      const [kind, slug] = (target ?? "").split(":");
      return omitEmpty({ title, content, cta, solution: kind === "solution" ? slug : undefined, product: kind === "product" ? slug : undefined });
    });
  return out.length ? out : undefined;
}
const merge = (...lists: (string[] | undefined)[]) => [...new Set(lists.flatMap((l) => l ?? []))];

function article(ctx: Ctx): Json {
  const { item, d, refs } = ctx;
  return {
    translationStatus: d.translation_status,
    draft: false,
    publishDate: item.publishedAt,
    updatedAt: date(d.updated_on),
    title: d.title,
    summary: d.summary,
    cover: ctx.image(d.cover),
    tags: refs.tags,
    relatedProducts: refs.related_products,
    relatedSolutions: refs.related_solutions,
    relatedNews: merge(refs.related_news, refs.related_news_by),
    relatedInsights: merge(refs.related_insights, refs.related_insights_by),
    relatedCaseStudies: merge(refs.related_case_studies, refs.related_case_studies_by),
    seo: seo(ctx),
  };
}

const MAPPERS: Record<string, (ctx: Ctx) => Mapped> = {
  products(ctx) {
    const { item, d, refs } = ctx;
    const overview = ctx.rich(d.overview);
    const hasDeploy = [d.deploy_personnel, d.deploy_area, d.deploy_setup_time, d.deploy_notes].some((v) => v);
    return {
      body: overview.text,
      html: overview.html,
      data: omitEmpty({
        translationStatus: d.translation_status,
        draft: false,
        publishDate: item.publishedAt,
        order: d.sort_order,
        domains: d.domains,
        hero: omitEmpty({ name: d.title, englishName: d.english_name, code: d.code, tagline: d.tagline, image: ctx.image(d.hero_image) }),
        summary: d.summary,
        landing: landingFrom(d, ctx.image),
        faq: d.faq?.length ? d.faq.map((x: Json) => ({ question: x.question, answer: x.answer })) : undefined,
        capabilities: titledList(d.capabilities),
        howItWorks: titledList(d.how_it_works),
        scenarios: titledList(d.scenarios),
        components: d.components?.map((x: Json) => ({ name: x.name, description: x.description })),
        deployment: hasDeploy
          ? omitEmpty({
              personnel: personnel(d.deploy_personnel, d.deploy_personnel_approx),
              area: numOrPending(d.deploy_area),
              setupTime: numOrPending(d.deploy_setup_time),
              notes: d.deploy_notes,
            })
          : undefined,
        integratedOps:
          d.integrated_ops_description || refs.integrated_products?.length
            ? omitEmpty({ description: d.integrated_ops_description, products: refs.integrated_products })
            : undefined,
        relatedProducts: refs.related_products,
        relatedSolutions: refs.related_solutions,
        cta: d.cta_title
          ? { title: d.cta_title, description: d.cta_description, brochure: bool(d.cta_brochure, true), demo: bool(d.cta_demo, true) }
          : undefined,
        seo: seo(ctx),
      }),
    };
  },
  solutions(ctx) {
    const { d, refs } = ctx;
    const overview = ctx.rich(d.overview);
    return {
      body: overview.text,
      html: overview.html,
      data: omitEmpty({
        translationStatus: d.translation_status,
        draft: false,
        order: d.sort_order,
        domain: d.domain,
        name: d.title,
        englishName: d.english_name,
        summary: d.summary,
        cardLabel: d.card_label,
        cardHeadline: d.card_headline,
        parent: refs.parent_solution?.[0],
        relatedSolutions: refs.related_solutions,
        relatedProducts: refs.related_products,
        landing: landingFrom(d, ctx.image),
        heroDescription: d.hero_description,
        image: ctx.image(d.hero_image),
        challenges: titledList(d.challenges),
        capabilities: titledList(d.capabilities),
        cta: d.cta_title ? { title: d.cta_title, description: d.cta_description } : undefined,
        sourceNote: d.source_note,
        seo: seo(ctx),
      }),
    };
  },
  pages(ctx) {
    const { d, item } = ctx;
    return {
      data: omitEmpty({
        translationStatus: d.translation_status,
        seo: { title: item.seo?.title || d.title, description: item.seo?.description || d.description },
        closing: d.closing_title ? { title: d.closing_title } : undefined,
        highlights: d.highlights_title ? { title: d.highlights_title, items: titledList(d.highlights_items) } : undefined,
        hero: omitEmpty({ eyebrow: d.eyebrow, title: d.title, lead: d.lead, description: d.description, image: ctx.image(d.hero_image), imageCaption: d.image_caption }),
        cta: d.cta_title ? { title: d.cta_title, description: d.cta_description, button: d.cta_button } : undefined,
      }),
    };
  },
  milestones(ctx) {
    const { d } = ctx;
    return { data: omitEmpty({ translationStatus: d.translation_status, draft: false, date: d.date, title: d.title, summary: d.summary, image: ctx.image(d.image) }) };
  },
  team_members(ctx) {
    const { d } = ctx;
    return { data: omitEmpty({ translationStatus: d.translation_status, draft: false, order: d.sort_order, name: d.title, role: d.role, bio: d.bio, photo: ctx.image(d.photo) }) };
  },
  partners(ctx) {
    const { d } = ctx;
    return {
      data: omitEmpty({
        translationStatus: d.translation_status,
        draft: false,
        order: d.sort_order,
        approval: { approved: bool(d.approved, false) },
        category: d.category,
        name: d.title,
        description: d.description,
        logo: ctx.image(d.logo),
        url: d.url,
      }),
    };
  },
  investor_items(ctx) {
    const { d, item } = ctx;
    return {
      data: omitEmpty({
        translationStatus: d.translation_status,
        draft: false,
        publishDate: d.item_date ?? item.publishedAt,
        module: d.module,
        category: d.category,
        order: d.sort_order,
        title: d.title,
        summary: d.summary,
        attachments: d.attachments?.map((a: Json) => ({ label: a.label, url: a.url })),
      }),
    };
  },
  tags({ d }) {
    return { data: omitEmpty({ translationStatus: d.translation_status, name: d.title, description: d.description }) };
  },
  news(ctx) {
    const { d } = ctx;
    const body = ctx.rich(d.body);
    return {
      body: body.text,
      html: body.html,
      data: omitEmpty({
        ...article(ctx),
        category: d.category,
        event: d.event_name && d.event_start ? omitEmpty({ name: d.event_name, location: d.event_location, startDate: d.event_start, endDate: date(d.event_end) }) : undefined,
        source: d.source_name && d.source_url ? { name: d.source_name, url: d.source_url } : undefined,
      }),
    };
  },
  insights(ctx) {
    const body = ctx.rich(ctx.d.body);
    return { body: body.text, html: body.html, data: omitEmpty({ ...article(ctx), author: ctx.d.author, technologyTags: ctx.structural.technology_tags ?? [] }) };
  },
  case_studies(ctx) {
    const { d } = ctx;
    const body = ctx.rich(d.body);
    return {
      body: body.text,
      html: body.html,
      data: omitEmpty({
        ...article(ctx),
        client: { name: d.client_name, type: d.client_type, disclosure: d.client_disclosure },
        approval: { approved: bool(d.approved, false) },
        background: d.background,
        challenge: d.challenge,
        solution: d.solution,
        application: d.application,
        results: d.results,
        outcomes: d.outcomes?.map((o: Json) => ({ label: o.label, value: o.value })),
        gallery: d.gallery
          ?.map((x: Json) => {
            const pic = ctx.image(x.image);
            return pic?.src ? omitEmpty({ src: pic.src, alt: pic.alt, caption: x.caption }) : undefined;
          })
          .filter(Boolean),
        domains: d.domains,
      }),
    };
  },
};

/** The reference fields of one tw entry, as canonical slugs of published targets. */
async function references(collection: string, id: string): Promise<Refs> {
  const full = await cmsGet(`/content/${collection}/${id}`);
  const out: Refs = {};
  for (const [field, ref] of Object.entries((full.item.references ?? {}) as Record<string, Json>)) {
    const target = REF_TARGET[field] ?? targetOf(field);
    if (!target) continue;
    const published = await groupSlugs(target);
    out[field] = (ref.children ?? [])
      .slice()
      .sort((a: Json, b: Json) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
      .map((c: Json) => published.get(c.translationGroup))
      .filter((s: string | undefined): s is string => !!s);
  }
  return out;
}

export function emdashLoader(collection: string): Loader {
  const map = MAPPERS[collection];
  if (!map) throw new Error(`No EmDash mapping for collection "${collection}"`);
  return {
    name: `emdash:${collection}`,
    async load({ store, parseData, generateDigest, logger }) {
      await mkdir(ASSET_DIR, { recursive: true });
      await mkdir(PUBLIC_DIR, { recursive: true });
      const downloads = new Map<string, Promise<void>>();
      const fetchOnce = (key: string, dest: string) => {
        if (!downloads.has(dest)) {
          downloads.set(dest, access(dest).catch(async () => {
            await mkdir(path.dirname(dest), { recursive: true });
            await writeFile(dest, await cmsFile(`${MEDIA_ROUTE}${key}`));
          }));
        }
      };
      const image: Ctx["image"] = (m) => {
        const key = m?.meta?.storageKey ?? (typeof m?.src === "string" && m.src.startsWith(MEDIA_ROUTE) ? m.src.slice(MEDIA_ROUTE.length) : undefined);
        if (!key) return undefined;
        fetchOnce(key, path.join(ASSET_DIR, key));
        return { src: `./${key}`, alt: m!.alt };
      };
      const rich: Ctx["rich"] = (blocks) => ({
        text: portableTextToPlain(blocks),
        html: portableTextToHtml(blocks, (b) => {
          const url: string | undefined = b.asset?.url;
          if (!url?.startsWith(MEDIA_ROUTE)) return undefined;
          const key = url.slice(MEDIA_ROUTE.length);
          fetchOnce(key, path.join(PUBLIC_DIR, key));
          return { src: `/media/${key}`, width: b.width, height: b.height };
        }),
      });

      const slugByGroup = await groupSlugs(collection);
      const sourceDataByGroup = new Map<string, Json>();
      const refsByGroup = new Map<string, Refs>();
      for (const item of await listPublished(collection, SOURCE_LOCALE)) {
        refsByGroup.set(item.translationGroup, await references(collection, item.id));
        sourceDataByGroup.set(item.translationGroup, item.data ?? {});
      }

      store.clear();
      let count = 0;
      for (const [lang, locale] of Object.entries(CMS_LOCALES) as [UrlLang, string][]) {
        for (const item of await listPublished(collection, locale)) {
          const slug = slugByGroup.get(item.translationGroup) ?? item.slug;
          const ctx: Ctx = { item, d: item.data ?? {}, refs: refsByGroup.get(item.translationGroup) ?? {}, structural: sourceDataByGroup.get(item.translationGroup) ?? {}, image, rich };
          const { data, body, html } = map(ctx);
          await Promise.all(downloads.values());
          const id = `${lang}/${slug}`;
          const parsed = await parseData({ id, data, filePath: ENTRY_FILE });
          store.set({
            id,
            data: parsed,
            body,
            filePath: ENTRY_FILE,
            digest: generateDigest({ data, body: body ?? "", html: html ?? "" }),
            ...(html !== undefined ? { rendered: { html } } : {}),
          });
          count++;
        }
      }
      await Promise.all(downloads.values());
      // Never deploy an empty site: an EmDash build before the content import is a setup mistake.
      if (collection === "products" && count === 0) {
        throw new Error("EmDash has no published products. Import the content first (npm run cms:import, docs/DEPLOY.md §2.4); until then deploy with BXR_CONTENT_SOURCE=bootstrap.");
      }
      logger.info(`${count} published entries from EmDash`);
    },
  };
}
