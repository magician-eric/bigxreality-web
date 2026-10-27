import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import YAML from 'yaml';
import {parseHistoricalNews} from '../scripts/lib/historical-news.mjs';
import {comparePublicationDates} from '../src/lib/publication-date.ts';
const source=fs.readFileSync(new URL('../docs/sources/BXR_NEWS_TRILINGUAL_EXPANDED_V2_2026-10-27.txt',import.meta.url),'utf8');
const records=parseHistoricalNews(source);
test('all 90 news translations retain the supplied title, body, date and full-paragraph SEO',()=>{
 assert.equal(records.length,30);assert.equal(records.some(r=>r.id.startsWith('news-14')),false);
 for(const r of records)for(const[lang,copy]of Object.entries(r.languages)){
  const text=fs.readFileSync(`src/content/news/${lang}/${r.id}.md`,'utf8'),end=text.indexOf('\n---',3),data=YAML.parse(text.slice(4,end));
  assert.equal(text.slice(end+5).trim(),copy.body,r.id+'/'+lang);assert.equal(data.title,copy.title);assert.equal(data.summary,copy.summary);assert.equal(data.seo.title,copy.title);assert.equal(data.seo.description,copy.summary);assert.equal(data.imageId,r.id);assert.equal(data.mediaId,r.id);assert.equal(data.dateCandidate,r.dateCandidate);assert.equal(data.articleId,r.id);assert.equal(data.category,r.category);
  if(r.date)assert.equal(data.publishDate,r.date);else{assert.equal(data.publishDate,undefined);assert.equal(data.dateUnconfirmed,true);assert.ok(data.dateNote.includes(r.dateNote));}
 }
});
test('unknown dates remain undated, sort last, and equal dates do not merge stories',()=>{
 assert.deepEqual(records.filter(r=>!r.date).map(r=>r.id),['news-07-indo-defence','news-11-sushi-tech-2024','news-15-media-visit-2026']);
 assert.equal(comparePublicationDates(undefined,new Date('2025-01-01')),1);assert.equal(comparePublicationDates(new Date('2025-01-01'),undefined),-1);assert.equal(comparePublicationDates(undefined,undefined),0);
 assert.equal(records.find(r=>r.id==='news-05-tadte-2025')!.date,records.find(r=>r.id==='news-13-future-combat')!.date);
});
test('one candidate cover per article, no fabricated gallery entries or video URLs',()=>{
 const registry=JSON.parse(fs.readFileSync('src/data/news-media.json','utf8')) as Record<string,{cover:{filename:string;approved:boolean;alt?:Record<string,string>};gallery:unknown[];videos:{type:string;url:string}[]}>;
 const csv=fs.readFileSync('NEWS-MEDIA-MANIFEST.csv','utf8');assert.equal(Object.keys(registry).length,30);
 for(const r of records){const entry=registry[r.id];assert.ok(entry);assert.ok(csv.includes('"'+entry.cover.filename+'"'));assert.ok(/^\d{4}-[a-z0-9-]+\.(jpg|jpeg|png)$/.test(entry.cover.filename));
 for(const video of entry.videos)if(video.type!=='local')assert.ok(r.urls.includes(video.url));}
 for(const r of records)for(const url of r.urls.filter(url=>/youtu(?:be\.com|\.be)|facebook\.com/.test(url)))assert.ok(registry[r.id].videos.some(video=>video.url===url));
});
