#!/usr/bin/env node
// One-time migration: copy the Markdown content in src/content (and src/data/site.json)
// into EmDash, then publish it with the original dates. The Markdown files are NOT
// changed or deleted; they stay in git as the backup (BXR_CONTENT_SOURCE=markdown).
//
//   npm run cms:import                    # local `astro dev` (dev-bypass login)
//   EMDASH_URL=https://… EMDASH_TOKEN=… npm run cms:import
//                                         # token scopes: content:read content:write media:read media:write
//   … -- --dry-run                        # only list what would be created
//   … -- --root tests/fixtures/content    # import TEST FIXTURE content (local only)
//
// Safe to run again: entries that already exist (same collection, locale and slug)
// are left untouched, so editors' changes in the CMS are never overwritten.
import { readFile, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import YAML from "yaml";
import { marked } from "marked";
import { connect, api, listAll, LOCALES, LANG_ORDER, BASE } from "./lib.mjs";

const args = process.argv.slice(2);
const DRY = args.includes("--dry-run");
const rootArg = args.includes("--root") ? args[args.indexOf("--root") + 1] : undefined;
const REPO = path.resolve(import.meta.dirname, "../..");
const ROOTS = [rootArg && path.resolve(REPO, rootArg), path.join(REPO, "src/content")].filter(Boolean);
if (rootArg && !/^http:\/\/(127\.0\.0\.1|localhost)/.test(BASE)) throw new Error("--root (test fixtures) may only be imported into a local CMS");
const PENDING = "[待提供]";

// ---------------------------------------------------------------- Markdown → Portable Text
let n = 0;
const key = () => `k${(n++).toString(36)}`;
function inline(tokens, markDefs, marks = []) {
  const out = [];
  for (const t of tokens ?? []) {
    if (t.type === "text" && t.tokens) out.push(...inline(t.tokens, markDefs, marks));
    else if (t.type === "text" || t.type === "escape") out.push({ _type: "span", _key: key(), text: decode(t.text), marks });
    else if (t.type === "strong") out.push(...inline(t.tokens, markDefs, [...marks, "strong"]));
    else if (t.type === "em") out.push(...inline(t.tokens, markDefs, [...marks, "em"]));
    else if (t.type === "del") out.push(...inline(t.tokens, markDefs, [...marks, "strike-through"]));
    else if (t.type === "codespan") out.push({ _type: "span", _key: key(), text: decode(t.text), marks: [...marks, "code"] });
    else if (t.type === "br") out.push({ _type: "span", _key: key(), text: "\n", marks });
    else if (t.type === "link") {
      const k = key();
      markDefs.push({ _type: "link", _key: k, href: t.href });
      out.push(...inline(t.tokens, markDefs, [...marks, k]));
    } else out.push({ _type: "span", _key: key(), text: decode(t.raw), marks });
  }
  return out;
}
const decode = (s) => s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'");
function textBlock(tokens, extra = {}) {
  const markDefs = [];
  const children = inline(tokens, markDefs);
  return { _type: "block", _key: key(), style: "normal", markDefs, children: children.length ? children : [{ _type: "span", _key: key(), text: "", marks: [] }], ...extra };
}
async function toPortableText(md, file, upload) {
  const blocks = [];
  const walk = async (tokens, list) => {
    for (const t of tokens) {
      if (t.type === "space" || t.type === "hr" || t.type === "html") continue;
      if (t.type === "heading") blocks.push(textBlock(t.tokens, { style: `h${Math.min(Math.max(t.depth, 2), 4)}` }));
      else if (t.type === "paragraph") {
        const img = t.tokens.length === 1 && t.tokens[0].type === "image" ? t.tokens[0] : null;
        if (img) {
          const m = await upload(path.resolve(path.dirname(file), img.href), img.text);
          blocks.push({ _type: "image", _key: key(), asset: { _ref: m.id, url: m.url }, alt: img.text, ...(m.width ? { width: m.width, height: m.height } : {}) });
        } else blocks.push(textBlock(t.tokens, list ?? {}));
      } else if (t.type === "blockquote") {
        for (const p of t.tokens.filter((x) => x.type === "paragraph")) blocks.push(textBlock(p.tokens, { style: "blockquote" }));
      } else if (t.type === "code") blocks.push({ _type: "code", _key: key(), code: t.text, ...(t.lang ? { language: t.lang } : {}) });
      else if (t.type === "list") {
        const level = (list?.level ?? 0) + 1;
        for (const item of t.items) {
          const [first, ...rest] = item.tokens;
          const lead = first?.type === "text" || first?.type === "paragraph" ? first : null;
          blocks.push(textBlock(lead ? lead.tokens ?? [{ type: "text", text: lead.text }] : [], { listItem: t.ordered ? "number" : "bullet", level }));
          await walk(lead ? rest : item.tokens, { listItem: t.ordered ? "number" : "bullet", level });
        }
      } else if (t.type === "text") blocks.push(textBlock(t.tokens ?? [{ type: "text", text: t.text }], list ?? {}));
    }
  };
  await walk(marked.lexer(md.trim()));
  return blocks;
}

// ---------------------------------------------------------------- reading Markdown
async function readCollection(folder) {
  const out = {}; // slug → lang → { fm, body, file }
  for (const root of ROOTS) {
    const dir = path.join(root, folder);
    if (!existsSync(dir)) continue;
    for (const lang of LANG_ORDER) {
      if (!existsSync(path.join(dir, lang))) continue;
      for (const f of await readdir(path.join(dir, lang))) {
        if (!f.endsWith(".md")) continue;
        const slug = f.slice(0, -3);
        if (out[slug]?.[lang]) continue; // the first root wins (fixtures before src/content)
        const file = path.join(dir, lang, f);
        const [, fm, ...rest] = (await readFile(file, "utf8")).split(/^---$/m);
        (out[slug] ??= {})[lang] = { fm: YAML.parse(fm), body: rest.join("---").trim(), file };
      }
    }
    if (Object.keys(out).length) break; // a collection comes from one root only
  }
  return out;
}

// ---------------------------------------------------------------- media
const uploaded = new Map();
async function upload(file, alt) {
  if (!uploaded.has(file)) {
    if (DRY) uploaded.set(file, { id: "dry-run" });
    else {
      const fd = new FormData();
      const type = file.endsWith(".png") ? "image/png" : file.endsWith(".webp") ? "image/webp" : "image/jpeg";
      fd.append("file", new Blob([await readFile(file)], { type }), path.basename(file));
      fd.append("alt", alt);
      const r = await api("POST", "/media", fd);
      const item = r.item ?? r;
      uploaded.set(file, { id: item.id, url: item.url, width: item.width, height: item.height });
    }
  }
  return uploaded.get(file);
}
const image = async (pic, file) => (pic?.src ? { id: (await upload(path.resolve(path.dirname(file), pic.src), pic.alt)).id, alt: pic.alt } : undefined);

// ---------------------------------------------------------------- field mapping (inverse of src/lib/emdash/loader.ts)
const clean = (o) => Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined));
const day = (d) => (d === undefined ? undefined : new Date(d).toISOString());
const seoOf = (s) => (s && (s.title || s.description) ? clean({ title: s.title, description: s.description }) : undefined);

