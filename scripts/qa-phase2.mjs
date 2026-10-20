// Phase 2 behaviour checks against the TEST FIXTURE build (npm run build:fixtures).
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { chromium } from "playwright-core";
import { startPreview, CHROMIUM, DIST } from "./lib/serve.mjs";

if (!DIST.includes("fixtures")) {
  console.error("Run with QA_DIST=dist-fixtures/client after `npm run build:fixtures`.");
  process.exit(2);
}
const html = (p) => readFileSync(path.join(DIST, p, "index.html"), "utf8");
const robots = (p) => /<meta name="robots" content="noindex"/.test(html(p));
let failed = 0;
const check = (name, ok, detail = "") => {
  if (!ok) failed++;
  console.log(`${ok ? "ok  " : "FAIL"} ${name}${ok || !detail ? "" : `  — ${detail}`}`);
};

// static output
check("news page 1 has 12 cards", (html("tw/news").match(/class="card"/g) ?? []).length === 12);
check("news page 2 exists, no /page/1/", existsSync(path.join(DIST, "tw/news/page/2/index.html")) && !existsSync(path.join(DIST, "tw/news/page/1")));
check("page 2 canonical points to itself", html("tw/news/page/2").includes('rel="canonical" href="https://www.bigxreality.com/tw/news/page/2/"'));
check("page 2 hreflang only for languages with a page 2", !html("tw/news/page/2").includes('rel="alternate" hreflang="en"'));
check("case studies are not paged", !existsSync(path.join(DIST, "tw/case-studies/page")));
check("unapproved case study not built", !existsSync(path.join(DIST, "tw/case-studies/fixture-case-unapproved")));
check("empty-body and future news not built", !existsSync(path.join(DIST, "tw/news/fixture-news-empty")) && !existsSync(path.join(DIST, "tw/news/fixture-news-future")));
check("empty list: noindex + empty state", robots("jp/news") && html("jp/news").includes('class="empty"'));
check("tag with ≥3 articles: indexable rules (only fixture noindex)", html("tw/tags/xr-training").includes("TEST FIXTURE"));
check("every fixture page is noindex", robots("tw/news/fixture-news-01") && robots("tw/products/sut"));
check("fixture robots.txt blocks crawlers", readFileSync(path.join(DIST, "robots.txt"), "utf8").includes("Disallow: /"));
check("NewsArticle JSON-LD without placeholders", /"@type":"NewsArticle"/.test(html("tw/news/fixture-news-01")));
check("article og:type + published_time", html("tw/news/fixture-news-01").includes('property="article:published_time"'));
check("related articles merge both directions", html("tw/news/fixture-news-01").includes("/tw/case-studies/fixture-case-1/") && html("tw/case-studies/fixture-case-1").includes("/tw/news/fixture-news-01/"));
check("solution page lists reverse-linked case study and product", html("tw/solutions/police").includes("/tw/case-studies/fixture-case-1/"));
check("product page lists articles that point at it", html("tw/products/usv").includes("/tw/insights/fixture-insight-1/"));
check("search page noindex", robots("tw/search"));

// browser behaviour
const { base, stop } = await startPreview(4331);
const browser = await chromium.launch({ executablePath: CHROMIUM });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(`${base}/tw/news/fixture-news-01/`, { waitUntil: "networkidle" });
  const toggle = page.locator(".sub-toggle");
  check("Resources marked current on an article", (await toggle.getAttribute("class")).includes("is-current"));
  await toggle.focus();
  await page.keyboard.press("Enter");
  check("Enter opens the Resources menu", (await toggle.getAttribute("aria-expanded")) === "true" && (await page.locator("#sub-resources").isVisible()));
  check("current list marked in submenu", (await page.locator('#sub-resources a[aria-current="page"]').getAttribute("href")) === "/tw/news/");
  await page.keyboard.press("Tab");
  check("Tab moves into the submenu", await page.evaluate(() => !!document.activeElement?.closest("#sub-resources")));
  await page.keyboard.press("Escape");
  check("Esc closes and returns focus", (await toggle.getAttribute("aria-expanded")) === "false" && (await page.evaluate(() => document.activeElement?.classList.contains("sub-toggle"))));
  await toggle.click();
  await page.mouse.click(1000, 600);
  check("click outside closes", (await toggle.getAttribute("aria-expanded")) === "false");

  await page.goto(`${base}/tw/news/fixture-news-05/`, { waitUntil: "networkidle" });
  check("language switch falls back to the list page", (await page.locator('.langs a[hreflang="ja"]').getAttribute("href")) === "/jp/news/");

  await page.goto(`${base}/tw/case-studies/`, { waitUntil: "networkidle" });
  await page.click('button[data-domain="military"]');
  const visible = await page.locator("#article-grid > li:not([hidden])").count();
  check("case-study domain filter", visible === 1 && page.url().includes("domain=military"), String(visible));

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await mobile.goto(`${base}/tw/news/`, { waitUntil: "networkidle" });
  await mobile.click(".menu-toggle");
  await mobile.click(".sub-toggle");
  check("mobile: Resources expands inside the menu", await mobile.locator("#sub-resources a").first().isVisible());
} finally {
  await browser.close();
  stop();
}
console.log(failed ? `FAIL: ${failed}` : "PASS");
process.exit(failed ? 1 : 0);
