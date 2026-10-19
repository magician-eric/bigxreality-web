// Item 8: built-in data management features that would otherwise need custom work.
import { login, api, check, summary, L } from "./lib.mjs";
await login();
// 8.5 per-entry SEO fields (collection supports "seo")
const list = await api("GET", `/content/products?status=published&locale=${L.tw}`);
const sut = list.items.find((i) => i.slug === "sut");
const cur = await api("GET", `/content/products/${sut.id}`);
const seo = await api("PUT", `/content/products/${sut.id}`, { _rev: cur._rev, seo: { title: "SUT 小型部隊專項訓練系統", description: "主要針對約 1 至 4 人的小部隊戰術訓練。" } }, { raw: true });
const after = await api("GET", `/content/products/${sut.id}`);
check("8.5", "每篇內容內建 SEO 欄位（title／description／OG 圖等）", seo.status === 200 && !!after.item.seo, JSON.stringify(after.item.seo).slice(0, 160));
await api("POST", `/content/products/${sut.id}/discard-draft`, {}, { raw: true });
// 8.6 whole-site export (backup / migration)
const cap = await api("GET", "/admin/transfer/capabilities", undefined, { raw: true });
const exp = await api("POST", "/admin/transfer/exports", {}, { raw: true });
check("8.6", "整站匯出（內容＋媒體清單，可用於備份與搬家）", cap.status === 200 && exp.status < 300, `capabilities ${cap.status}, export ${exp.status} ${JSON.stringify(exp.json.data ?? exp.json.error).slice(0, 120)}`);
// 8.7 audit / activity log
const routes = ["/admin/audit", "/admin/audit-log", "/dashboard"];
const found = [];
for (const r of routes) { const x = await api("GET", r, undefined, { raw: true }); found.push(`${r} ${x.status}`); }
check("8.7", "操作紀錄（儀表板最近活動）", found.some((f) => f.endsWith("200")), found.join(", "));
summary();
