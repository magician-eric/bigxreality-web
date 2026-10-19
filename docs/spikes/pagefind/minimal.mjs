// Minimal custom-record cases: which pages does a one-word query return?
import * as pagefind from "pagefind";
import { chromium } from "playwright-core";
import { createServer } from "node:http";
import { readFile, stat, mkdir, writeFile, rm } from "node:fs/promises";
import path from "node:path";

const CASES = {
  "A: same word, no other words": [["p1", "訓練"], ["p2", "訓練"]],
  "B: word once vs twice": [["p1", "訓練"], ["p2", "訓練 訓練"]],
  "C: word + neighbours": [["p1", "專項 訓練 練系"], ["p2", "VR 訓練 系統"]],
  "D: latin control": [["p1", "alpha train beta"], ["p2", "train"]],
  "E: latin twice": [["p1", "train"], ["p2", "train train"]],
  "F: cjk thrice vs once": [["p1", "訓練 甲乙 訓練 丙丁 訓練"], ["p2", "訓練"]],
};
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".wasm": "application/wasm" };
let port = 4380;
for (const [label, pages] of Object.entries(CASES)) {
  for (const lang of ["zh-hant-tw", "en"]) {
    const dir = "mini"; await rm(dir, { recursive: true, force: true }); await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, "index.html"), `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"></head><body></body></html>`);
    const { index } = await pagefind.createIndex();
    for (const [u, c] of pages) await index.addCustomRecord({ url: `/${u}/`, content: c, language: lang, meta: { title: u } });
    await index.writeFiles({ outputPath: path.join(dir, "pagefind") });
    const p = ++port;
    const server = createServer(async (req, res) => { let f = path.join(dir, decodeURIComponent(req.url.split("?")[0])); try { if ((await stat(f)).isDirectory()) f = path.join(f, "index.html"); res.writeHead(200, { "content-type": types[path.extname(f)] ?? "application/octet-stream" }); res.end(await readFile(f)); } catch { res.writeHead(404).end(); } }).listen(p);
    const page = await browser.newPage(); await page.goto(`http://127.0.0.1:${p}/`);
    const q = pages[0][1].includes("train") ? "train" : "訓練";
    const urls = await page.evaluate(async (q) => { const pf = await import("/pagefind/pagefind.js"); await pf.init(); const r = await pf.search(q); return Promise.all(r.results.map(async (x) => (await x.data()).url)); }, q);
    console.log(`${label.padEnd(30)} lang=${lang.padEnd(10)} q=${q.padEnd(5)} → ${urls.join(" ") || "-"}`);
    await page.close(); server.close();
  }
}
await pagefind.close(); await browser.close();
