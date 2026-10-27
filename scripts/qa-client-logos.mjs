import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import sharp from 'sharp';
import { chromium } from 'playwright-core';
import { startPreview, CHROMIUM } from './lib/serve.mjs';
const config=JSON.parse(fs.readFileSync('src/data/client-logos.json','utf8'));
const count=config.filter(x=>x.enabled).length;
const hashes=new Map();
for(const row of config.filter(x=>x.enabled)) { const pixels=await sharp(`src/assets/images/clients/${row.file}`).ensureAlpha().raw().toBuffer({resolveWithObject:true});const hash=crypto.createHash('sha256').update(JSON.stringify(pixels.info)).update(pixels.data).digest('hex');assert.ok(!hashes.has(hash),`Duplicate: ${row.file} / ${hashes.get(hash)}`);hashes.set(hash,row.file); }
const server=await startPreview(4374),browser=await chromium.launch({executablePath:CHROMIUM});
try{
 const p=await browser.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{if(r.status()>=400)errors.push(r.url());});
 for(const lang of ['tw','en','jp'])for(const width of [1440,768,390]){
  await p.setViewportSize({width,height:900});await p.goto(`${server.base}/${lang}/`);const marquee=p.locator('[data-client-logos="marquee"]');
  assert.equal(await marquee.locator('.logo-group').count(),2);assert.equal(await marquee.locator('.logo-group').first().locator('img').count(),count);assert.equal(await marquee.locator('.logo-group[aria-hidden="true"]').count(),1);
  assert.ok(await p.evaluate(()=>{const m=document.querySelector('[data-client-logos="marquee"]'),s=document.querySelector('#h-solutions')?.closest('section');return !!(s.compareDocumentPosition(m)&Node.DOCUMENT_POSITION_FOLLOWING);}));
  const height=await marquee.evaluate(e=>e.getBoundingClientRect().height);assert.ok(height>=120&&height<=150,`${height}`);
  const track=marquee.locator('.track');await p.mouse.move(0,0);
  const dimensions=await track.evaluate(e=>({width:e.getBoundingClientRect().width,duration:parseFloat(getComputedStyle(e).animationDuration)}));const speed=dimensions.width/2/dimensions.duration;assert.ok(speed>=25&&speed<=35,`${speed}`);
  const loop=await track.evaluate(e=>{const a=e.getAnimations()[0],duration=a.effect.getTiming().duration;a.currentTime=0;const first=e.getBoundingClientRect().x;a.currentTime=duration-1;const last=e.getBoundingClientRect().x;a.currentTime=0;return {distance:first-last,half:e.getBoundingClientRect().width/2};});assert.ok(Math.abs(loop.distance-loop.half)<1);
  await marquee.hover();assert.equal(await track.evaluate(e=>getComputedStyle(e).animationPlayState),'paused');
  await p.mouse.move(0,0);await marquee.locator('.viewport').focus();assert.equal(await track.evaluate(e=>getComputedStyle(e).animationPlayState),'paused');
  await marquee.locator('button').click();assert.equal(await marquee.locator('button').getAttribute('aria-pressed'),'true');await p.locator('h1').evaluate(e=>{e.tabIndex=-1;e.focus();});await p.mouse.move(0,0);assert.equal(await track.evaluate(e=>getComputedStyle(e).animationPlayState),'paused');
  await p.emulateMedia({reducedMotion:'reduce'});assert.equal(await track.evaluate(e=>getComputedStyle(e).animationName),'none');assert.equal(await marquee.locator('.logo-group[aria-hidden="true"]').isVisible(),false);
  await p.emulateMedia({reducedMotion:'no-preference'});await p.goto(`${server.base}/${lang}/company/`);const grid=p.locator('[data-client-logos="grid"]');assert.equal(await grid.locator('img').count(),count);
  assert.equal(await grid.locator('.logo-group').evaluate(e=>getComputedStyle(e).gridTemplateColumns.split(' ').length),width>=1024?5:width>=768?3:2);
  await grid.scrollIntoViewIfNeeded();await grid.locator('img').evaluateAll(imgs=>Promise.all(imgs.map(img=>img.decode())));
  for(const img of await grid.locator('img').all()) {assert.ok(await img.evaluate(e=>e.naturalWidth>0&&getComputedStyle(e).objectFit==='contain'));assert.ok(await img.getAttribute('alt'));}
  assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  if(lang==='tw'&&width!==768)await p.screenshot({path:`/tmp/bxr-logos-grid-${width}.png`,fullPage:true});
 }
 assert.deepEqual(errors,[]);console.log(`PASS: ${count} unique logos, TW/EN/JP × 1440/768/390, 25–35px/s seamless loop, hover/focus/manual pause, reduced motion, 5/3/2 grid, valid images and no overflow.`);
}finally{await browser.close();server.stop();}