async function articleBase(fm, body, file) {
  return clean({
    title: fm.title,
    translation_status: fm.translationStatus,
    summary: fm.summary,
    cover: await image(fm.cover, file),
    body: await toPortableText(body, file, upload),
    updated_on: day(fm.updatedAt),
    review_status: "approved",
  });
}

/** Nested `landing` block of a product → flat EmDash landing_* fields (inverse of loader.ts landingFrom). */
async function landingFields(L, file) {
  if (!L) return {};
  const slot = async (x) => clean({ image: await image(x, file), need: x?.need, caption: x?.caption, ratio: x?.ratio, kind: x?.kind, status: x?.status, substitute: await image(x?.substitute, file) });
  const withSlot = async (x, keys) => ({ ...Object.fromEntries(keys.filter((k) => x[k] !== undefined).map((k) => [k, x[k]])), ...(x.image ? await slot(x.image) : {}) });
  const all = (list, f) => (list ? Promise.all(list.map(f)) : undefined);
  const hero = L.heroImage ? await slot(L.heroImage) : {};
  return clean({
    landing_headline: L.headline, landing_subheadline: L.subheadline, landing_intro: L.intro, landing_cta_label: L.ctaLabel,
    landing_hero_image: hero.image, landing_hero_need: hero.need, landing_hero_kind: hero.kind, landing_hero_status: hero.status, landing_hero_substitute: hero.substitute,
    landing_challenge_title: L.challenge?.title, landing_challenge_intro: L.challenge?.intro, landing_challenge_cards: L.challenge?.cards, landing_challenge_note: L.challenge?.note,
    landing_approach_title: L.approach?.title, landing_approach_intro: L.approach?.intro, landing_approach_images: await all(L.approach?.images, slot), landing_approach_pillars: L.approach?.pillars,
    landing_capabilities_title: L.capabilities?.title, landing_capabilities_intro: L.capabilities?.intro, landing_capabilities: await all(L.capabilities?.items, (x) => withSlot(x, ["title", "content", "value"])),
    landing_flow_title: L.flow?.title, landing_flow_intro: L.flow?.intro, landing_flow_steps: await all(L.flow?.steps, (x) => withSlot(x, ["title", "description", "icon"])), landing_flow_note: L.flow?.note,
    landing_scenarios_title: L.scenarios?.title, landing_scenarios_intro: L.scenarios?.intro, landing_scenarios: await all(L.scenarios?.items, (x) => withSlot(x, ["title", "description", "focus"])),
    landing_values_title: L.values?.title, landing_values_intro: L.values?.intro, landing_values_cards: L.values?.cards, landing_values_note: L.values?.note,
    landing_cases_intro: L.casesIntro,
    landing_related_title: L.related?.title, landing_related_intro: L.related?.intro,
    landing_closing_title: L.closing?.title, landing_closing_description: L.closing?.description,
  });
}

