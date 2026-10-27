import assert from 'node:assert/strict';
import fs from 'node:fs';
import {chromium} from 'playwright-core';
import {parseHistoricalNews} from './lib/historical-news.mjs';
import {startPreview,CHROMIUM} from './lib/serve.mjs';
const records=parseHistoricalNews(fs.readFileSync(new URL('../docs/sources/BXR_NEWS_TRILINGUAL_EXPANDED_V2_2026-10-27.txt',import.meta.url),'utf8'));
const images=JSON.parse(fs.readFileSync(new URL('../src/data/news-media.json',import.meta.url),'utf8'));
const ready=(id,lang)=>!!(images[id]?.cover?.approved&&images[id]?.cover?.alt?.[lang]&&fs.existsSync('src/assets/images/news/'+images[id].cover.filename));
const server=await startPreview(4366),browser=await chromium.launch({executablePath:CHROMIUM});let checked=0;
try{
 const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 page.on('request',r=>{if(r.url().startsWith('https://www.bigxreality.com/upload/'))errors.push('forbidden old image request '+r.url());});
 for(const lang of ['tw','en','jp']){
  const links=[];for(const route of[`/${lang}/news/`,`/${lang}/news/page/2/`,`/${lang}/news/page/3/`]){
   assert.equal((await page.goto(server.base+route)).status(),200);
   const pageLinks=await page.locator('#article-grid .title a').evaluateAll(as=>as.map(a=>a.getAttribute('href')));
   links.push(...pageLinks);
   assert.equal(await page.locator('#article-grid .placeholder').count(),pageLinks.filter(href=>!ready(href.split('/').filter(Boolean).at(-1),lang)).length);
   assert.ok(!(await page.locator('main').innerText()).includes('[待翻譯]'));
   assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'),'https://www.bigxreality.com'+route);
  }
  assert.equal(new Set(links).size,30);
  for(const r of records){
   const copy=r.languages[lang],url=`/${lang}/news/${r.id}/`;
   assert.equal((await page.goto(server.base+url)).status(),200);
   assert.equal(await page.locator('h1').innerText(),copy.title);
   const body=await page.locator('.prose').innerText(),norm=s=>s.replace(/\s+/g,' ').trim();assert.equal(norm(body),norm(copy.body),url);
   assert.equal(await page.locator('meta[name="description"]').getAttribute('content'),copy.summary);
   assert.equal(await page.locator('.article-header .cover .placeholder').count(),ready(r.id,lang)?0:1);assert.equal(await page.locator('.article-header .cover img').count(),ready(r.id,lang)?1:0);
   if(ready(r.id,lang))await page.locator('.article-header .cover img').evaluate(img=>img.decode());
   const graph=await page.locator('script[type="application/ld+json"]').evaluate(el=>JSON.parse(el.textContent)['@graph']),article=graph.find(n=>n['@type']===(r.category==='insight'?'Article':'NewsArticle'));
   assert.ok(article);assert.equal(article.datePublished,r.date?r.date+'T00:00:00.000Z':undefined);
   assert.equal(await page.locator('.article-header time').count(),r.date?1:0);
   assert.ok(!(await page.locator('main').innerText()).includes('[待翻譯]'));
   await page.setViewportSize({width:390,height:1000});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,url);
   if(r.id==='news-01-ds-2025'&&lang==='tw')await page.screenshot({path:'/tmp/bxr-historical-news-mobile.png',fullPage:true});
   await page.setViewportSize({width:1440,height:1000});checked++;
  }
 }
 assert.deepEqual(errors,[]);console.log(`PASS: ${checked} verbatim three-language articles, 9 lists, source dates/undated metadata, image placeholders, desktop/mobile and no old-site image requests`);
}finally{await browser.close();server.stop();}
