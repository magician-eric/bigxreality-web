import assert from 'node:assert/strict';
import { chromium } from 'playwright-core';
import { startPreview, CHROMIUM } from './lib/serve.mjs';
const server = await startPreview(4360);
const browser = await chromium.launch({ executablePath: CHROMIUM });
let checked = 0;
try {
  for (const lang of ['tw', 'en', 'jp']) for (const width of [1440, 768, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'no-preference', hasTouch: width < 1024 });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(`${server.base}/${lang}/products/sut/`);
    const heading = page.locator('main .section-head').filter({ has: page.locator('h2') }).last();
    await heading.evaluate(el => {
      el.dataset.entrances = '0';
      el.addEventListener('animationstart', event => { if (event.animationName === 'bxr-enter') el.dataset.entrances = String(Number(el.dataset.entrances) + 1); });
    });
    await page.evaluate(() => document.fonts.ready);
    const height = await page.evaluate(() => document.documentElement.scrollHeight);
    await heading.scrollIntoViewIfNeeded();
    await page.waitForFunction(() => document.querySelector('[data-entrances]')?.getAttribute('data-entrances') === '1');
    await page.waitForFunction(() => !document.querySelector('[data-entrances]').classList.contains('motion-enter'));
    await page.evaluate(() => scrollTo(0, 0));
    await heading.scrollIntoViewIfNeeded();
    assert.equal(await heading.getAttribute('data-entrances'), '1');
    assert.equal(await page.evaluate(() => document.documentElement.scrollHeight), height);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    assert.equal(await page.locator('.motion-enter').count(), 0);
    await page.reload();
    await heading.scrollIntoViewIfNeeded();
    assert.equal(await heading.evaluate(el => getComputedStyle(el).animationName), 'none');
    assert.equal(await heading.evaluate(el => getComputedStyle(el).opacity), '1');
    await page.goto(`${server.base}/${lang}/products/`);
    const card = page.locator('[data-interactive-card]').first();
    if (width === 1440) {
      await card.hover();
      assert.equal(await card.evaluate(el => getComputedStyle(el).transform), 'none');
      await page.emulateMedia({ reducedMotion: 'no-preference' });
      await page.waitForFunction(() => getComputedStyle(document.querySelector('[data-interactive-card]')).transform === 'matrix(1, 0, 0, 1, 0, -3)');
      await page.keyboard.press('Tab');
      await card.locator('.title a').focus();
      assert.ok(await card.evaluate(el => getComputedStyle(el).outlineStyle !== 'none'));
    }
    await page.goBack();
    assert.equal(await page.locator('h1').count(), 1);
    assert.equal(await page.locator('.motion-enter').count(), 0);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    assert.deepEqual(errors, []);
    await page.close(); checked++;
  }
  for (const disabled of ['javascript', 'observer']) {
    const context = await browser.newContext({ javaScriptEnabled: disabled !== 'javascript' });
    if (disabled === 'observer') await context.addInitScript(() => { delete window.IntersectionObserver; });
    const page = await context.newPage();
    await page.goto(`${server.base}/tw/products/sut/`);
    assert.ok(await page.locator('main h2').count());
    assert.equal(await page.locator('.motion-enter').count(), 0);
    assert.equal(await page.locator('main .section-head').first().evaluate(el => getComputedStyle(el).opacity), '1');
    await context.close();
  }
  console.log(`PASS: ${checked} language/viewport combinations; one-time entrance, stable height, reduced motion, card feedback, keyboard focus, history/reload, no-JS/no-observer fallbacks`);
} finally { await browser.close(); server.stop(); }
