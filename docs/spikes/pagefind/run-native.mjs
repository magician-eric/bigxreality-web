// Baseline: Pagefind's own HTML indexing and CJK segmentation, same cases as run-bigram.mjs.
import * as pagefind from "pagefind";
import { chromium } from "playwright-core";
import { createServer } from "node:http";
import { readFile, stat, rm } from "node:fs/promises";
import path from "node:path";
import { CASES } from "./cases.mjs";

await rm("site/pagefind", { recursive: true, force: true });
const { index } = await pagefind.createIndex();
await index.addDirectory({ path: "site" });
await index.writeFiles({ outputPath: "site/pagefind" });
await pagefind.close();
const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".wasm": "application/wasm" };
const server = createServer(async (req, res) => { let p = path.join("site", decodeURIComponent(req.url.split("?")[0])); try { if ((await stat(p)).isDirectory()) p = path.join(p, "index.html"); res.writeHead(200, { "content-type": types[path.extname(p)] ?? "application/octet-stream" }); res.end(await readFile(p)); } catch { res.writeHead(404).end(); } }).listen(4393);
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH ?? "/opt/pw-browsers/chromium" });
let pass = 0, total = 0;
for (const lang of ["tw", "en", "jp"]) for (const [q, note, expected] of CASES[lang]) {
  const page = await browser.newPage(); await page.goto(`http://127.0.0.1:4393/${lang}/search/`);
  const urls = await page.evaluate(async (q) => { const pf = await import("/pagefind/pagefind.js"); await pf.init(); const r = await pf.search(q); return Promise.all(r.results.map(async (x) => (await x.data()).url)); }, q);
  const got = urls.map((u) => u.replace(`/${lang}/`, "")).sort();
  const ok = JSON.stringify(got) === JSON.stringify([...expected].sort());
  total++; if (ok) pass++;
  console.log(`${ok ? "✓" : "✗"} ${lang} | ${q.padEnd(16)} | ${note.padEnd(20)} | got ${got.join(",") || "-"}${ok ? "" : ` | expected ${expected.join(",") || "-"}`}`);
  await page.close();
}
console.log(`${pass}/${total} as expected`);
await browser.close(); server.close();
