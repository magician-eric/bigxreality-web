import * as pagefind from "pagefind";
import { chromium } from "playwright-core";
import { createServer } from "node:http";
import { readFile, stat, readdir, rm } from "node:fs/promises";
import path from "node:path";
import { tokenize } from "./tokenize.mjs";

const LANGS = { en: "en", tw: "zh-Hant-TW", jp: "ja-JP" };
await rm("site/pagefind", { recursive: true, force: true });
const { index } = await pagefind.createIndex();
let records = 0;
async function* walk(d) { for (const e of await readdir(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) yield* walk(p); else if (e.name === "index.html") yield p; } }
for await (const file of walk("site")) {
  const html = await readFile(file, "utf8");
  const body = html.match(/<main data-pagefind-body>([\s\S]*?)<\/main>/);
  if (!body) continue; // only explicitly marked pages are indexed
  const lang = html.match(/<html lang="([^"]+)"/)[1];
  const title = html.match(/<h1>([^<]*)<\/h1>/)[1];
  const text = body[1].replace(/<[^>]+>/g, " ");
  await index.addCustomRecord({ url: "/" + path.relative("site", path.dirname(file)) + "/", content: lang === "en" ? text : tokenize(text), language: lang.toLowerCase(), meta: { title } });
  records++;
}
await index.writeFiles({ outputPath: "site/pagefind" });
await pagefind.close();
console.log("records:", records);

const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".wasm": "application/wasm" };
const server = createServer(async (req, res) => { let p = path.join("site", decodeURIComponent(req.url.split("?")[0])); try { if ((await stat(p)).isDirectory()) p = path.join(p, "index.html"); res.writeHead(200, { "content-type": types[path.extname(p)] ?? "application/octet-stream" }); res.end(await readFile(p)); } catch { res.writeHead(404).end(); } }).listen(4395);

const CASES = (await import("./cases.mjs")).CASES;
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const tok = (await readFile("tokenize.mjs", "utf8")).replace("export function", "function");
let pass = 0, total = 0;
for (const lang of ["tw", "en", "jp"]) for (const [q, note, expected] of CASES[lang]) {
  const page = await browser.newPage(); await page.goto(`http://127.0.0.1:4395/${lang}/search/`);
  const urls = await page.evaluate(async ({ q, tok, lang }) => { eval(tok.replace("function tokenize", "globalThis.tokenize = function")); const pf = await import("/pagefind/pagefind.js"); await pf.init(); const r = await pf.search(lang === "en" ? q : tokenize(q)); return Promise.all(r.results.map(async (x) => (await x.data()).url)); }, { q, tok, lang });
  const got = urls.map((u) => u.replace(`/${lang}/`, "")).sort();
  const ok = JSON.stringify(got) === JSON.stringify([...expected].sort());
  total++; if (ok) pass++;
  console.log(`${ok ? "✓" : "✗"} ${lang} | ${q.padEnd(16)} | ${note.padEnd(20)} | got ${got.join(",") || "-"}${ok ? "" : ` | expected ${expected.join(",") || "-"}`}`);
  await page.close();
}
console.log(`${pass}/${total} as expected`);
await browser.close(); server.close();
