#!/usr/bin/env node
// Package the tested Git-based static client for the official GitHub Pages mount.
// Historical adapter output is dist/client; only this static artifact is deployed.
import { cp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { parse } from "yaml";
import { publicSiteRoot, publicBasePath } from "../../src/lib/public-url.ts";

const base = (process.argv[2] ?? publicBasePath).replace(/\/?$/, "/");
if(base!==publicBasePath)throw new Error('Pages base must match src/data/site.json, not a second URL setting');
if((process.env.BXR_CONTENT_SOURCE??'markdown')!=='markdown'||process.env.BXR_PREVIEW==='1'||process.env.WORKERS_CI)throw new Error('Official Pages packaging accepts Git Markdown only; no EmDash, fixture, bootstrap or preview mode');
if (!/^\/[a-z0-9._-]+\/$/i.test(base)) throw new Error(`base path must look like /name/ (got ${base})`);
const REPO = path.resolve(import.meta.dirname, "../..");
const SRC = path.join(REPO, "dist/client");
const OUT = path.join(REPO, "dist-pages");
const cms=parse(await readFile(path.join(REPO,'public/admin/config.yml'),'utf8'));
if(cms.backend?.branch!=='main'||cms.publish_mode!=='editorial_workflow')throw new Error('CMS must target main using editorial_workflow before publication');
if (!existsSync(path.join(SRC, "index.html")) && !existsSync(path.join(SRC, "en"))) throw new Error("dist/client not found: run `npm run build` first");

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

const redirect = (to) => `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex"><title>Big x Reality</title><meta http-equiv="refresh" content="0;url=${to}"><link rel="canonical" href="${to}"></head><body><a href="${to}">${to}</a></body></html>\n`;
const start = existsSync(path.join(OUT, "tw", "index.html")) ? `${base}tw/` : `${base}tw/products/`;
await writeFile(path.join(OUT, "index.html"), redirect(start));
await writeFile(path.join(OUT, "404.html"), redirect(start).replace("<title>Big x Reality</title>", "<title>404 · Big x Reality</title>").replace(/<meta http-equiv[^>]+>/, ""));
await writeFile(path.join(OUT, ".nojekyll"), "");
console.log(`pages: ${files} file(s) rebased to ${base} → dist-pages/`);

const git=(args)=>execFileSync('git',args,{cwd:REPO,encoding:'utf8'}).trim();
const commit=git(['rev-parse','HEAD']);
if(process.env.GITHUB_SHA&&process.env.GITHUB_SHA!==commit)throw new Error('Checkout SHA differs from the Actions run; refusing stale publication');
const tracked=git(['ls-files','-z','src/content','src/data','src/assets','public/media','public/video']).split('\0').filter(Boolean).sort();
const hash=createHash('sha256');
for(const file of tracked){hash.update(file+'\0');hash.update(await readFile(path.join(REPO,file)));}
const dirty=!!git(['status','--porcelain','--untracked-files=normal','--','src','public','scripts','astro.config.mjs','package.json','package-lock.json']);
if(process.env.GITHUB_ACTIONS==='true'&&dirty)throw new Error('Tracked source changed during CI; refuse publishing an artifact that differs from the reviewed commit');
const info={commit,ref:process.env.GITHUB_REF??git(['branch','--show-current']),repository:'magician-eric/bigxreality-web',source:'git-markdown',cmsBranch:'main',publication:'GitHub Actions -> GitHub Pages',site:publicSiteRoot,base,contentDigest:hash.digest('hex'),builtAt:new Date().toISOString(),dirty,runUrl:process.env.GITHUB_RUN_ID?`https://github.com/magician-eric/bigxreality-web/actions/runs/${process.env.GITHUB_RUN_ID}`:null};
await writeFile(path.join(OUT,'build-info.json'),JSON.stringify(info,null,2)+'\n');
console.log(`Pages artifact: ${commit}, content digest ${info.contentDigest}, ${publicSiteRoot}/`);
