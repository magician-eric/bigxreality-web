#!/usr/bin/env node
/** Real local CMS → publish → EmDash loader test, not a Markdown substitute.
 * Creates temporary entries and a read-only token, then removes them. Remote CMS is refused.
 */
import assert from "node:assert/strict";
import { createServer } from "vite";
import { DatabaseSync } from "node:sqlite";
import { readdirSync } from "node:fs";
import path from "node:path";
import { connect, api, BASE } from "../../scripts/cms/lib.mjs";
if (!/^http:\/\/(127\.0\.0\.1|localhost)(:\d+)?$/.test(BASE)) throw new Error("Local CMS only");
const priorToken = process.env.EMDASH_TOKEN;
const ids = [];
let tokenId;
let vite;
let db;
let previousTask;
const slug = `technology-smoke-${Date.now().toString(36)}`;
const body = (text) => [{ _type: "block", _key: "a", style: "normal", markDefs: [], children: [{ _type: "span", _key: "b", text, marks: [] }] }];
try {
  await connect();
  const dir = path.resolve(import.meta.dirname, "../../.wrangler/state/v3/d1/miniflare-D1DatabaseObject");
  db = new DatabaseSync(path.join(dir, readdirSync(dir).find((f) => f.endsWith(".sqlite") && f !== "metadata.sqlite")));
  previousTask = db.prepare("SELECT task_name, next_run_at, data FROM _emdash_cron_tasks WHERE plugin_id = 'bxr-cms' AND task_name = 'rebuild'").get();
  const publishedDate = "2026-01-01T00:00:00.000Z";
  const source = (await api("POST", "/content/insights", { locale: "zh-TW", slug, publishedAt: publishedDate, data: {
    title: "TEST FIXTURE 核心技術關聯", summary: "TEST FIXTURE", body: body("TEST FIXTURE 正文"),
    translation_status: "source", review_status: "approved", technology_tags: ["xr", "ai-simulation", "training-design"],
  } })).item;
  ids.push(source.id);
  await api("POST", `/content/insights/${source.id}/publish`, {});
  const english = (await api("POST", "/content/insights", { locale: "en", slug, translationOf: source.id, publishedAt: publishedDate, data: {
    title: "TEST FIXTURE technology links", summary: "TEST FIXTURE", body: body("TEST FIXTURE English body"),
    translation_status: "translated", review_status: "approved",
  } })).item;
  ids.push(english.id);
  await api("POST", `/content/insights/${english.id}/publish`, {});
  const japanese = (await api("POST", "/content/insights", { locale: "ja", slug, translationOf: source.id, publishedAt: publishedDate, data: {
    title: "TEST FIXTURE", summary: "TEST FIXTURE", body: body("TEST FIXTURE"),
    translation_status: "pending", review_status: "approved",
  } })).item;
  ids.push(japanese.id);
  await api("POST", `/content/insights/${japanese.id}/publish`, {});
  const current = await api("GET", `/content/insights/${source.id}`);
  await api("PUT", `/content/insights/${source.id}`, { _rev: current._rev, data: { ...current.item.data, technology_tags: ["system-integration", "decision-visualization"] } });
  const publishedBefore = await api("GET", "/content/insights?locale=zh-TW&status=published&limit=100");
  assert.deepEqual(publishedBefore.items.find((e) => e.id === source.id).data.technology_tags, ["xr", "ai-simulation", "training-design"]);
  await api("POST", `/content/insights/${source.id}/publish`, {});
  const publishedAfter = await api("GET", "/content/insights?locale=zh-TW&status=published&limit=100");
  assert.deepEqual(publishedAfter.items.find((e) => e.id === source.id).data.technology_tags, ["system-integration", "decision-visualization"]);
  console.log("PASS: editing technology tags remains draft until republished");

  const minted = await api("POST", "/admin/api-tokens", { name: slug, scopes: ["content:read", "media:read"] });
  tokenId = minted.info.id;
  process.env.EMDASH_TOKEN = minted.token;
  vite = await createServer({ configFile: false, appType: "custom", server: { middlewareMode: true } });
  const { emdashLoader } = await vite.ssrLoadModule("/src/lib/emdash/loader.ts");
  const entries = new Map();
  await emdashLoader("insights").load({
    store: { clear() { entries.clear(); }, set(entry) { entries.set(entry.id, entry); } },
    parseData: async ({ data }) => data,
    generateDigest: (data) => JSON.stringify(data), logger: { info() {} },
  });
  for (const lang of ["tw", "en", "jp"]) {
    assert.deepEqual(entries.get(`${lang}/${slug}`).data.technologyTags, ["system-integration", "decision-visualization"]);
  }
  assert.equal(entries.get(`en/${slug}`).data.translationStatus, "translated");
  assert.equal(entries.get(`jp/${slug}`).data.translationStatus, "pending");
  assert.ok(entries.get(`en/${slug}`).body.includes("English body"));
  console.log("PASS: actual EmDash loader reads published tags from TW source for all locale entries, retaining locale-specific body/status");
  const { selectTechnologyArticles } = await vite.ssrLoadModule("/src/lib/technologies.ts");
  const articles = ["tw", "en", "jp"].map((lang) => ({ collection: "insights", lang, pendingTranslation: entries.get(`${lang}/${slug}`).data.translationStatus === "pending", base: { data: { ...entries.get(`tw/${slug}`).data, publishDate: new Date(publishedDate) } }, loc: entries.get(`${lang}/${slug}`) }));
  assert.equal(selectTechnologyArticles(articles, "system-integration", "en").length, 1);
  assert.equal(selectTechnologyArticles(articles, "decision-visualization", "en").length, 1);
  assert.equal(selectTechnologyArticles(articles, "system-integration", "jp").length, 0);
  assert.equal(selectTechnologyArticles(articles, "ai-simulation", "en").length, 0);
  assert.equal(selectTechnologyArticles(articles, "xr", "en").length, 0);
  console.log("PASS: CMS-backed query updates technology relation and excludes pending translation");

  const task = db.prepare("SELECT task_name, next_run_at, data FROM _emdash_cron_tasks WHERE plugin_id = 'bxr-cms' AND task_name = 'rebuild'").get();
  assert.ok(task);
  assert.deepEqual(JSON.parse(task.data), { reason: "publish", collection: "insights" });
  assert.notDeepEqual(task, previousTask, "This run must change the rebuild task payload or next-run time; an old task is insufficient evidence");
  console.log("PASS: this run changed the actual bxr-cms rebuild task (payload/next-run time), with publish/insights payload");
} finally {
  if (vite) await vite.close();
  if (priorToken === undefined) delete process.env.EMDASH_TOKEN; else process.env.EMDASH_TOKEN = priorToken;
  const cleanups = await Promise.allSettled([
    ...ids.reverse().map((id) => api("DELETE", `/content/insights/${id}`)),
    ...(tokenId ? [api("DELETE", `/admin/api-tokens/${tokenId}`)] : []),
  ]);
  if (db) db.close();
  const errors = cleanups.filter((r) => r.status === "rejected").map((r) => r.reason);
  if (errors.length) throw new AggregateError(errors, "Local smoke-test cleanup was incomplete; inspect the individual failures");
}
