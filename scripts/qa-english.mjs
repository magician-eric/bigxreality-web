// English solutions and product pages (/en/): exact headlines and labels, no Chinese or placeholder
// text on the page body, correct relations and links, the copy's implementation restrictions, SEO.
import { chromium } from "playwright-core";
import { readFileSync } from "node:fs";
import path from "node:path";
import { startPreview, CHROMIUM, DIST } from "./lib/serve.mjs";

let failed = 0;
const check = (name, ok, detail = "") => {
  if (!ok) failed++;
  console.log(`${ok ? "ok  " : "FAIL"} ${name}${ok || !detail ? "" : `  — ${detail}`}`);
};
const PRODUCTS = [
  ["sut", "Train as a Team. Respond with Confidence.", "Explore SUT Training", "SUT Small Unit Tactical Training System"],
  ["uav", "Prepare for Unmanned Aerial Operations and Emerging Threats.", "Explore UAV Training", "Drone Tactical & Counter-UAS Training System"],
  ["full-scale-police-training", "Immersive Training for Demanding Law Enforcement Scenarios.", "Explore On-site Police Training", "BXR Police Training System — On-site"],
  ["police-box", "Bring Police Training Where It Is Needed.", "Explore Police BOX", "BXR Police BOX — Portable Training System"],
  ["wargaming-table", "Visualize the Battlefield. Explore Tactical Decisions.", "Explore Wargaming Solutions", "BXR Wargaming Table"],
  ["mortar-observation", "Develop Observation and Fire Adjustment Skills Through Simulation.", "Explore Mortar Observation Training", "Mortar Observation Simulator"],
  ["sniper-simulator", "Practice Precision, Observation, and Tactical Judgment.", "Explore Sniper Training", "Sniper Rifle Simulator"],
  ["machine-gun-simulator", "Build Weapon Familiarity and Tactical Fire Discipline.", "Explore Machine Gun Training", "Machine Gun Simulator"],
  ["hmmwv-simulator", "Prepare Vehicle Operators for Challenging Missions.", "Explore Humvee Training", "Humvee Driving Simulator"],
  ["tactical-boat-simulator", "Practice Tactical Boat Handling in a Virtual Maritime Environment.", "Explore Speedboat Training", "Military Speedboat Simulator"],
  ["usv", "Explore Unmanned Surface Vessel Operations Through VR.", "Explore USV Training", "USV VR Training System"],
  ["fire-extinguisher-simulator", "Learn Fire Extinguisher Skills Through Immersive Practice.", "Explore VR Fire Training", "VR Fire Extinguisher Training System"],
];
const SOLUTIONS = [
  ["military", "From Individual Skills to Joint Operations", "Discuss Military Training Solutions", "Military Simulation"],
  ["mum-t", "Connected Information. Coordinated Small-Unit Action.", "Contact Our Team", "MUM-T Small-Unit Tactical Coordination"],
  ["nova", "Connecting Simulation Systems for Larger-Scale Joint Training", "Discuss Joint Simulation Integration", "NOVA Joint Simulation Integration"],
  ["police", "Prepare for the Decisions That Matter in the Field", "Discuss Law Enforcement Training", "Law Enforcement Training"],
  ["fire-rescue", "Build Practical Emergency Skills Before They Are Needed", "Explore Fire Training Solutions", "Fire & Disaster Preparedness"],
  ["smart-city", "Make Complex Environments Easier to Understand", "Contact BXR", "Smart City"],
];
const CJK = /[぀-ヿ㐀-鿿]/;
const { base, stop } = await startPreview(4339);
const browser = await chromium.launch({ executablePath: CHROMIUM });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const html = (p) => readFileSync(path.join(DIST, p, "index.html"), "utf8");

  // navigation labels
  await page.goto(`${base}/en/solutions/`, { waitUntil: "networkidle" });
  const top = await page.$$eval(".nav-list > li", (lis) => lis.map((li) => { const el = li.querySelector("a,button,span.nav-link")?.cloneNode(true); el?.querySelectorAll(".visually-hidden").forEach((n) => n.remove()); return (el?.textContent ?? "").trim(); }));
  check("nav: Solutions / Products / Core Technology / Resources / About BXR", JSON.stringify(top) === JSON.stringify(["Solutions", "Products", "Core Technology", "Resources", "About BXR"]), top.join(" | "));
  check("nav: Resources lists News, Insights, Case Studies", JSON.stringify(await page.$$eval("#sub-resources a", (as) => as.map((a) => a.textContent.trim()))) === JSON.stringify(["News", "Insights", "Case Studies"]));
  check("nav: contact button reads Contact Us", (await page.locator("a.contact").innerText()).trim() === "Contact Us");

  // solutions landing
  check("landing: headline", (await page.locator("h1").innerText()).trim() === "Integrated Solutions for Training, Safety, and Smart Applications");
  const cards = await page.$$eval("#solution-list article.card", (as) => as.map((a) => [a.querySelector("h3")?.textContent.trim(), a.querySelector(".english")?.textContent.trim(), a.querySelector(".more")?.textContent.replace(/\s+/g, " ").trim()]));
  check("landing: exactly four category cards with headline and CTA", JSON.stringify(cards) === JSON.stringify([
    ["Military Simulation", "Train for Complex Missions. Build Operational Readiness.", "Explore Military Solutions →"],
    ["Law Enforcement Training", "Prepare Officers for Real-World Decisions.", "Explore Law Enforcement Solutions →"],
    ["Fire & Disaster Preparedness", "Practice Critical Skills in a Safer Environment.", "Explore Fire & Disaster Solutions →"],
    ["Smart City", "Connect Digital Environments with Real-World Challenges.", "Explore Smart City Solutions →"]]), JSON.stringify(cards));
  check("landing: shared benefits and final CTA", (await page.locator("section[aria-labelledby=h-highlights] .value").count()) === 4 && (await page.locator("section[aria-labelledby=solutions-cta] a.btn").innerText()).trim() === "Contact BXR");

  const pages = [...SOLUTIONS.map((s) => ["solutions", ...s]), ...PRODUCTS.map((p) => ["products", ...p])];
  for (const [kind, slug, h1, cta, name] of pages) {
    const url = `/en/${kind}/${slug}/`;
    await page.goto(base + url, { waitUntil: "networkidle" });
    const body = await page.locator("main").innerText();
    check(`${url}: headline`, (await page.locator("h1").innerText()).trim() === h1);
    check(`${url}: hero button label`, (await page.locator(".page-hero a.btn").first().innerText()).trim() === cta);
    check(`${url}: English only, no placeholder text`, !CJK.test(body) && !body.includes("[待"), (body.match(CJK)?.[0] ?? "") + (body.includes("[待") ? " [待" : ""));
    const raw = html(`en/${kind}/${slug}`);
    check(`${url}: indexable, canonical and hreflang`, !/name="robots" content="noindex"/.test(raw) && raw.includes(`rel="canonical" href="https://www.bigxreality.com${url}"`) && raw.includes('hreflang="zh-Hant-TW"') && !raw.includes("translation-banner"));
    check(`${url}: title and description in English`, !CJK.test((await page.title())) && !CJK.test(await page.getAttribute('meta[name=description]', "content")));
    const empties = await page.locator("main section").evaluateAll((ss) => ss.filter((s) => !s.innerText.trim()).length);
    check(`${url}: no empty sections`, empties === 0);
  }

  // product page structure and restrictions
  const text = async (slug) => { await page.goto(`${base}/en/products/${slug}/`, { waitUntil: "networkidle" }); return page.locator("main").innerText(); };
  const sut = await text("sut");
  check("product: section labels", ["Training Challenges", "How It Works", "Key Capabilities", "Applications", "Training Benefits"].every((l) => sut.includes(l)) && (await page.locator("h2").allInnerTexts()).includes("Key Capabilities"));
  check("product: back link and closing CTA", (await page.locator('.back a[href="/en/products/"]').innerText()).includes("Back to Products") && (await page.locator("section[aria-labelledby=product-cta]").innerText()).includes("Contact Our Team"));
  const uav = await text("uav");
  check("uav: no detection, jamming, interception or disabling claims", !/\b(jam|jams|jamming|intercept|intercepts|disable|disables|detect|detects)\b/i.test(uav.replace("Counter-UAS threat recognition", "")));
  const usv = await text("usv");
  check("usv: confirmed integration stated, no control / autonomy / sensor claims", usv.includes("USV visual information can be transmitted to the SUT system within the supported integration configuration.") && !/remote|autonomous|sensor fusion/i.test(usv));
  const war = await text("wargaming-table");
  check("wargaming: no interoperability claim", !/interoperab|NOVA/i.test(war));
  const mortar = await text("mortar-observation");
  check("mortar: not described as a physical firing simulator", !/physical mortar|firing simulator/i.test(mortar));
  const fire = await text("fire-extinguisher-simulator");
  check("fire product: training environments shown", fire.includes("Residential kitchen, living room, office, technology facility, port, and industrial building scenarios."));

  // relations
  const rel = async (url, sel = "main section[aria-labelledby=h-related] a") => { await page.goto(base + url, { waitUntil: "networkidle" }); return page.locator(sel).evaluateAll((as) => [...new Set(as.map((a) => a.getAttribute("href")))]); };
  const mil = await rel("/en/solutions/military/", "main a[href^='/en/products/']");
  check("military: its nine products are linked", ["sut", "uav", "wargaming-table", "mortar-observation", "sniper-simulator", "machine-gun-simulator", "hmmwv-simulator", "tactical-boat-simulator", "usv"].every((s) => mil.includes(`/en/products/${s}/`)));
  const milFeat = await page.locator(".featured .feat a").evaluateAll((as) => as.map((a) => a.getAttribute("href")));
  check("military: MUM-T and NOVA are separate sub-solution pages", JSON.stringify(milFeat) === JSON.stringify(["/en/solutions/mum-t/", "/en/solutions/nova/"]));
  const pol = await rel("/en/solutions/police/", ".featured .feat a");
  check("law enforcement: featured products link to both product pages", JSON.stringify(pol) === JSON.stringify(["/en/products/full-scale-police-training/", "/en/products/police-box/"]));
  check("fire: related product", (await rel("/en/solutions/fire-rescue/")).includes("/en/products/fire-extinguisher-simulator/"));
  const sc = await rel("/en/solutions/smart-city/", "main a[href^='/en/products/']");
  check("smart city: no standalone product cards", sc.length === 0);
  check("smart city: caveat paragraph present", (await page.locator("main").innerText()).includes("The capabilities described below represent potential application directions."));
  check("nova: scope statement present", (await (async () => { await page.goto(`${base}/en/solutions/nova/`, { waitUntil: "networkidle" }); return page.locator("main").innerText(); })()).includes("NOVA should not be interpreted as a claim that every BXR product is already connected or interoperable."));
  check("solution page: back link", (await page.locator('.back a[href="/en/solutions/"]').innerText()).includes("Back to Solutions"));
  check("no case study blocks without published cases", (await page.locator("[data-related-cases]").count()) === 0);

  // sitemap and phone / tablet
  const sm = readFileSync(path.join(DIST, "sitemap.xml"), "utf8");
  check("sitemap lists the English solutions and products", pages.every(([k, s]) => sm.includes(`/en/${k}/${s}/`)) && sm.includes("/en/solutions/"));
  for (const [w, label] of [[390, "phone"], [820, "tablet"]]) {
    const v = await browser.newPage({ viewport: { width: w, height: 900 } });
    for (const p of ["/en/solutions/", "/en/solutions/military/", "/en/solutions/police/", "/en/solutions/smart-city/", "/en/products/sut/", "/en/products/usv/", "/en/products/fire-extinguisher-simulator/"]) {
      await v.goto(base + p, { waitUntil: "networkidle" });
      check(`${label} ${p}: no horizontal scroll`, await v.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth));
    }
    await v.close();
  }
} finally {
  await browser.close();
  stop();
}
console.log(failed ? `FAIL: ${failed}` : "PASS");
process.exit(failed ? 1 : 0);
