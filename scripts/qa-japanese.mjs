// Japanese solutions and product pages (/jp/): exact headlines and labels, no placeholder text in the
// page body, correct relations and links, the copy's implementation restrictions, SEO.
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
  ["sut", "チームで判断し、連携して行動する。その力を訓練から。", "SUT の詳細を見る", "SUT 小部隊戦術訓練システム"],
  ["uav", "無人航空機の運用と、新たな空の脅威に備える。", "ドローン訓練の詳細を見る", "ドローン戦術・対ドローン訓練システム"],
  ["full-scale-police-training", "臨場感のある訓練で、複雑な現場対応に備える。", "常設型警察訓練システムを見る", "BXR 警察訓練システム（常設型）"],
  ["police-box", "必要な場所へ、警察訓練を持ち運ぶ。", "Police BOX の詳細を見る", "BXR Police BOX（可搬型訓練システム）"],
  ["wargaming-table", "戦場を可視化し、戦術的な判断を深める。", "ウォーゲーミングの詳細を見る", "BXR ウォーゲーミングテーブル"],
  ["mortar-observation", "観測と射撃修正の手順を、シミュレーションで習得する。", "迫撃砲観測訓練の詳細を見る", "迫撃砲観測シミュレーター"],
  ["sniper-simulator", "精密な射撃技能と、冷静な状況判断を磨く。", "狙撃銃訓練の詳細を見る", "狙撃銃シミュレーター"],
  ["machine-gun-simulator", "装備の習熟から、戦術的な火力運用の理解へ。", "機関銃訓練の詳細を見る", "機関銃シミュレーター"],
  ["hmmwv-simulator", "厳しい任務環境に備える、軍用車両の運転訓練。", "ハンヴィー訓練の詳細を見る", "ハンヴィー運転訓練シミュレーター"],
  ["tactical-boat-simulator", "仮想の海上環境で、高速艇の操縦技能を磨く。", "高速艇訓練の詳細を見る", "軍用高速艇操縦シミュレーター"],
  ["usv", "無人水上艇の運用を、VR で学ぶ。", "USV 訓練の詳細を見る", "無人水上艇（USV）VR訓練システム"],
  ["fire-extinguisher-simulator", "消火器の操作を、没入型の実践訓練で身につける。", "VR 消火器訓練の詳細を見る", "VR消火器訓練システム"],
];
const SOLUTIONS = [
  ["military", "個人技能から統合訓練まで。多様な任務に対応する軍事シミュレーション。", "軍事訓練について相談する", "軍事シミュレーション"],
  ["mum-t", "情報を共有し、小部隊の連携をより確かなものに。", "お問い合わせ", "MUM-T｜小部隊戦術連携"],
  ["nova", "複数の訓練システムをつなぎ、より広範な統合訓練へ。", "統合シミュレーションについて相談する", "NOVA｜統合シミュレーション"],
  ["police", "現場で求められる判断力と対応力を、実践的な訓練で。", "警察訓練について相談する", "警察訓練シミュレーション"],
  ["fire-rescue", "万一に備える知識を、実践できる技能へ。", "消防訓練ソリューションを見る", "消防・防災"],
  ["smart-city", "複雑な都市環境を、より直感的に理解するために。", "お問い合わせ", "スマートシティ"],
];
const { base, stop } = await startPreview(4340);
const browser = await chromium.launch({ executablePath: CHROMIUM });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const html = (p) => readFileSync(path.join(DIST, p, "index.html"), "utf8");

  await page.goto(`${base}/jp/solutions/`, { waitUntil: "networkidle" });
  const top = await page.$$eval(".nav-list > li", (lis) => lis.map((li) => { const el = li.querySelector("a,button,span.nav-link")?.cloneNode(true); el?.querySelectorAll(".visually-hidden").forEach((n) => n.remove()); return (el?.textContent ?? "").trim(); }));
  check("nav: ソリューション / 製品情報 / コア技術 / リソース / BXRについて", JSON.stringify(top) === JSON.stringify(["ソリューション", "製品情報", "コア技術", "リソース", "BXRについて"]), top.join(" | "));
  check("nav: リソース lists ニュース, 技術コラム, 導入事例", JSON.stringify(await page.$$eval("#sub-resources a", (as) => as.map((a) => a.textContent.trim()))) === JSON.stringify(["ニュース", "技術コラム", "導入事例"]));
  check("nav: contact button reads お問い合わせ", (await page.locator("a.contact").innerText()).trim() === "お問い合わせ");

  check("landing: headline", (await page.locator("h1").innerText()).trim() === "専門訓練からスマート技術の活用まで。現実とデジタルをつなぐソリューション。");
  const cards = await page.$$eval("#solution-list article.card", (as) => as.map((a) => [a.querySelector("h3")?.textContent.trim(), a.querySelector(".english")?.textContent.trim(), a.querySelector(".more")?.textContent.replace(/\s+/g, " ").trim()]));
  check("landing: exactly four category cards with headline and CTA", JSON.stringify(cards) === JSON.stringify([
    ["軍事シミュレーション", "実任務を見据えた訓練で、部隊の即応力を高める。", "軍事ソリューションを見る →"],
    ["警察訓練シミュレーション", "現場で求められる判断力と対応力を、訓練から。", "警察訓練ソリューションを見る →"],
    ["消防・防災", "いざという時のために、安全な環境で実践力を養う。", "消防・防災ソリューションを見る →"],
    ["スマートシティ", "デジタル技術で、都市と社会インフラの可能性を広げる。", "スマートシティソリューションを見る →"]]), JSON.stringify(cards));
  check("landing: shared benefits and final CTA", (await page.locator("section[aria-labelledby=h-highlights] .value").count()) === 4 && (await page.locator("section[aria-labelledby=solutions-cta] a.btn").innerText()).trim() === "お問い合わせ");

  const pages = [...SOLUTIONS.map((s) => ["solutions", ...s]), ...PRODUCTS.map((p) => ["products", ...p])];
  for (const [kind, slug, h1, cta, name] of pages) {
    const url = `/jp/${kind}/${slug}/`;
    await page.goto(base + url, { waitUntil: "networkidle" });
    const body = await page.locator("main").innerText();
    check(`${url}: headline`, (await page.locator("h1").innerText()).trim() === h1);
    check(`${url}: hero button label`, (await page.locator(".page-hero a.btn").first().innerText()).trim() === cta);
    check(`${url}: name in title`, (await page.title()).startsWith(name));
    check(`${url}: no placeholder text`, !body.includes("[待") && !body.includes("待提供"));
    const raw = html(`jp/${kind}/${slug}`);
    check(`${url}: indexable, canonical and hreflang`, !/name="robots" content="noindex"/.test(raw) && raw.includes(`rel="canonical" href="https://www.bigxreality.com${url}"`) && raw.includes('hreflang="zh-Hant-TW"') && raw.includes('hreflang="en"') && !raw.includes("translation-banner"));
    const empties = await page.locator("main section").evaluateAll((ss) => ss.filter((s) => !s.innerText.trim()).length);
    check(`${url}: no empty sections`, empties === 0);
    check(`${url}: no framework names or builder notes`, !/AIDA|実装上の注意|Implementation/.test(body));
  }

  const text = async (slug) => { await page.goto(`${base}/jp/products/${slug}/`, { waitUntil: "networkidle" }); return page.locator("main").innerText(); };
  const sut = await text("sut");
  check("product: section labels", ["訓練課題", "システムによる対応", "主な訓練内容", "主な用途", "導入価値"].every((l) => sut.includes(l)));
  check("product: back link and closing CTA", (await page.locator('.back a[href="/jp/products/"]').innerText()).includes("製品一覧へ戻る") && (await page.locator("section[aria-labelledby=product-cta]").count()) === 1);
  const uav = await text("uav");
  check("uav: no physical detection / jamming claims", !/探知|妨害|迎撃|無力化/.test(uav));
  const usv = await text("usv");
  check("usv: confirmed integration stated, no remote control / autonomy / sensor claims", usv.includes("対応するシステム構成では、USV の映像情報を SUT システムへ伝送できます。") && !/遠隔操縦|自律航行|センサーフュージョン/.test(usv));
  const war = await text("wargaming-table");
  check("wargaming: no interoperability claim", !/相互接続|NOVA/.test(war));
  const mortar = await text("mortar-observation");
  check("mortar: not described as a firing simulator", !/発射操作|実機型/.test(mortar));
  const fire = await text("fire-extinguisher-simulator");
  check("fire product: training environments shown", fire.includes("住宅のキッチン、リビング、オフィス、技術関連施設、港湾、工場建屋など。"));

  const rel = async (url, sel = "main section[aria-labelledby=h-related] a") => { await page.goto(base + url, { waitUntil: "networkidle" }); return page.locator(sel).evaluateAll((as) => [...new Set(as.map((a) => a.getAttribute("href")))]); };
  const mil = await rel("/jp/solutions/military/", "main a[href^='/jp/products/']");
  check("military: its nine products are linked", ["sut", "uav", "wargaming-table", "mortar-observation", "sniper-simulator", "machine-gun-simulator", "hmmwv-simulator", "tactical-boat-simulator", "usv"].every((s) => mil.includes(`/jp/products/${s}/`)));
  const milFeat = await page.locator(".featured .feat a").evaluateAll((as) => as.map((a) => a.getAttribute("href")));
  check("military: MUM-T and NOVA are separate sub-solution pages", JSON.stringify(milFeat) === JSON.stringify(["/jp/solutions/mum-t/", "/jp/solutions/nova/"]));
  const pol = await rel("/jp/solutions/police/", ".featured .feat a");
  check("police: featured products link to both product pages", JSON.stringify(pol) === JSON.stringify(["/jp/products/full-scale-police-training/", "/jp/products/police-box/"]));
  check("fire: related product", (await rel("/jp/solutions/fire-rescue/")).includes("/jp/products/fire-extinguisher-simulator/"));
  const sc = await rel("/jp/solutions/smart-city/", "main a[href^='/jp/products/']");
  check("smart city: no standalone product cards", sc.length === 0);
  check("nova: scope statement present", (await (async () => { await page.goto(`${base}/jp/solutions/nova/`, { waitUntil: "networkidle" }); return page.locator("main").innerText(); })()).includes("NOVA は、すべての BXR 製品がすでに相互接続されていることを意味するものではありません。"));
  check("solution page: back link", (await page.locator('.back a[href="/jp/solutions/"]').innerText()).includes("ソリューション一覧へ戻る"));
  check("no case study blocks without published cases", (await page.locator("[data-related-cases]").count()) === 0);

  const sm = readFileSync(path.join(DIST, "sitemap.xml"), "utf8");
  check("sitemap lists the Japanese solutions and products", pages.every(([k, s]) => sm.includes(`/jp/${k}/${s}/`)) && sm.includes("/jp/solutions/"));
  for (const [w, label] of [[390, "phone"], [820, "tablet"]]) {
    const v = await browser.newPage({ viewport: { width: w, height: 900 } });
    for (const p of ["/jp/solutions/", "/jp/solutions/military/", "/jp/solutions/police/", "/jp/solutions/smart-city/", "/jp/products/sut/", "/jp/products/usv/", "/jp/products/fire-extinguisher-simulator/"]) {
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
