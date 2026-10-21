import assert from 'node:assert/strict';
import { chromium } from 'playwright-core';
import { startPreview, CHROMIUM, resolveDist } from './lib/serve.mjs';
const server=await startPreview(4357), browser=await chromium.launch({executablePath:CHROMIUM});
let cases=0;
try {
for(const lang of ['tw','en','jp']) for(const width of [1440,768,390]) {
const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
await page.goto(`${server.base}/${lang}/products/`);
for(const [group,count] of [['solutions',4],['products',3],['technologies',7]]) {
const toggle=page.locator(`[aria-controls="sub-${group}"]`);
if(width<1024) await page.locator('.menu-toggle').click();
await toggle.focus();await page.keyboard.press('Enter');
assert.equal(await toggle.getAttribute('aria-expanded'),'true');
const links=await page.locator(`#sub-${group} a`).evaluateAll(as=>as.map(a=>a.getAttribute('href')));
assert.equal(links.length,count);
for(const href of links) assert.ok(await resolveDist(href),href);
assert.ok(await page.locator(`.nav-heading > a[href="/${lang}/${group}/"]`).count());
await page.keyboard.press('ArrowDown');assert.ok(await page.evaluate(group=>!!document.activeElement.closest(`#sub-${group}`),group));
await page.keyboard.press('Escape');assert.equal(await toggle.getAttribute('aria-expanded'),'false');
if(width<1024) await page.locator('.menu-toggle').click();
}
assert.equal(await page.locator('.back-to-top').isVisible(),false);
await page.evaluate(()=>scrollTo(0,650));await page.waitForFunction(()=>!document.querySelector('.back-to-top').hidden);
const rect=await page.locator('.back-to-top').boundingBox();assert.ok(rect.x+rect.width<=width-16);assert.equal(rect.width,48);
await page.locator('.back-to-top').focus();await page.keyboard.press('Enter');await page.waitForFunction(()=>scrollY===0 && document.querySelector(".back-to-top").hidden);assert.equal(await page.locator('.back-to-top').isVisible(),false);
if(width===1440) {
await page.emulateMedia({reducedMotion:'no-preference'});
await page.evaluate(()=>scrollTo(0,650));
await page.waitForFunction(()=>!document.querySelector('.back-to-top').hidden);
await page.locator('.back-to-top').click();
await page.waitForFunction(()=>scrollY===0&&document.querySelector('.back-to-top').hidden);
}
for(const domain of ['military','police','fire-rescue']) {
await page.goto(`${server.base}/${lang}/products/?domain=${domain}`);
assert.equal(await page.locator(`[data-domain="${domain}"]`).getAttribute('aria-pressed'),'true');
assert.equal(await page.locator('#product-grid > li:not([hidden])').evaluateAll((items,domain)=>items.every(i=>i.dataset.domains.split(' ').includes(domain)),domain),true);
}
for(const route of ['products/sut','solutions/military','technologies/ai-simulation','company']) {
await page.goto(`${server.base}/${lang}/${route}/`);
const layout=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,placeholders:[...document.querySelectorAll('.placeholder')].map(el=>el.getBoundingClientRect().height),padding:[...document.querySelectorAll('main .section')].map(el=>parseFloat(getComputedStyle(el).paddingTop))}));
assert.equal(layout.overflow,false,`${lang}/${route} @${width}`);
assert.ok(layout.placeholders.every(h=>h<=201));
assert.ok(layout.padding.every(h=>h>=32&&h<=72));
}
assert.ok(await page.locator('.site-header').evaluate(el=>el.scrollWidth<=innerWidth));
await page.close();cases++;
}
console.log(`PASS: ${cases} language/viewport combinations; dropdowns, links, category filters, keyboard and reduced-motion back-to-top`);
}finally {await browser.close();server.stop();}
