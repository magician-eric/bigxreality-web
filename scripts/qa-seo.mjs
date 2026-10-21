import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright-core';
import { CHROMIUM, DIST } from './lib/serve.mjs';
const approved = JSON.parse(await fs.readFile(new URL('../tests/fixtures/seo-approved.json', import.meta.url), 'utf8'));
const site = JSON.parse(await fs.readFile(new URL('../src/data/site.json', import.meta.url), 'utf8'));
const browser = await chromium.launch({ executablePath: CHROMIUM });
const pages = [], errors = [];
const normalize = title => { while (/\s*[|｜]\s*(?:Big\s*x\s*Reality|BXR)\s*$/i.test(title)) title = title.replace(/\s*[|｜]\s*(?:Big\s*x\s*Reality|BXR)\s*$/i, '').trim(); return title + ' | Big x Reality'; };
async function walk(dir) { for (const item of await fs.readdir(dir, { withFileTypes:true })) { const file=path.join(dir,item.name); if(item.isDirectory()) { if(!['_astro','pagefind','fonts','media'].includes(item.name)) await walk(file); } else if(item.name==='index.html') { const html=await fs.readFile(file,'utf8'); if(!/http-equiv="refresh"/.test(html)) pages.push({url:'/'+path.relative(DIST,path.dirname(file)).split(path.sep).join('/')+'/',head:html.match(/<head[^>]*>([\s\S]*?)<\/head>/)?.[1]}); } } }
try {
  await walk(DIST);
  const page=await browser.newPage();
  for(const item of pages) {
    item.meta=await page.evaluate(head=>{
      const doc=new DOMParser().parseFromString(head,'text/html');
      const value=selector=>doc.querySelector(selector)?.getAttribute('content');
      return {titles:[...doc.querySelectorAll('title')].map(x=>x.textContent),descriptions:[...doc.querySelectorAll('meta[name="description"]')].map(x=>x.content),canonical:[...doc.querySelectorAll('link[rel="canonical"]')].map(x=>x.getAttribute('href')),noindex:!!doc.querySelector('meta[name="robots"][content*="noindex"]'),alternates:[...doc.querySelectorAll('link[rel="alternate"][hreflang]')].map(x=>[x.getAttribute('hreflang'),x.getAttribute('href')]),ogTitle:value('meta[property="og:title"]'),ogDescription:value('meta[property="og:description"]'),twitterTitle:value('meta[name="twitter:title"]'),twitterDescription:value('meta[name="twitter:description"]'),ogImage:value('meta[property="og:image"]'),ogAlt:value('meta[property="og:image:alt"]'),keywords:!!doc.querySelector('meta[name="keywords"]'),graph:JSON.parse(doc.querySelector('script[type="application/ld+json"]').textContent)['@graph']};
    },item.head);
  }
  const byUrl=new Map(pages.map(p=>[new URL(p.url,site.url).href,p]));
  for(const {url,meta:m} of pages) {
    try {
      assert.equal(m.titles.length,1);assert.equal(m.descriptions.length,1);assert.equal(m.canonical.length,1);
      assert.equal(m.canonical[0],new URL(url,site.url).href);
      assert.ok(m.titles[0].endsWith(' | Big x Reality'));
      assert.ok(!/[|｜]\s*(?:BXR|Big x Reality)\s*[|｜]/i.test(m.titles[0]));
      assert.ok(m.descriptions[0].trim());
      assert.ok(!/\[待|undefined|\bnull\b/.test([m.titles[0],m.descriptions[0],m.ogAlt].join(' ')));
      assert.equal(m.ogTitle,m.titles[0]);assert.equal(m.twitterTitle,m.titles[0]);assert.equal(m.ogDescription,m.descriptions[0]);assert.equal(m.twitterDescription,m.descriptions[0]);
      assert.equal(m.keywords,false);assert.ok(m.ogAlt);assert.ok(await fs.stat(path.join(DIST,new URL(m.ogImage).pathname)));
      const copy=approved[url];if(copy){assert.equal(m.titles[0],normalize(copy.title));assert.equal(m.descriptions[0],copy.description);}
      const pattern=url.replace(/^\/(tw|en|jp)\//,'/{lang}/');
      const matching=pages.filter(p=>!p.meta.noindex && p.url.replace(/^\/(tw|en|jp)\//,'/{lang}/')===pattern);
      const expected=m.noindex?[]:matching.map(p=>[({tw:'zh-Hant-TW',en:'en',jp:'ja'})[p.url.split('/')[1]],new URL(p.url,site.url).href]);
      const defaultPage=matching.find(p=>p.url.startsWith('/en/'));
      if(!m.noindex && defaultPage)expected.push(['x-default',new URL(defaultPage.url,site.url).href]);
      assert.deepEqual([...m.alternates].sort(),expected.sort());
      const principal=m.graph.filter(n=>['WebPage','CollectionPage','Product','Article','NewsArticle'].includes(n['@type']));assert.equal(principal.length,1);
      for(const node of m.graph)if(node['@type']==='BreadcrumbList')for(const item of node.itemListElement)assert.ok(byUrl.has(item.item),item.item);
      for(const [language,href]of m.alternates){const target=byUrl.get(href);assert.ok(target,href);assert.equal(target.meta.noindex,false,href);if(language==='x-default')assert.equal(target.url.split('/')[1],'en');}
      const org=m.graph.find(n=>n['@type']==='Organization');assert.equal(org.email,'service@gptt.com.tw');assert.equal(org.telephone,'+886-2-8791-6811');if(url.startsWith('/en/')||url.startsWith('/jp/'))assert.equal(org.legalName,undefined);
      for(const node of m.graph)if(node['@type']==='Product')for(const key of ['offers','aggregateRating','review','availability','price'])assert.equal(node[key],undefined);
      if(/\/(search|tags)\/$/.test(url))assert.equal(m.noindex,true);
    }catch(error){errors.push(`${url}: ${error.message}`);}
  }
  const duplicates = field => { const grouped=new Map();for(const p of pages){const value=p.meta[field][0];grouped.set(value,[...(grouped.get(value)??[]),p.url]);}return [...grouped.values()].filter(urls=>urls.length>1); };
  const duplicateTitles=duplicates('titles'), duplicateDescriptions=duplicates('descriptions');
  if(duplicateTitles.length)errors.push('Duplicate titles: '+JSON.stringify(duplicateTitles));
  if(duplicateDescriptions.length)errors.push('Duplicate descriptions: '+JSON.stringify(duplicateDescriptions));
  const report={checked:pages.length,approvedUpdated:pages.filter(p=>approved[p.url]).length,languages:Object.fromEntries(['tw','en','jp'].map(l=>[l,pages.filter(p=>p.url.startsWith('/'+l+'/')).length])),indexable:pages.filter(p=>!p.meta.noindex).length,noindex:pages.filter(p=>p.meta.noindex).map(p=>p.url),duplicateTitles,duplicateDescriptions,errors};
  await fs.writeFile(process.env.SEO_REPORT??'/tmp/bxr-seo-report.json',JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify(report,null,2));assert.deepEqual(errors,[]);
}finally{await browser.close();}
