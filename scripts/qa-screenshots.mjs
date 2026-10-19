// Full-page screenshots of the phase 1 QA pages at 1440 px and 390 px.
// Output: docs/screenshots/phase-1/<page>-<width>.png
import { chromium } from "playwright-core";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { startPreview, CHROMIUM } from "./lib/serve.mjs";

const PAGES = ["/tw/products/", "/tw/products/sut/", "/en/products/sut/"];
const WIDTHS = [1440, 390];
const out = path.resolve(import.meta.dirname, "../docs/screenshots/phase-1");
await mkdir(out, { recursive: true });

const { base, stop } = await startPreview();
const browser = await chromium.launch({ executablePath: CHROMIUM });
try {
  for (const width of WIDTHS) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
    for (const p of PAGES) {
      await page.goto(base + p, { waitUntil: "networkidle" });
      await page.evaluate(() => document.fonts.ready);
      const file = path.join(out, `${p.replace(/^\/|\/$/g, "").replaceAll("/", "-")}-${width}.png`);
      await page.screenshot({ path: file, fullPage: true });
      console.log(file);
    }
    await page.close();
  }
} finally {
  await browser.close();
  stop();
}
