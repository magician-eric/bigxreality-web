// Migration prototype (M4): import phase 1 Markdown (products, solutions, scenarios
// in tw/en/jp) into EmDash exactly as written, then publish with the same dates.
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import YAML from "yaml";
import { login, api, check, summary, L } from "./lib.mjs";

const root = new URL("../src/content/", import.meta.url).pathname;
const LOC = { tw: L.tw, en: L.en, jp: L.jp };
const key = () => Math.random().toString(36).slice(2, 10);
/** Markdown body (plain paragraphs only in phase 1) → Portable Text blocks. */
const toPt = (md) => md.trim().split(/\n\s*\n/).filter(Boolean).map((p) => ({ _type: "block", _key: key(), style: "normal", markDefs: [], children: [{ _type: "span", _key: key(), text: p.replace(/\s*\n\s*/g, " "), marks: [] }] }));

async function readAll(collection) {
  const out = {};
  for (const lang of ["tw", "en", "jp"]) for (const f of await readdir(path.join(root, collection, lang))) {
    if (!f.endsWith(".md")) continue;
    const text = await readFile(path.join(root, collection, lang, f), "utf8");
    const [, fm, body] = text.split(/^---$/m);
    (out[f.slice(0, -3)] ??= {})[lang] = { fm: YAML.parse(fm), body: body ?? "" };
  }
  return out;
}

await login();
const created = {}; // collection -> slug -> lang -> id
async function put(collection, slug, lang, data, extra = {}) {
  const twId = created[collection]?.[slug]?.tw;
  const r = await api("POST", `/content/${collection}`, { locale: LOC[lang], slug, data, ...(lang === "tw" ? {} : { translationOf: twId }), ...extra });
  ((created[collection] ??= {})[slug] ??= {})[lang] = r.item.id;
  return r.item;
}
const ORDER = ["tw", "en", "jp"]; // tw first: it is the translation source

// solutions & scenarios
const sol = await readAll("solutions");
for (const [slug, langs] of Object.entries(sol)) for (const lang of ORDER) {
  const d = langs[lang].fm;
  await put("solutions", slug, lang, { title: d.name, english_name: d.englishName, domain: d.domain, summary: d.summary, sort_order: d.order, translation_status: d.translationStatus });
}
const scn = await readAll("scenarios");
for (const [slug, langs] of Object.entries(scn)) for (const lang of ORDER) {
  const d = langs[lang].fm;
  await put("scenarios", slug, lang, { title: d.name, code: d.code, ...(d.englishName ? { english_name: d.englishName } : {}), summary: d.summary, sort_order: d.order, translation_status: d.translationStatus });
}

// media: upload each product image once
const mediaBySrc = {};
async function media(src, alt) {
  if (!mediaBySrc[src]) {
    const file = path.resolve(root, "products/tw", src);
    const fd = new FormData();
    fd.append("file", new Blob([await readFile(file)], { type: "image/jpeg" }), path.basename(file));
    fd.append("alt", alt);
    const r = await api("POST", "/media", fd);
    mediaBySrc[src] = r.item ?? r;
  }
  return mediaBySrc[src];
}

// products (references are set once, on the tw source)
const prod = await readAll("products");
const pending = [];
for (const [slug, langs] of Object.entries(prod)) for (const lang of ORDER) {
  const { fm: d, body } = langs[lang];
  const dep = d.deployment ?? {};
  const personnel = dep.personnel === undefined ? undefined : typeof dep.personnel === "string" ? dep.personnel : `${dep.personnel.min}-${dep.personnel.max}`;
  const data = {
    title: d.hero.name, english_name: d.hero.englishName, code: d.hero.code, tagline: d.hero.tagline,
    ...(d.summary ? { summary: d.summary } : {}),
    overview: toPt(body),
    ...(d.capabilities ? { capabilities: d.capabilities } : {}),
    ...(d.howItWorks ? { how_it_works: d.howItWorks } : {}),
    ...(d.scenarios ? { scenarios: d.scenarios } : {}),
    ...(d.components ? { components: d.components } : {}),
    ...(personnel ? { deploy_personnel: personnel, deploy_personnel_approx: !!dep.personnel?.approx } : {}),
    ...(dep.area !== undefined ? { deploy_area: String(dep.area) } : {}),
    ...(dep.setupTime !== undefined ? { deploy_setup_time: String(dep.setupTime) } : {}),
    ...(d.integratedOps?.description ? { integrated_ops_description: d.integratedOps.description } : {}),
    domains: d.domains, sort_order: d.order, translation_status: d.translationStatus,
    ...(d.cta ? { cta_title: d.cta.title, cta_description: d.cta.description, cta_brochure: d.cta.brochure, cta_demo: d.cta.demo } : {}),
  };
  if (d.hero.image) { const m = await media(d.hero.image.src, d.hero.image.alt); data.hero_image = { id: m.id, alt: d.hero.image.alt }; }
  await put("products", slug, lang, data, { publishedAt: new Date(d.publishDate).toISOString() });
  if (lang === "tw") pending.push({ slug, d });
}
for (const { slug, d } of pending) {
  const id = created.products[slug].tw;
  const cur = await api("GET", `/content/products/${id}`);
  await api("PUT", `/content/products/${id}`, { _rev: cur._rev, references: {
    integrated_products: (d.integratedOps?.products ?? []).map((s) => created.products[s].tw),
    related_solutions: (d.relatedSolutions ?? []).map((s) => created.solutions[s].tw),
    integrated_scenarios: (d.integratedScenarios ?? []).map((s) => created.scenarios[s].tw),
  } });
}
// publish everything (publishedAt kept from the Markdown publishDate where given)
let n = 0;
for (const [collection, slugs] of Object.entries(created)) for (const langs of Object.values(slugs)) for (const id of Object.values(langs)) {
  await api("POST", `/content/${collection}/${id}/publish`, {}); n++;
}
check("6.0", "第一階段 Markdown 全部匯入並發布", n === 27, `${n} entries (3 products + 4 solutions + 2 scenarios) × 3 languages`);
summary();
