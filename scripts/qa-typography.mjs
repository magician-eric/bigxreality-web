import fs from'node:fs';import path from'node:path';import assert from'node:assert/strict';import{chromium}from'playwright-core';import{startPreview,CHROMIUM,DIST}from'./lib/serve.mjs';
const out='docs/reviews/typography';fs.mkdirSync(out,{recursive:true});
function routes(dir,list=[]){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory()&&!['_astro','pagefind','admin','fonts','media','video'].includes(e.name))routes(p,list);else if(e.name==='index.html'){const r='/'+path.relative(DIST,path.dirname(p)).replaceAll(path.sep,'/')+'/';if(/^\/(tw|en|jp)\//.test(r)&&!r.includes('/news/filter/'))list.push(r);}}return list;}
const representative=['','products/','products/sniper-simulator/','products/sut/','solutions/military/','technologies/xr/','news/','company/','company/team/','company/csr/','contact/'].flatMap(r=>['tw','en','jp'].map(l=>`/${l}/${r}`));
const all=routes(DIST),chosen=representative.filter(r=>all.includes(r));
const server=await startPreview(4389),browser=await chromium.launch({executablePath:CHROMIUM});let checked=0,headings=0,phrases=0;const reviews=[],errors=[];
try{const p=await browser.newPage({reducedMotion:'reduce'});p.on('pageerror',e=>errors.push(e.message));
for(const width of[320,375,390,430,768,1024,1440]){await p.setViewportSize({width,height:1000});for(const route of([320,1440].includes(width)?all:chosen)){
 assert.equal((await p.goto(server.base+route)).status(),200);await p.evaluate(()=>document.fonts.ready);
 const result=await p.evaluate(()=>{
  function lines(el){const map=new Map(),walk=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);let n;while(n=walk.nextNode())for(let i=0;i<n.length;i++){const r=new Range();r.setStart(n,i);r.setEnd(n,i+1);const b=r.getBoundingClientRect();if(b.width>0){const y=Math.round(b.y);map.set(y,(map.get(y)||'')+n.textContent[i]);}}return[...map.values()].map(s=>s.trim()).filter(Boolean);}
  const hs=[...document.querySelectorAll('main h1,main h2,main h3,main h4')].filter(e=>e.getBoundingClientRect().width>1&&!e.closest('.visually-hidden,[hidden]')).map(e=>({text:e.textContent,lines:lines(e)}));
  const phraseElements=[...document.querySelectorAll('main .type-phrase')];
  const splits=phraseElements.filter(e=>e.textContent.includes('環境判讀')&&lines(e).length>1).map(e=>e.textContent);
  const overflow=[...document.querySelectorAll('main h1,main h2,main h3,main h4,main .summary,main .desc,main .btn')].filter(e=>!e.closest('.visually-hidden,[hidden]')&&e.clientWidth>1&&e.scrollWidth>e.clientWidth+2).map(e=>e.textContent);
  const excess=[...document.querySelectorAll('main .section-head .copy')].filter(e=>e.lastElementChild&&e.getBoundingClientRect().bottom-e.lastElementChild.getBoundingClientRect().bottom>8).map(e=>e.textContent);
  return{excess,overflow,pageOverflow:document.documentElement.scrollWidth>innerWidth+1,hs,splits,phrases:phraseElements.length};
 });
 assert.equal(result.pageOverflow,false,`${route} @${width} horizontal overflow`);assert.deepEqual(result.overflow,[],`${route} @${width} text overflow`);assert.deepEqual(result.excess,[],`${route} @${width} empty heading space`);assert.deepEqual(result.splits,[],`${route} @${width} protected term split`);
 for(const h of result.hs){const final=h.lines.at(-1);if(h.lines.length>1&&(/^[\u3400-\u9fff\u3040-\u30ff]$/u.test(final)||h.lines.some(line=>/^[．，。、；：！？）」』】》・·]/u.test(line))))reviews.push({route,width,title:h.text,lines:h.lines,reason:'末行單字或標點，建議人工檢視'});}
 checked++;headings+=result.hs.length;phrases+=result.phrases;
 }console.log(`checked ${width}: ${checked} page/viewports`);}
assert.deepEqual(errors,[]);
fs.writeFileSync(`${out}/MANUAL-REVIEW.json`,JSON.stringify(reviews,null,2));fs.writeFileSync(`${out}/RESULTS.json`,JSON.stringify({pageViewportChecks:checked,headingChecks:headings,phraseChecks:phrases,widths:[320,375,390,430,768,1024,1440],fullRouteChecks:[320,1440],representativeRoutes:chosen,manualReviewCandidates:reviews.length,jsErrors:errors.length},null,2));console.log('PASS: wrapping, text overflow, protected terms; manual candidates',reviews.length);
}finally{await browser.close();server.stop();}
