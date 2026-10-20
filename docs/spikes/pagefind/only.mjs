// Index a subset of the spike site and query 訓練 / 戰術訓練 on the tw search page.
import * as pagefind from "pagefind";
import { chromium } from "playwright-core";
import { createServer } from "node:http";
import { readFile, stat, cp, rm } from "node:fs/promises";
import path from "node:path";
const [label, ...dirs] = process.argv.slice(2);
await rm("only", { recursive: true, force: true });
for (const d of dirs) await cp(path.join("site", d), path.join("only", d), { recursive: true });
await cp("site/tw/search", "only/tw/search", { recursive: true });
const { index } = await pagefind.createIndex(); const r = await index.addDirectory({ path: "only" }); await index.writeFiles({ outputPath: "only/pagefind" }); await pagefind.close();
const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".wasm": "application/wasm" };
const server = createServer(async (req, res) => { let p = path.join("only", decodeURIComponent(req.url.split("?")[0])); try { if ((await stat(p)).isDirectory()) p = path.join(p, "index.html"); res.writeHead(200, { "content-type": types[path.extname(p)] ?? "application/octet-stream" }); res.end(await readFile(p)); } catch { res.writeHead(404).end(); } }).listen(4396);
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const out = [];
for (const q of ["訓練", "戰術訓練"]) { const page = await browser.newPage(); await page.goto("http://127.0.0.1:4396/tw/search/");
  out.push(q + ":" + (await page.evaluate(async (q) => { const pf = await import("/pagefind/pagefind.js"); await pf.init(); const r = await pf.search(q); return (await Promise.all(r.results.map(async (x) => (await x.data()).url))).join(","); }, q)) || "-"); await page.close(); }
console.log(label.padEnd(14), `pages ${r.page_count}`, out.join("   "));
await browser.close(); server.close();
