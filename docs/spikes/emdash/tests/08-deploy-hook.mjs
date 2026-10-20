// Item 7: publishing, scheduled publishing, unpublishing and deleting call the
// deploy hook (a local mock stands in for the Workers Builds Deploy Hook URL).
import { execSync } from "node:child_process";
import { login, api, check, summary, pt, L } from "./lib.mjs";

// reads the plugin's DEPLOY_HOOK_CALL lines from the dev server log
const start = Date.now();
const calls = () => execSync("npx astro dev logs", { cwd: new URL("..", import.meta.url).pathname, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] })
  .split("\n").filter((l) => l.includes("DEPLOY_HOOK_CALL")).map((l) => JSON.parse(JSON.parse(l).message.split("DEPLOY_HOOK_CALL ")[1]));
const before = calls().length;
const hits = new Proxy([], { get: (_t, k) => { const a = calls().slice(before); return typeof a[k] === "function" ? a[k].bind(a) : a[k]; } });
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const waitFor = async (pred, ms = 15000) => { for (let t = 0; t < ms; t += 500) { if (pred()) return true; await wait(500); } return false; };

await login();
const item = (await api("POST", "/content/news", { locale: L.tw, slug: `fixture-hook-${Date.now()}`, data: { title: "TEST FIXTURE hook", summary: "x", body: pt("x"), category: "company", translation_status: "source" } })).item;
await wait(1500);
check("7.1", "存草稿不觸發重建", hits.length === 0, `${hits.length} calls`);
await api("POST", `/content/news/${item.id}/publish`, {});
check("7.2", "發布 → 呼叫 Deploy Hook（POST）", await waitFor(() => hits.some((h) => h.reason === "content:afterPublish")), JSON.stringify(hits.at(-1)));
const n1 = hits.length;
await api("POST", `/content/news/${item.id}/unpublish`, {});
check("7.3", "下架 → 呼叫 Deploy Hook", await waitFor(() => hits.length > n1 && hits.at(-1).reason === "content:afterUnpublish"));
const sch = (await api("POST", "/content/news", { locale: L.tw, slug: `fixture-hook-s-${Date.now()}`, data: { title: "TEST FIXTURE hook schedule", summary: "x", body: pt("x"), category: "company", translation_status: "source" } })).item;
await api("POST", `/content/news/${sch.id}/schedule`, { scheduledAt: new Date(Date.now() + 61_000).toISOString() });
const n2 = hits.length;
check("7.4", "排程時間到 → 自動發布並呼叫 Deploy Hook（本機計時器）", await waitFor(() => hits.length > n2 && hits.at(-1).reason === "content:afterPublish", 120_000));
const n3 = hits.length;
await api("DELETE", `/content/news/${item.id}`);
check("7.5", "刪除 → 呼叫 Deploy Hook", await waitFor(() => hits.length > n3 && hits.at(-1).reason === "content:afterDelete"));
summary();
