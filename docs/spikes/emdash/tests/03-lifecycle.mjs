// Item 4: draft, publish, edit after publish, compare, revisions, schedule,
// unpublish, trash/restore, tags, and role permissions (server-side checks).
// Article text is TEST FIXTURE only (spike database, never published anywhere).
import { readFile } from "node:fs/promises";
import { DatabaseSync } from "node:sqlite";
import { readdirSync } from "node:fs";
import { login, api, check, summary, pt, L } from "./lib.mjs";

const me = await login();
const { ids } = JSON.parse(await readFile(new URL("./ids.json", import.meta.url), "utf8"));
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

// tags (built-in taxonomy, per-locale terms)
const t = await api("POST", "/taxonomies/tag/terms", { slug: "xr-training", label: "XR 訓練", locale: L.tw }, { raw: true });
check("2.3", "標籤（內建分類法）可建立", t.status < 300, `status ${t.status} ${t.json.error?.message ?? ""}`);

// draft
const news = (await api("POST", "/content/news", { locale: L.tw, slug: "fixture-news-1", data: { title: "TEST FIXTURE 消息一", summary: "TEST FIXTURE 摘要", body: pt("TEST FIXTURE 正文第一版"), category: "company", translation_status: "source" }, references: { related_products: [ids.sut.tw] }, taxonomies: { tag: ["xr-training"] } })).item;
check("4.1", "新增後預設為草稿", news.status === "draft", news.status);
const pubList = await api("GET", `/content/news?status=published&locale=${L.tw}`);
check("4.2", "草稿不會出現在已發布清單", !(pubList.items ?? []).some((i) => i.id === news.id));
const terms = await api("GET", `/content/news/${news.id}/terms/tag`);
check("2.4", "文章可套用標籤", JSON.stringify(terms).includes("xr-training"));

// publish
await api("POST", `/content/news/${news.id}/publish`, {});
let cur = await api("GET", `/content/news/${news.id}`);
check("4.3", "發布", cur.item.status === "published" && !!cur.item.publishedAt, cur.item.publishedAt);

// edit after publish → draft revision; live stays
await api("PUT", `/content/news/${news.id}`, { data: { title: "TEST FIXTURE 消息一（修改）" }, _rev: cur._rev });
cur = await api("GET", `/content/news/${news.id}`);
const cmp = await api("GET", `/content/news/${news.id}/compare`);
const liveTitle = cmp.live?.title ?? cmp.live?.data?.title; const draftTitle = cmp.draft?.title ?? cmp.draft?.data?.title;
check("4.4", "發布後修改：線上版不變，修改存成草稿，可比較差異", cur.item.status === "published" && !!cur.item.draftRevisionId && liveTitle !== draftTitle, `live="${liveTitle}" draft="${draftTitle}"`);

// revisions + restore
await api("POST", `/content/news/${news.id}/publish`, {});
const revs = await api("GET", `/content/news/${news.id}/revisions`);
const list = revs.items ?? revs.revisions ?? revs;
check("4.5", "版本紀錄", Array.isArray(list) && list.length >= 2, `${list.length} revisions`);
const first = list[list.length - 1];
const rr = await api("POST", `/revisions/${first.id}/restore`, {}, { raw: true });
cur = await api("GET", `/content/news/${news.id}`);
const cmp2 = await api("GET", `/content/news/${news.id}/compare`);
check("4.6", "版本還原（還原成草稿，需再發布才上線）", rr.status < 300 && (cmp2.draft?.title ?? cmp2.draft?.data?.title) === "TEST FIXTURE 消息一", `status ${rr.status}; draft="${cmp2.draft?.title ?? cmp2.draft?.data?.title}" live="${cmp2.live?.title ?? cmp2.live?.data?.title}"`);

// schedule (dev server publishes on a timer; production needs the Cron Trigger)
const sch = (await api("POST", "/content/news", { locale: L.tw, slug: "fixture-news-2", data: { title: "TEST FIXTURE 排程", summary: "TEST FIXTURE", body: pt("TEST FIXTURE"), category: "company", translation_status: "source" } })).item;
const when = new Date(Date.now() + 65_000).toISOString();
await api("POST", `/content/news/${sch.id}/schedule`, { scheduledAt: when });
let s1 = await api("GET", `/content/news/${sch.id}`);
check("4.7", "排程：狀態變成 scheduled", s1.item.status === "scheduled", `${s1.item.status} at ${s1.item.scheduledAt}`);
let published = false;
for (let i = 0; i < 24 && !published; i++) { await wait(5000); s1 = await api("GET", `/content/news/${sch.id}`); published = s1.item.status === "published"; }
check("4.8", "排程時間到自動發布（本機開發模式的計時器；正式環境靠 Cron Trigger，本機無法驗證）", published, `${s1.item.status} publishedAt=${s1.item.publishedAt}`);

