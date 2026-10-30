import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {chromium} from 'playwright-core';
import {CHROMIUM} from './lib/serve.mjs';
const root=path.resolve('dist-pages'),base='/bigxreality-web/';
const pages=[];function walk(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const file=path.join(dir,entry.name);if(entry.isDirectory())walk(file);else if(entry.name==='index.html')pages.push(file);}}walk(root);
let references=0;
for(const file of pages)for(const [,url]of fs.readFileSync(file,'utf8').matchAll(/\b(?:href|src|poster)="(\/[^"\s]+)"/g)){
 if(url.startsWith('//'))continue;assert.ok(url.startsWith(base),url);let target=decodeURIComponent(url.slice(base.length).split(/[?#]/)[0]);if(target.endsWith('/'))target+='index.html';assert.ok(fs.existsSync(path.join(root,target)),url);references++;
}
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.avif':'image/avif','.webp':'image/webp','.mp4':'video/mp4'};
const server=createServer((req,res)=>{let route=new URL(req.url,'http://localhost').pathname;if(!route.startsWith(base)){res.writeHead(404).end();return;}route=decodeURIComponent(route.slice(base.length));if(route.endsWith('/'))route+='index.html';const file=path.resolve(root,route);if(!file.startsWith(root+path.sep)){res.writeHead(404).end();return;}try{res.writeHead(200,{'content-type':types[path.extname(file)]??'application/octet-stream'}).end(fs.readFileSync(file));}catch{res.writeHead(404).end();}});
await new Promise(resolve=>server.listen(4379,'127.0.0.1',resolve));const browser=await chromium.launch({executablePath:CHROMIUM});
let checked=0;
try{
 const p=await browser.newPage({reducedMotion:'reduce'}),errors=[];p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{if(r.status()>=400)errors.push(r.url());});
 for(const lang of ['tw','en','jp'])for(const width of [1440,390])for(const route of ['','news/','news/filter/event/all/','news/filter/all/2025/page/2/','products/sut/','solutions/military/','company/partners/']){
  await p.setViewportSize({width,height:900});assert.equal((await p.goto(`http://127.0.0.1:4379${base}${lang}/${route}`)).status(),200);
  assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  if(!route)assert.equal(await p.locator('[data-home-partners] img').count(),0);
  if(route==='news/'){await p.locator('.category-filter a[href$="/filter/event/all/"]').click();assert.ok(p.url().endsWith(`${base}${lang}/news/filter/event/all/`));await p.reload();assert.equal(await p.locator('[data-news-category]').evaluateAll(es=>es.every(e=>e.dataset.newsCategory==='event')),true);}
  if(route==='company/partners/')for(const img of await p.locator('[data-client-logos] img').all()){await img.scrollIntoViewIfNeeded();await img.evaluate(e=>e.decode());assert.ok((await img.getAttribute('src')).startsWith(base));}
  checked++;
 }
 assert.deepEqual(errors,[]);console.log(`PASS: ${pages.length} rebased HTML pages, ${references} local references, ${checked} TW/EN/JP desktop/mobile pages including static filters and logo paths.`);
}finally{await browser.close();server.close();}
