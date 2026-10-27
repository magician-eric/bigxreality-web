import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import YAML from 'yaml';
import {parseHistoricalNews} from '../scripts/lib/historical-news.mjs';
import {comparePublicationDates} from '../src/lib/publication-date.ts';
const source=fs.readFileSync(new URL('../docs/sources/BXR_NEWS_TRILINGUAL_2026-10-27.txt',import.meta.url),'utf8');
const records=parseHistoricalNews(source);
test('all 39 news translations retain the supplied title, body, date and full-paragraph SEO',()=>{
 assert.equal(records.length,13);assert.equal(records.some(r=>r.id.startsWith('news-14')),false);
 for(const r of records)for(const[lang,copy]of Object.entries(r.languages)){
  const text=fs.readFileSync(`src/content/news/${lang}/${r.id}.md`,'utf8'),end=text.indexOf('\n---',3),data=YAML.parse(text.slice(4,end));
  assert.equal(text.slice(end+5).trim(),copy.body,r.id+'/'+lang);assert.equal(data.title,copy.title);assert.equal(data.summary,copy.summary);assert.equal(data.seo.title,copy.title);assert.equal(data.seo.description,copy.summary);assert.equal(data.imageId,r.id);assert.equal(data.articleId,r.id);assert.equal(data.category,r.category);
  if(r.date)assert.equal(data.publishDate,r.date);else{assert.equal(data.publishDate,undefined);assert.equal(data.dateUnconfirmed,true);assert.equal(data.dateNote,r.dateNote);}
 }
});
test('unknown dates remain undated, sort last, and equal dates do not merge stories',()=>{
 assert.deepEqual(records.filter(r=>!r.date).map(r=>r.id),['news-01-ds-2025','news-11-sushi-tech-2024']);
 assert.equal(comparePublicationDates(undefined,new Date('2025-01-01')),1);assert.equal(comparePublicationDates(new Date('2025-01-01'),undefined),-1);assert.equal(comparePublicationDates(undefined,undefined),0);
 assert.equal(records.find(r=>r.id==='news-05-tadte-2025')!.date,records.find(r=>r.id==='news-13-future-combat')!.date);
});
test('image planning covers all articles and requires explicit approval with local files and three-language alt',()=>{
 const csv=fs.readFileSync('NEWS-IMAGE-MANIFEST.csv','utf8');
 const registry=JSON.parse(fs.readFileSync('src/data/news-images.json','utf8')) as Record<string,{approved:boolean;filename:string;alt?:Record<string,string>}>;
 assert.equal(Object.keys(registry).length,13);for(const row of Object.values(registry)){assert.equal(typeof row.approved,'boolean');assert.ok(csv.includes('\"'+row.filename+'\"'));assert.ok(/^\d{4}-[a-z0-9-]+\.(jpg|jpeg|png)$/.test(row.filename));if(row.approved){assert.ok(fs.existsSync('src/assets/images/news/'+row.filename));for(const lang of ['tw','en','jp'])assert.ok(row.alt?.[lang]?.trim());}}
 assert.equal(csv.trim().split('\n').length,14);assert.ok(csv.includes('1763974963549.jpeg'));
 assert.equal(records.filter(r=>!r.imageSource).length,2);
});
