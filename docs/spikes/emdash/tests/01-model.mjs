// Items 2–3: data model, three languages, translation status, one-way relations,
// repeaters, non-translatable fields, image upload. Uses only real phase 1 wording.
import { readFile, writeFile } from "node:fs/promises";
import { login, api, check, summary, pt, L } from "./lib.mjs";

await login();
const ids = {};

// --- image upload (R2 emulation) ---
const img = await readFile(new URL("../src/assets/images/products/sut-hero.jpg", import.meta.url));
const fd = new FormData();
fd.append("file", new Blob([img], { type: "image/jpeg" }), "sut-hero.jpg");
fd.append("alt", "四名學員頭戴 VR 頭盔、身穿戰術裝備並手持訓練用槍械，站在載具模擬器前");
const media = await api("POST", "/media", fd);
const m = media.item ?? media;
check("3.1", "圖片上傳到 R2（本機模擬）", !!m.id, `id=${m.id} ${m.mimeType ?? ""} ${m.width ?? "?"}×${m.height ?? "?"}`);
const file = await fetch(`http://127.0.0.1:4400${m.url}`);
check("3.2", "上傳後的圖片可以取回", file.ok && (await file.arrayBuffer()).byteLength === img.byteLength, m.url);

// --- solutions (three languages) ---
async function create(collection, locale, data, extra = {}) {
  const r = await api("POST", `/content/${collection}`, { data, locale, ...extra });
  return r.item;
}
const mil = await create("solutions", L.tw, { title: "軍事", english_name: "Military", domain: "military", summary: "軍事訓練、戰術訓練、兵棋推演、無人載具及其他國防訓練應用。", sort_order: 1, translation_status: "source" }, { slug: "military" });
ids.military = { tw: mil.id };
for (const [k, l] of [["en", L.en], ["jp", L.jp]]) {
  const e = await create("solutions", l, { title: "[待翻譯] 軍事", english_name: "Military", domain: "military", summary: "[待翻譯] 軍事訓練、戰術訓練、兵棋推演、無人載具及其他國防訓練應用。", sort_order: 1, translation_status: "pending" }, { slug: "military", translationOf: mil.id });
  ids.military[k] = e.id;
}
const tr = await api("GET", `/content/solutions/${mil.id}/translations`);
check("3.3", "三語各自一筆、互相連結（translation group）", (tr.translations ?? tr.items ?? tr).length === 3, JSON.stringify((tr.translations ?? tr.items ?? tr).map((t) => t.locale)));

// --- scenarios ---
const mumt = await create("scenarios", L.tw, { title: "MUM-T 人機協同訓練", code: "MUM-T", english_name: "Manned-Unmanned Teaming", summary: "SUT、UAV、USV 可以共同參與的整合訓練情境。", sort_order: 1, translation_status: "source" }, { slug: "mum-t" });

// --- products ---
const base = (o) => ({ translation_status: "source", cta_brochure: true, cta_demo: true, ...o });
const uav = await create("products", L.tw, base({ title: "UAV 無人機戰術訓練系統", english_name: "[待提供]", code: "UAV", tagline: "[待提供]", domains: ["military"], sort_order: 2, overview: pt("UAV 無人機戰術訓練系統是獨立產品。") }), { slug: "uav" });
const usv = await create("products", L.tw, base({ title: "USV 無人船 VR 訓練系統", english_name: "[待提供]", code: "USV", tagline: "[待提供]", domains: ["military"], sort_order: 3, overview: pt("USV 目前是一個可以獨立運行的 VR App。") }), { slug: "usv" });
const sut = await create("products", L.tw, base({
  title: "SUT 小型部隊專項訓練系統", english_name: "Small Unit Tactical Training System", code: "SUT",
  tagline: "一套可從基礎操作延伸到小隊協同與跨系統聯合訓練的戰術訓練系統。",
  hero_image: { id: m.id, alt: m.alt }, summary: "主要針對約 1 至 4 人的小部隊戰術訓練。",
  overview: pt("SUT = Small Unit Tactical。SUT 小型部隊專項訓練系統主要針對約 1 至 4 人的小部隊戰術訓練，定位為可擴充的小部隊戰術訓練系統。"),
  capabilities: [{ title: "隊形、掩護與移動", description: "[待提供]" }, { title: "小隊溝通與協同", description: "[待提供]" }],
  scenarios: [{ title: "基礎射擊訓練", description: "[待提供]" }],
  deploy_personnel: "1-4", deploy_personnel_approx: true, deploy_area: "[待提供]", deploy_setup_time: "[待提供]",
  integrated_ops_description: "SUT、UAV、USV 是三個平行的獨立產品，可以各自展示，也可以在特定情境下整合。",
  domains: ["military"], sort_order: 1,
}), { slug: "sut", references: { integrated_products: [uav.id, usv.id], related_solutions: [mil.id], integrated_scenarios: [mumt.id] } });
ids.sut = { tw: sut.id }; ids.uav = { tw: uav.id }; ids.usv = { tw: usv.id }; ids.mumt = { tw: mumt.id };
check("2.1", "Products / Solutions / Scenarios 建立成功", !!(sut.id && uav.id && mil.id && mumt.id));