const MAP = {
  products: async ({ fm: d, body, file }) => {
    const dep = d.deployment ?? {};
    const personnel = dep.personnel === undefined ? undefined : typeof dep.personnel === "string" ? dep.personnel : dep.personnel.min === dep.personnel.max ? String(dep.personnel.min) : `${dep.personnel.min}-${dep.personnel.max}`;
    return {
      data: clean({
        title: d.hero.name, english_name: d.hero.englishName, code: d.hero.code, tagline: d.hero.tagline,
        translation_status: d.translationStatus, review_status: "approved",
        hero_image: await image(d.hero.image, file),
        summary: d.summary,
        ...(await landingFields(d.landing, file)),
        overview: await toPortableText(body, file, upload),
        capabilities: d.capabilities, how_it_works: d.howItWorks, scenarios: d.scenarios, components: d.components,
        deploy_personnel: personnel, deploy_personnel_approx: personnel ? !!dep.personnel?.approx : undefined,
        deploy_area: dep.area === undefined ? undefined : String(dep.area),
        deploy_setup_time: dep.setupTime === undefined ? undefined : String(dep.setupTime),
        deploy_notes: dep.notes,
        integrated_ops_description: d.integratedOps?.description,
        domains: d.domains, sort_order: d.order,
        cta_title: d.cta?.title, cta_description: d.cta?.description, cta_brochure: d.cta?.brochure, cta_demo: d.cta?.demo,
      }),
      seo: seoOf(d.seo),
      publishedAt: day(d.publishDate),
    };
  },
  solutions: async ({ fm: d, body, file }) => ({
    data: clean({
      title: d.name, english_name: d.englishName, domain: d.domain, summary: d.summary, sort_order: d.order,
      translation_status: d.translationStatus, review_status: "approved",
      hero_description: d.heroDescription, hero_image: await image(d.image, file),
      overview: body ? await toPortableText(body, file, upload) : undefined,
      challenges: d.challenges, capabilities: d.capabilities,
      cta_title: d.cta?.title, cta_description: d.cta?.description, source_note: d.sourceNote,
    }),
    seo: seoOf(d.seo),
  }),
  scenarios: async ({ fm: d }) => ({
    data: clean({ title: d.name, code: d.code, english_name: d.englishName, summary: d.summary, sort_order: d.order, translation_status: d.translationStatus }),
  }),
  pages: async ({ fm: d, file }) => ({
    data: clean({
      title: d.hero.title, translation_status: d.translationStatus, eyebrow: d.hero.eyebrow, lead: d.hero.lead, description: d.hero.description,
      hero_image: await image(d.hero.image, file), image_caption: d.hero.imageCaption,
      integrated_eyebrow: d.integrated?.eyebrow, integrated_title: d.integrated?.title, integrated_description: d.integrated?.description,
      cta_title: d.cta?.title, cta_description: d.cta?.description,
    }),
    seo: seoOf(d.seo),
  }),
  tags: async ({ fm: d }) => ({ data: clean({ title: d.name, translation_status: d.translationStatus, description: d.description }) }),
  news: async ({ fm: d, body, file }) => ({
    data: clean({
      ...(await articleBase(d, body, file)),
      category: d.category,
      event_name: d.event?.name, event_location: d.event?.location, event_start: day(d.event?.startDate), event_end: day(d.event?.endDate),
      source_name: d.source?.name, source_url: d.source?.url,
    }),
    seo: seoOf(d.seo),
    publishedAt: day(d.publishDate),
  }),
  insights: async ({ fm: d, body, file }) => ({ data: clean({ ...(await articleBase(d, body, file)), author: d.author }), seo: seoOf(d.seo), publishedAt: day(d.publishDate) }),
  case_studies: async ({ fm: d, body, file }) => ({
    data: clean({
      ...(await articleBase(d, body, file)),
      client_name: d.client.name, client_type: d.client.type, client_disclosure: d.client.disclosure, approved: !!d.approval?.approved,
      background: d.background, challenge: d.challenge, solution: d.solution, application: d.application, results: d.results,
      outcomes: d.outcomes, domains: d.domains,
      gallery: d.gallery ? await Promise.all(d.gallery.map(async (g) => clean({ image: await image(g, file), caption: g.caption }))) : undefined,
    }),
    seo: seoOf(d.seo),
    publishedAt: day(d.publishDate),
  }),
};
// EmDash collection → Markdown folder
const FOLDERS = { products: "products", solutions: "solutions", scenarios: "scenarios", pages: "pages", tags: "tags", news: "news", insights: "insights", case_studies: "case-studies" };
const ARTICLE = ["news", "insights", "case_studies"];

