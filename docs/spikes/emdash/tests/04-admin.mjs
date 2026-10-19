// Items 2 & 8: remaining collections, and the admin UI in a real browser
// (dev-bypass session). Screenshots go to ../shots/.
import { readFile, mkdir } from "node:fs/promises";
import { chromium } from "playwright-core";
import { login, api, check, summary, pt, BASE, L } from "./lib.mjs";
await login();
const { ids } = JSON.parse(await readFile(new URL("./ids.json", import.meta.url), "utf8"));
const ins = await api("POST", "/content/insights", { locale: L.tw, slug: "fixture-insight", data: { title: "TEST FIXTURE 技術文章", summary: "x", body: pt("TEST FIXTURE"), author: "TEST", translation_status: "source" }, references: { related_products: [ids.sut.tw] } }, { raw: true });
const cs = await api("POST", "/content/case_studies", { locale: L.tw, slug: "fixture-case", data: { title: "TEST FIXTURE 案例", summary: "x", body: pt("TEST FIXTURE"), client_name: "TEST FIXTURE", client_disclosure: "anonymized", approved: false, outcomes: [{ label: "TEST", value: "[待提供]" }], domains: ["military"], translation_status: "source" }, references: { related_products: [ids.sut.tw], related_solutions: [ids.military.tw] } }, { raw: true });
check("2.5", "Insights 建立", ins.status === 201, `status ${ins.status}`);
check("2.6", "Case Studies 建立（含客戶授權、成果重複欄位）", cs.status === 201, `status ${cs.status}`);

const out = new URL("../shots/", import.meta.url).pathname; await mkdir(out, { recursive: true });
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const failed = [];
page.on("response", (r) => { if (r.url().includes("/_emdash/api/") && r.status() >= 400 && r.status() !== 401) failed.push(`${r.status()} ${new URL(r.url()).pathname}`); });
const errors = []; page.on("pageerror", (e) => errors.push(e.message));
await page.goto(`${BASE}/_emdash/api/auth/dev-bypass?redirect=/_emdash/admin`, { waitUntil: "networkidle" });
await page.waitForTimeout(3000);
await page.screenshot({ path: out + "admin-dashboard.png" });
const body = await page.textContent("body");
check("8.1", "後台首頁載入並列出自訂 collections", ["產品 Products", "消息 News", "案例 Case Studies"].every((t) => body.includes(t)), body.slice(0, 120).replace(/\s+/g, " "));
await page.goto(`${BASE}/_emdash/admin/content/products/${ids.sut.tw}`, { waitUntil: "networkidle" });
await page.waitForTimeout(3000);
await page.screenshot({ path: out + "admin-product-edit.png", fullPage: true });
const edit = await page.textContent("body");
check("8.2", "產品編輯頁顯示中文欄位、重複欄位與關聯", ["核心能力", "可整合的產品", "主圖"].every((t) => edit.includes(t)), "");
check("8.3", "後台呼叫的 API 沒有 404／500", failed.length === 0, failed.slice(0, 5).join(", "));
check("8.4", "後台沒有前端錯誤", errors.length === 0, errors.slice(0, 2).join(" | ").slice(0, 200));
await browser.close();
summary();
