// Item 3: one-way relation, read from the other end without storing it twice.
import { readFile } from "node:fs/promises";
import { login, api, check, summary } from "./lib.mjs";
await login();
const { ids } = JSON.parse(await readFile(new URL("./ids.json", import.meta.url), "utf8"));
// child-side views of existing relations (schema change on a live model)
// (now in seed) await api("POST", "/schema/collections/products/fields", { slug: "integrated_by", label: "被下列產品整合（反向）", type: "reference", validation: { relation: "product_integrations", relationSide: "child" } }, { raw: true });
// (now in seed) await api("POST", "/schema/collections/solutions/fields", { slug: "related_products", label: "相關產品（反向）", type: "reference", validation: { relation: "product_solutions" } }, { raw: true });
// (now in seed) await api("POST", "/schema/collections/scenarios/fields", { slug: "products", label: "參與產品（反向）", type: "reference", validation: { relation: "product_scenarios" } }, { raw: true });
const uav = await api("GET", `/content/products/${ids.uav.tw}`);
const by = (uav.item.references?.integrated_by?.children ?? []).map((e) => e.slug);
check("3.10", "反向關聯：UAV 讀得到 SUT（關聯只存在 SUT 上）", by.includes("sut"), JSON.stringify(by));
const mil = await api("GET", `/content/solutions/${ids.military.tw}`);
const prods = (mil.item.references?.related_products?.children ?? []).map((e) => e.slug);
check("3.11", "反向關聯：解決方案頁讀得到相關產品", prods.includes("sut"), JSON.stringify(prods));
const sc = await api("GET", `/content/scenarios/${ids.mumt.tw}`);
const scp = (sc.item.references?.products?.children ?? []).map((e) => e.slug);
check("3.12", "MUM-T 的參與產品與產品頁的情境是同一份關聯（第一階段兩邊各存一次的問題消失）", scp.includes("sut"), JSON.stringify(scp));
summary();