// ---------------------------------------------------------------- run
await connect();
const report = { created: 0, skipped: 0, published: 0, held: [] };
const ids = {}; // collection → slug → lang → id
const source = {}; // collection → slug → tw front matter

for (const [collection, folder] of Object.entries(FOLDERS)) {
  const entries = await readCollection(folder);
  const existing = {};
  for (const lang of LANG_ORDER) for (const it of DRY ? [] : await listAll(collection, LOCALES[lang])) (existing[lang] ??= new Map()).set(it.slug, it);
  for (const [slug, langs] of Object.entries(entries)) {
    if (!langs.tw) {
      console.warn(`skip ${folder}/${slug}: no tw source file`);
      continue;
    }
    source[collection] ??= {};
    source[collection][slug] = langs.tw.fm;
    for (const lang of LANG_ORDER) {
      const entry = langs[lang];
      if (!entry) continue;
      const found = existing[lang]?.get(slug);
      if (found) {
        ((ids[collection] ??= {})[slug] ??= {})[lang] = found.id;
        report.skipped++;
        continue;
      }
      const { data, seo, publishedAt } = await MAP[collection](entry);
      const twId = ids[collection]?.[slug]?.tw;
      const payload = clean({ locale: LOCALES[lang], slug, data, seo, translationOf: lang === "tw" ? undefined : twId, publishedAt });
      if (DRY) {
        console.log(`would create ${collection}/${lang}/${slug}`);
        ((ids[collection] ??= {})[slug] ??= {})[lang] = "dry-run";
        report.created++;
        continue;
      }
      const r = await api("POST", `/content/${collection}`, payload);
      ((ids[collection] ??= {})[slug] ??= {})[lang] = r.item.id;
      report.created++;
      // Publish unless the source says draft, or (case studies) the client has not approved publication.
      const tw = langs.tw.fm;
      const hold = tw.draft === true ? "draft" : collection === "case_studies" && !tw.approval?.approved ? "no client approval" : null;
      if (hold) report.held.push(`${collection}/${lang}/${slug} (${hold})`);
      else {
        await api("POST", `/content/${collection}/${r.item.id}/publish`, {});
        report.published++;
      }
    }
  }
}

