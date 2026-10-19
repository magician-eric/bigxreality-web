// Lighthouse (mobile preset, default throttling) on one page served from dist/.
// Usage: node scripts/qa-lighthouse.mjs [/path/]  → prints the four category scores,
// writes the full HTML report to .qa/lighthouse.html
import lighthouse from "lighthouse";
import * as chromeLauncher from "chrome-launcher";
import { mkdir, writeFile } from "node:fs/promises";
import { startPreview, CHROMIUM } from "./lib/serve.mjs";

const target = process.argv[2] ?? "/tw/products/sut/";
const { base, stop } = await startPreview(4332);
const chrome = await chromeLauncher.launch({ chromePath: CHROMIUM, chromeFlags: ["--headless=new", "--no-sandbox"] });
try {
  const result = await lighthouse(base + target, { port: chrome.port, output: "html", logLevel: "error" });
  const cats = result.lhr.categories;
  for (const k of ["performance", "accessibility", "best-practices", "seo"]) console.log(`${k.padEnd(15)} ${Math.round(cats[k].score * 100)}`);
  const a = result.lhr.audits;
  for (const k of ["first-contentful-paint", "largest-contentful-paint", "total-blocking-time", "cumulative-layout-shift", "speed-index"]) console.log(`  ${k.padEnd(26)} ${a[k].displayValue}`);
  const failing = Object.values(a).filter((x) => x.score !== null && x.score < 0.9 && x.scoreDisplayMode !== "informative" && x.scoreDisplayMode !== "notApplicable");
  if (failing.length) console.log("audits below 0.9:\n" + failing.map((x) => `  - ${x.id}: ${x.title}${x.displayValue ? ` (${x.displayValue})` : ""}`).join("\n"));
  await mkdir(".qa", { recursive: true });
  await writeFile(".qa/lighthouse.html", result.report);
} finally {
  chrome.kill();
  stop();
}
