#!/usr/bin/env node
// Before an EmDash build: copy the published "網站資訊" (site_settings) entries into
// src/data/.cms-site.json (not committed). src/lib/site.ts prefers that file over the
// committed src/data/site.json, which stays as the backup. Does nothing in other modes.
import { writeFile, readFile } from "node:fs/promises";
import path from "node:path";

if (process.env.BXR_CONTENT_SOURCE !== "emdash") process.exit(0);
const { cmsGet, CMS_LOCALES } = await import("../../src/lib/emdash/client.ts");
const REPO = path.resolve(import.meta.dirname, "../..");
const PENDING = "[待提供]";
const backup = JSON.parse(await readFile(path.join(REPO, "src/data/site.json"), "utf8"));

const byLang = {};
for (const [lang, locale] of Object.entries(CMS_LOCALES)) {
  const page = await cmsGet(`/content/site_settings?status=published&locale=${locale}&limit=1`);
  if (page.items[0]) byLang[lang] = page.items[0].data;
}
const tw = byLang.tw;
if (!tw) throw new Error("EmDash has no published 網站資訊 (site_settings) entry in zh-TW");
const v = (x) => (x === undefined || x === null || x === "" ? PENDING : x);
const perLang = (field) => Object.fromEntries(Object.keys(CMS_LOCALES).map((l) => [l, v(byLang[l]?.[field])]));
const site = {
  ...backup,
  companyName: perLang("company_name"),
  contact: { address: perLang("address"), phone: v(tw.phone), email: v(tw.email) },
  social: Array.isArray(tw.social) && tw.social.length ? tw.social.map((s) => ({ label: s.label, url: s.url })) : PENDING,
  careersUrl: v(tw.careers_url),
  forms: {
    brochure: { url: v(tw.brochure_form_url), productEntry: v(tw.brochure_form_product_entry) },
    demo: { url: v(tw.demo_form_url), productEntry: v(tw.demo_form_product_entry) },
  },
};
await writeFile(path.join(REPO, "src/data/.cms-site.json"), JSON.stringify(site, null, 2) + "\n");
console.log("site settings: src/data/.cms-site.json written from EmDash");