// ---------------------------------------------------------------- relations (set once, on the parent side)
const edges = new Map(); // "collection/slug" → field → Set(target slug)
const add = (coll, slug, field, targets) => {
  if (!targets?.length) return;
  const k = `${coll}/${slug}`;
  if (!edges.has(k)) edges.set(k, {});
  const f = edges.get(k);
  for (const t of targets) (f[field] ??= []).includes(t) || f[field].push(t);
};
for (const [slug, d] of Object.entries(source.products ?? {})) {
  add("products", slug, "integrated_products", d.integratedOps?.products);
  add("products", slug, "related_solutions", d.relatedSolutions);
  add("products", slug, "related_products", d.relatedProducts);
}
for (const [slug, d] of Object.entries(source.scenarios ?? {})) add("scenarios", slug, "products", d.products);
for (const [slug, d] of Object.entries(source.products ?? {})) for (const s of d.integratedScenarios ?? []) add("scenarios", s, "products", [slug]);
const RANK = { news: 0, insights: 1, case_studies: 2 };
const FIELD_OF = { news: "relatedNews", insights: "relatedInsights", case_studies: "relatedCaseStudies" };
for (const coll of ARTICLE) {
  for (const [slug, d] of Object.entries(source[coll] ?? {})) {
    add(coll, slug, "tags", d.tags);
    add(coll, slug, "related_products", d.relatedProducts);
    add(coll, slug, "related_solutions", d.relatedSolutions);
    for (const other of ARTICLE) {
      for (const t of d[FIELD_OF[other]] ?? []) {
        // A relation between two article types is stored on the type that comes first.
        if (RANK[coll] <= RANK[other]) add(coll, slug, `related_${other}`, [t]);
        else add(other, t, `related_${coll}`, [slug]);
      }
    }
  }
}
const TARGET = (coll, field) => (field === "tags" ? "tags" : field === "products" || field === "integrated_products" || field === "related_products" ? "products" : field.replace(/^related_/, ""));
let linked = 0;
for (const [k, fields] of edges) {
  const [coll, slug] = k.split("/");
  const id = ids[coll]?.[slug]?.tw;
  if (!id) throw new Error(`relation from ${k}: entry missing`);
  const references = {};
  for (const [field, targets] of Object.entries(fields)) {
    references[field] = targets.map((t) => {
      const tid = ids[TARGET(coll, field)]?.[t]?.tw;
      if (!tid) throw new Error(`${k}.${field} → "${t}" does not exist`);
      return tid;
    });
  }
  if (DRY) continue;
  const cur = await api("GET", `/content/${coll}/${id}`);
  // Never shrink what is already in the CMS: only fields that are still empty are filled.
  const fresh = Object.fromEntries(Object.entries(references).filter(([f]) => !(cur.item.references?.[f]?.children?.length)));
  if (!Object.keys(fresh).length) continue;
  await api("PUT", `/content/${coll}/${id}`, { _rev: cur._rev, references: fresh });
  if (cur.item.status === "published") await api("POST", `/content/${coll}/${id}/publish`, {});
  linked++;
}

// ---------------------------------------------------------------- site settings (src/data/site.json)
const site = JSON.parse(await readFile(path.join(REPO, "src/data/site.json"), "utf8"));
const settingsIds = {};
const existingSettings = DRY ? [] : await listAll("site_settings", LOCALES.tw);
if (existingSettings.length) report.skipped++;
else {
  for (const lang of LANG_ORDER) {
    const data = clean({
      company_name: site.companyName[lang], translation_status: lang === "tw" ? "source" : site.companyName[lang] === PENDING ? "pending" : "translated",
      address: site.contact.address[lang], phone: site.contact.phone, email: site.contact.email,
      social: Array.isArray(site.social) ? site.social : undefined,
      careers_url: site.careersUrl,
      brochure_form_url: site.forms.brochure.url, brochure_form_product_entry: site.forms.brochure.productEntry,
      demo_form_url: site.forms.demo.url, demo_form_product_entry: site.forms.demo.productEntry,
    });
    if (DRY) continue;
    const r = await api("POST", "/content/site_settings", clean({ locale: LOCALES[lang], slug: "site", data, translationOf: settingsIds.tw }));
    settingsIds[lang] = r.item.id;
    await api("POST", `/content/site_settings/${r.item.id}/publish`, {});
    report.created++;
    report.published++;
  }
}

console.log(`${DRY ? "[dry run] " : ""}created ${report.created}, already in CMS ${report.skipped}, published ${report.published}, relations set on ${linked} entries`);
if (report.held.length) console.log(`not published:\n  ${report.held.join("\n  ")}`);