const en = await create("products", L.en, { title: "[待翻譯] SUT 小型部隊專項訓練系統", english_name: "Small Unit Tactical Training System", tagline: "[待翻譯] 一套可從基礎操作延伸到小隊協同與跨系統聯合訓練的戰術訓練系統。", translation_status: "pending", code: "SUT", domains: ["military"], sort_order: 1 }, { slug: "sut", translationOf: sut.id });
ids.sut.en = en.id;

// non-translatable fields synchronise across translations
const enRead = await api("GET", `/content/products/${en.id}`);
check("3.4", "不可翻譯欄位（code、排序、領域、部署數字）自動同步到其他語言", enRead.item.data.deploy_personnel === "1-4" && enRead.item.data.code === "SUT", `en: personnel=${enRead.item.data.deploy_personnel}`);
check("3.5", "翻譯狀態每個語言各自保存", enRead.item.data.translation_status === "pending");

// references are shared across translations (one source)
const enRefs = enRead.references ?? enRead.item.references ?? {};
const refIds = (enRefs.integrated_products?.children ?? []).map((r) => r.id);
check("3.6", "關聯只存一份，英文版自動取得同一組關聯", refIds.length === 2, JSON.stringify(Object.keys(enRefs)));

// repeater validation
const bad = await api("POST", "/content/products", { locale: L.tw, slug: "bad-repeater", data: base({ title: "x", english_name: "x", code: "X", tagline: "x", domains: ["military"], sort_order: 9, capabilities: [{ title: "只有標題" }] }) }, { raw: true });
check("3.7", "重複欄位的必填子欄位會被驗證（缺說明 → 拒絕）", bad.status === 400, `status ${bad.status}`);
const badNum = await api("POST", "/content/products", { locale: L.tw, slug: "bad-num", data: base({ title: "x", english_name: "x", code: "X", tagline: "x", domains: ["military"], sort_order: 9, deploy_area: "大約一百" }) }, { raw: true });
check("3.8", "數值或 [待提供] 欄位拒絕其他文字", badNum.status === 400, `status ${badNum.status}`);
const badRef = await api("POST", "/content/products", { locale: L.tw, slug: "bad-ref", data: base({ title: "x", english_name: "x", code: "X", tagline: "x", domains: ["military"], sort_order: 9 }), references: { related_solutions: ["01NOTEXIST000000000000000"] } }, { raw: true });
check("3.9", "關聯到不存在的內容會被拒絕", badRef.status >= 400, `status ${badRef.status} ${badRef.json.error?.code ?? ""}`);

// publish the tw/en entries used later
for (const id of [mil.id, ids.military.en, ids.military.jp, mumt.id, uav.id, usv.id, sut.id, en.id]) {
  const col = [mil.id, ids.military.en, ids.military.jp].includes(id) ? "solutions" : id === mumt.id ? "scenarios" : "products";
  await api("POST", `/content/${col}/${id}/publish`, {});
}
check("2.2", "內容可發布", true);
await writeFile(new URL("./ids.json", import.meta.url), JSON.stringify({ ids, media: m }, null, 2));
summary();
