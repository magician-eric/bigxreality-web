#!/usr/bin/env node
// GitHub Pages preview: the built site (dist/client) is served under a sub-path
// (https://<user>.github.io/bigxreality-web/), but every internal link starts at "/".
// This copies dist/client to dist-preview/ and prefixes root-relative URLs in HTML and CSS
// with the base path. It also adds a start page for "/" (the home page is not built yet,
// so it opens the products overview) and a 404 page.
// The site code is not changed; production builds never run this.
//
//   BXR_PREVIEW=1 npm run build && node scripts/preview/rebase.mjs /bigxreality-web/
import { cp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const base = (process.argv[2] ?? "/bigxreality-web/").replace(/\/?$/, "/");
if (!/^\/[a-z0-9._-]+\/$/i.test(base)) throw new Error(`base path must look like /name/ (got ${base})`);
const REPO = path.resolve(import.meta.dirname, "../..");
const SRC = path.join(REPO, "dist/client");
const OUT = path.join(REPO, "dist-preview");
if (!existsSync(path.join(SRC, "index.html")) && !existsSync(path.join(SRC, "en"))) throw new Error("dist/client not found: run `BXR_PREVIEW=1 npm run build` first");

await rm(OUT, { recursive: true, force: true });
await cp(SRC, OUT, { recursive: true });

// "/x" but not "//host" and not already "/base/x"
const rel = (u) => u.startsWith("/") && !u.startsWith("//") && !u.startsWith(base) ? base + u.slice(1) : u;
const html = (s) =>
  s
    .replace(/\b(href|src|action|poster|data-src)="([^"]*)"/g, (_, a, u) => `${a}="${rel(u)}"`)
    .replace(/\b(srcset|imagesrcset)="([^"]*)"/g, (_, a, v) => `${a}="${v.split(",").map((p) => p.trim().replace(/^\S+/, rel)).join(", ")}"`)
    .replace(/url\((['"]?)(\/[^)'"]*)\1\)/g, (_, q, u) => `url(${q}${rel(u)}${q})`)
    .replace(/(import\(|from\s*)(["'])(\/_astro\/[^"']+)\2/g, (_, k, q, u) => `${k}${q}${rel(u)}${q}`);
const css = (s) => s.replace(/url\((['"]?)(\/[^)'"]*)\1\)/g, (_, q, u) => `url(${q}${rel(u)}${q})`);
const js = (s) => s.replace(/(["'`])(\/_astro\/[^"'`]+)\1/g, (_, q, u) => `${q}${rel(u)}${q}`);

let files = 0;
async function walk(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { if (e.name !== "pagefind") await walk(p); continue; }
    const fix = e.name.endsWith(".html") ? html : e.name.endsWith(".css") ? css : e.name.endsWith(".js") ? js : null;
    if (!fix) continue;
    const before = await readFile(p, "utf8");
    const after = fix(before);
    if (after !== before) { await writeFile(p, after); files++; }
  }
}
await walk(OUT);

const redirect = (to) => `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex"><title>Big x Reality (preview)</title><meta http-equiv="refresh" content="0;url=${to}"><link rel="canonical" href="${to}"></head><body><a href="${to}">${to}</a></body></html>\n`;
const start = existsSync(path.join(OUT, "tw", "index.html")) ? `${base}tw/` : `${base}tw/products/`;
await writeFile(path.join(OUT, "index.html"), redirect(start));
await writeFile(path.join(OUT, "404.html"), redirect(start).replace("<title>Big x Reality (preview)</title>", "<title>404 · Big x Reality (preview)</title>").replace(/<meta http-equiv[^>]+>/, ""));
await writeFile(path.join(OUT, ".nojekyll"), "");
console.log(`preview: ${files} file(s) rebased to ${base} → dist-preview/`);
