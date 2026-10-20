#!/usr/bin/env node
// Checks dist-preview/ the way GitHub Pages serves it (under /bigxreality-web/):
// every internal link and asset resolves, every page is noindex, robots blocks
// crawlers, the sitemap is empty, no TEST FIXTURE content, and search works.
import { readFile, readdir, stat } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import { chromium } from "playwright-core";
import { CHROMIUM } from "../lib/serve.mjs";

const base = (process.argv[2] ?? "/bigxreality-web/").replace(/\/?$/, "/");
const ROOT = path.resolve(import.meta.dirname, "../../dist-preview");
let failed = 0;
const check = (name, ok, detail = "") => {
  if (!ok) failed++;
  console.log(`${ok ? "ok  " : "FAIL"} ${name}${ok || !detail ? "" : `  — ${detail}`}`);
};
const resolve = async (urlPath) => {
  let p = decodeURIComponent(urlPath.split(/[?#]/)[0]);
  if (!p.startsWith(base)) return null;
  p = p.slice(base.length - 1);
  if (p.endsWith("/")) p += "index.html";
  const file = path.join(ROOT, p);
  try { return file.startsWith(ROOT) && (await stat(file)).isFile() ? file : null; } catch { return null; }
};

// static checks
const pages = [];
async function walk(d) {
  for (const e of await readdir(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) { if (!["_astro", "pagefind", "fonts", "media"].includes(e.name)) await walk(p); }
    else if (e.name.endsWith(".html")) pages.push(p);
  }
}
await walk(ROOT);
const broken = new Set();
let indexable = 0, fixtures = 0;
for (const f of pages) {
  const html = await readFile(f, "utf8");
  if (!/<meta name="robots" content="noindex"/.test(html)) indexable++;
  if (html.includes("TEST FIXTURE")) fixtures++;
  for (const m of html.matchAll(/\b(?:href|src|action)="(\/[^"]*)"|\bsrcset="([^"]*)"/g)) {
    const urls = m[1] ? [m[1]] : m[2].split(",").map((s) => s.trim().split(/\s+/)[0]);
    for (const u of urls) if (u.startsWith("/") && !(await resolve(u))) broken.add(u);
  }
}
check(`${pages.length} HTML pages, all noindex`, indexable === 0, `${indexable} indexable`);
check("no TEST FIXTURE content", fixtures === 0, `${fixtures} page(s)`);
// Pages that are planned but not built yet (home, technologies, company, contact, privacy):
// listed, not failed — `npm run qa:links` reports the same list for the normal build.
const NOT_YET = /^\/(en|tw|jp)\/((technologies|company|contact|privacy)\/)?$/;
const unbuilt = [...broken].filter((u) => NOT_YET.test(u.slice(base.length - 1)));
const realBroken = [...broken].filter((u) => !unbuilt.includes(u));
check("every internal link and asset resolves under the base path", realBroken.length === 0, realBroken.slice(0, 10).join(" "));
if (unbuilt.length) console.log(`info pages not built yet: ${unbuilt.join(" ")}`);
check("robots.txt blocks crawlers", (await readFile(path.join(ROOT, "robots.txt"), "utf8")).includes("Disallow: /"));
check("sitemap is empty", !(await readFile(path.join(ROOT, "sitemap.xml"), "utf8")).includes("<loc>"));
check("all three languages built", ["en", "tw", "jp"].every((l) => pages.some((p) => p.includes(`${path.sep}${l}${path.sep}products${path.sep}`))));

// browser checks
const TYPES = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp", ".avif": "image/avif", ".woff2": "font/woff2", ".wasm": "application/wasm", ".txt": "text/plain", ".xml": "application/xml" };
const server = createServer(async (req, res) => {
  const file = await resolve(req.url ?? "/");
  if (!file) return res.writeHead(404).end("404");
  res.writeHead(200, { "content-type": TYPES[path.extname(file)] ?? "application/octet-stream" }).end(await readFile(file));
});
await new Promise((r) => server.listen(4340, "127.0.0.1", r));
const origin = "http://127.0.0.1:4340";
const browser = await chromium.launch({ executablePath: CHROMIUM });
try {
  const page = await browser.newPage();
  const missing = [];
  page.on("response", (r) => { if (r.status() >= 400) missing.push(r.url()); });
  await page.goto(`${origin}${base}`, { waitUntil: "networkidle" });
  check("root opens the site", /\/(tw\/|tw\/products\/)$/.test(page.url()), page.url());
  for (const p of ["tw/products/", "tw/products/sut/", "tw/solutions/police/", "tw/news/", "jp/case-studies/", "en/solutions/"]) {
    await page.goto(`${origin}${base}${p}`, { waitUntil: "networkidle" });
  }
  check("no 404 while browsing (pages, images, fonts, scripts)", missing.length === 0, missing.slice(0, 5).join(" "));
  await page.goto(`${origin}${base}tw/products/sut/`, { waitUntil: "networkidle" });
  check("product hero image loads", await page.locator(".page-hero img").evaluate((i) => i.complete && i.naturalWidth > 0).catch(() => false));
  check("CIS fonts load", await page.evaluate(async () => { await document.fonts.ready; return [...document.fonts].some((f) => f.status === "loaded"); }));
  await page.click('.langs a[hreflang="en"]');
  check("language switch stays inside the preview", page.url().startsWith(`${origin}${base}en/`), page.url());
  await page.goto(`${origin}${base}tw/search/?q=${encodeURIComponent("警勤模擬")}`, { waitUntil: "networkidle" });
  await page.waitForFunction(() => document.querySelector("[data-status]")?.textContent !== "", null, { timeout: 10000 }).catch(() => {});
  const hrefs = await page.$$eval(".result a", (as) => as.map((a) => a.getAttribute("href")));
  check("search works and links stay inside the preview", hrefs.includes(`${base}tw/solutions/police/`), JSON.stringify(hrefs));
} finally {
  await browser.close();
  server.close();
}
console.log(failed ? `FAIL: ${failed}` : "PASS");
process.exit(failed ? 1 : 0);
