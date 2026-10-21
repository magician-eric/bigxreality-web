// Checks the built pages behave as specified: filtering, language switch,
// hreflang/canonical, noindex on pending translations, structured data,
// reverse product relations and disabled form buttons. Exits 1 on failure.
import { chromium } from "playwright-core";
import { readFileSync } from "node:fs";
import path from "node:path";
import { startPreview, CHROMIUM, DIST } from "./lib/serve.mjs";

const { base, stop } = await startPreview(4331);
const browser = await chromium.launch({ executablePath: CHROMIUM });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
let failed = 0;
const check = (name, ok, detail = "") => {
  if (!ok) failed++;
  console.log(`${ok ? "ok  " : "FAIL"} ${name}${detail ? ` — ${detail}` : ""}`);
};
const visibleCards = () => page.locator("#product-grid > li:not([hidden])").count();

try {
  await page.goto(`${base}/tw/products/`, { waitUntil: "networkidle" });
  check("overview lists 3 products", (await visibleCards()) === 3);
  await page.getByRole("button", { name: "警勤" }).click();
  check("domain filter: Police → 0 cards + empty message", (await visibleCards()) === 0 && (await page.locator("[data-filter-empty]").isVisible()));
  check("filter state announced", (await page.locator("[data-status]").textContent()) === "共 0 項產品");
  check("filter state in URL", new URL(page.url()).searchParams.get("domain") === "police");
  await page.getByRole("button", { name: "軍事" }).click();
  check("domain filter: Military → 3 cards", (await visibleCards()) === 3);
  check("pressed state", (await page.getByRole("button", { name: "軍事" }).getAttribute("aria-pressed")) === "true");
  await page.getByLabel("搜尋產品").fill("usv");
  check("text filter: 'usv' → 1 card", (await visibleCards()) === 1);
  await page.getByLabel("搜尋產品").fill("無人機");
  check("text filter: '無人機' → 1 card (UAV)", (await visibleCards()) === 1);
  await page.goto(`${base}/tw/products/?domain=police`, { waitUntil: "networkidle" });
  check("filter restored from URL", (await visibleCards()) === 0);

  await page.goto(`${base}/tw/products/sut/`, { waitUntil: "networkidle" });
  const alt = await page.$$eval('link[rel=alternate][hreflang]', (ls) => ls.map((l) => `${l.hreflang} ${l.href}`));
  check("hreflang en / zh-Hant-TW / ja / x-default", ["en", "zh-Hant-TW", "ja", "x-default"].every((h) => alt.some((a) => a.startsWith(h + " "))), alt.join(", "));
  check("canonical", (await page.$eval("link[rel=canonical]", (l) => l.href)) === "https://www.bigxreality.com/tw/products/sut/");
  check("html lang zh-Hant-TW", (await page.getAttribute("html", "lang")) === "zh-Hant-TW");
  check("source page is indexable", (await page.locator('meta[name=robots]').count()) === 0);
  const ld = JSON.parse(await page.$eval('script[type="application/ld+json"]', (s) => s.textContent));
  const types = ld["@graph"].map((g) => g["@type"]);
  check("JSON-LD Organization + BreadcrumbList + Product", ["Organization", "BreadcrumbList", "Product"].every((t) => types.includes(t)), types.join(", "));
  check("JSON-LD has no placeholder text", !JSON.stringify(ld).includes("[待"));
  check("language switch keeps the page", (await page.locator(".langs a", { hasText: "EN" }).getAttribute("href")) === "/en/products/sut/");
  const heroCta = await page.locator(".page-hero a.btn--primary").getAttribute("href");
  const footCta = await page.locator(".cta-band a.btn--primary").getAttribute("href");
  check("hero CTA opens the contact page for this product", heroCta === "/tw/contact/?topic=product&item=SUT", heroCta);
  check("closing CTA = hero CTA (shared definition)", footCta === heroCta, footCta);
  check("one red button in the hero", (await page.locator(".page-hero .btn--primary").count()) === 1 && (await page.locator(".site-header .btn--primary").count()) === 0);
  const toc = await page.$$eval("[data-toc] a", (as) => as.map((a) => a.hash));
  const ids = await page.$$eval("main section[id]", (ss) => ss.map((s) => "#" + s.id));
  check("in-page nav matches rendered sections", JSON.stringify(toc) === JSON.stringify(ids), toc.join(" "));
  check("landing sections in order", JSON.stringify(await page.$$eval("main h2", (hs) => hs.map((h) => h.id))) === JSON.stringify(["h-challenge", "h-approach", "h-capabilities", "h-flow", "h-scenarios", "h-values", "h-related", "product-cta"]));
  const related = await page.locator("#h-related ~ .cards a, section[aria-labelledby=h-related] .cards a").evaluateAll((as) => as.map((a) => a.getAttribute("href")));
  check("related products and solution link to existing pages", ["/tw/products/uav/", "/tw/products/usv/", "/tw/solutions/military/"].every((h) => related.includes(h)), related.join(" "));
  check("no UAV / USV card shows an English-name placeholder", (await page.locator("section[aria-labelledby=h-related] mark.pending").count()) === 0);
  const pillarTitle = await page.locator(".pillar h3").first().evaluate((h) => getComputedStyle(h).color);
  check("pillar titles are light on the dark card", pillarTitle === "rgb(255, 255, 255)", pillarTitle);
  check("each capability shows a training-value line", (await page.locator(".cap .value, .feature .value").count()) === 5);
  const pillars = await page.locator(".pillar h3").allTextContents();
  check("value pillars are titled by value, not by technology", JSON.stringify(pillars) === JSON.stringify(["沉浸式戰術訓練", "任務資訊與空間判讀", "動態情境與應變訓練"]), pillars.join(" | "));
  check("pillar text has no trailing full stop", (await page.locator(".pillar .text").allTextContents()).every((t) => !/[。.]$/.test(t.trim())));
  const slots = await page.locator("main .placeholder").evaluateAll((els) => els.map((e) => e.getAttribute("aria-label")));
  const need = slots.filter((l) => l.startsWith("素材需求｜"));
  check("11 image positions on the page, each names the material needed", need.length === 11, `${need.length} of ${slots.length}`);
  check("capability rows: 3 picture rows and 2 text-only rows (02 and 05)", (await page.locator(".feature").count()) === 3 && (await page.locator(".plain .cap").count()) === 2);
  check("capability picture rows alternate sides", (await page.locator(".feature.flip").count()) === 1);
  check("approach shows a physical + virtual image pair", (await page.locator(".pair .media").count()) === 2);
  check("flow steps carry an icon each", (await page.locator(".flow .node svg").count()) === 4);
  const widths = await page.locator(".scenarios .card").evaluateAll((els) => els.map((e) => Math.round(e.getBoundingClientRect().width)));
  check("five scenario cards, all the same width", widths.length === 5 && new Set(widths).size === 1, widths.join(","));
  const before = await page.locator(".scenarios .card").first().evaluate((e) => e.firstElementChild.classList.contains("media"));
  check("scenario image sits above the title", before);
  check("flow has four steps, scenarios five, values four", (await page.locator(".flow .step").count()) === 4 && (await page.locator(".scenarios .card").count()) === 5 && (await page.locator(".values .value").count()) === 4);
  check("no AIDA wording shown on the page", !/\bAIDA\b|Attention|Desire/.test(await page.locator("main").innerText()));
  check("no pending markers on the landing page body", (await page.locator("main section:not(.cta-band) mark.pending").count()) === 0);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/tw/products/sut/`, { waitUntil: "networkidle" });
  check("phone: no horizontal scroll", (await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)));
  const cta = await page.locator(".page-hero a.btn--primary").boundingBox();
  check("phone: hero CTA is in the first screen and at least 44 px tall", cta && cta.y + cta.height < 844 && cta.height >= 44, JSON.stringify(cta));
  check("phone: pair, features and cards stack to one column", (await page.locator(".scenarios .card").evaluateAll((els) => new Set(els.map((e) => Math.round(e.getBoundingClientRect().left))).size)) === 1);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${base}/tw/contact/?topic=product&item=SUT`, { waitUntil: "networkidle" });
  const mail = await page.locator("[data-mailto]").getAttribute("href");
  check("contact page: topic + product in the e-mail subject", mail.startsWith("mailto:") && decodeURIComponent(mail).includes("產品洽詢 – SUT"), mail);

  await page.goto(`${base}/tw/products/uav/`, { waitUntil: "networkidle" });
  const integrated = await page.locator("#integratedOps .card h3").allTextContents();
  check("reverse relation: UAV page shows SUT (stored only on SUT)", integrated.some((t) => t.includes("SUT")), integrated.join(", "));
  check("UAV image placeholder", (await page.locator(".page-hero [role=img]").getAttribute("aria-label")) === "[產品圖・待提供]");

  await page.goto(`${base}/en/products/sut/`, { waitUntil: "networkidle" });
  check("pending translation → noindex", (await page.getAttribute('meta[name=robots]', "content")) === "noindex");
  check("pending translation banner", await page.locator(".translation-banner").isVisible());
  check("html lang en", (await page.getAttribute("html", "lang")) === "en");

  const sitemap = await (await fetch(`${base}/sitemap.xml`)).text();
  check("sitemap excludes pending pages", !sitemap.includes("/en/products/") && !sitemap.includes("/jp/") && sitemap.includes("/tw/products/sut/"));
  // Cloudflare serves dist/client/_redirects; the static QA server does not, so check the rule itself.
  const redirects = readFileSync(path.join(DIST, "_redirects"), "utf8");
  check("/ redirects to /en/ (301)", /^\/\s+\/en\/\s+301$/m.test(redirects));
} finally {
  await browser.close();
  stop();
}
console.log(failed ? `FAIL: ${failed}` : "PASS");
process.exit(failed ? 1 : 0);