// unpublish, trash, restore
await api("POST", `/content/news/${sch.id}/unpublish`, {});
s1 = await api("GET", `/content/news/${sch.id}`);
check("4.9", "下架", s1.item.status === "draft");
await api("DELETE", `/content/news/${sch.id}`);
const trash = await api("GET", "/content/news/trash");
check("4.10", "刪除先進垃圾桶", (trash.items ?? []).some((i) => i.id === sch.id));
await api("POST", `/content/news/${sch.id}/restore`, {});
s1 = await api("GET", `/content/news/${sch.id}`);
check("4.11", "從垃圾桶還原（還原為草稿）", s1.item.status === "draft");

// roles: change the dev user's role in the LOCAL emulated D1 and retry actions.
const dir = new URL("../.wrangler/state/v3/d1/miniflare-D1DatabaseObject/", import.meta.url);
const file = readdirSync(dir).find((f) => f.endsWith(".sqlite") && f !== "metadata.sqlite");
const db = new DatabaseSync(new URL(file, dir).pathname);
const setRole = (r) => db.prepare("UPDATE users SET role = ? WHERE id = ?").run(r, me.id);
const draft = (await api("POST", "/content/news", { locale: L.tw, slug: "fixture-news-3", data: { title: "TEST FIXTURE 權限", summary: "x", body: pt("x"), category: "company", translation_status: "source" } })).item;
// make the draft belong to another (test) user so ownership rules apply
const otherId = "01SPIKEOTHERUSER0000000000";
db.prepare("INSERT OR IGNORE INTO users (id, email, name, role, email_verified, created_at, updated_at) VALUES (?, 'other@spike.local', 'Other Editor', 40, 1, datetime('now'), datetime('now'))").run(otherId);
db.prepare("UPDATE ec_news SET author_id = ? WHERE id = ?").run(otherId, draft.id);
try {
  setRole(20); // Contributor
  const c1 = await api("POST", `/content/news/${draft.id}/publish`, {}, { raw: true });
  const c2 = await api("PUT", `/content/news/${draft.id}`, { data: { summary: "contributor edit" } }, { raw: true });
  const c3 = await api("POST", `/content/news`, { locale: L.tw, slug: "fixture-news-4", data: { title: "TEST FIXTURE by contributor", summary: "x", body: pt("x"), category: "company", translation_status: "source" } }, { raw: true });
  check("4.12", "Contributor：可新增草稿、不能發布", c3.status < 300 && c1.status === 403, `create ${c3.status}, publish ${c1.status}`);
  check("4.13", "Contributor：不能修改別人的內容", c2.status === 403, `edit others ${c2.status}`);
  setRole(30); // Author
  const a1 = await api("POST", `/content/news/${draft.id}/publish`, {}, { raw: true });
  const own = c3.json.data?.item?.id;
  const a2 = own ? await api("POST", `/content/news/${own}/publish`, {}, { raw: true }) : { status: "n/a" };
  check("4.14", "Author：能發布自己的、不能發布別人的", a1.status === 403 && a2.status < 300, `others ${a1.status}, own ${a2.status}`);
  setRole(40); // Editor
  const e1 = await api("POST", `/content/news/${draft.id}/publish`, {}, { raw: true });
  const e2 = await api("POST", "/schema/collections/news/fields", { slug: "x_test", label: "x", type: "string" }, { raw: true });
  check("4.15", "Editor：能發布任何內容、不能改資料模型", e1.status < 300 && e2.status === 403, `publish ${e1.status}, schema ${e2.status}`);
  const e3 = await api("DELETE", `/content/news/${draft.id}/permanent`, undefined, { raw: true });
  check("4.16", "Editor：不能永久刪除（只有 Admin 可以）", e3.status === 403 || e3.status === 404, `status ${e3.status}`);
} finally {
  setRole(50);
  db.close();
}
summary();
