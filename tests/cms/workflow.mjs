#!/usr/bin/env node
// Integration check of plugins/bxr-cms against a LOCAL CMS (`npm run dev`, emulated D1):
// review rule for Authors, client authorisation for case studies, and the delayed
// rebuild after publishing. Changes the dev user's role directly in the local
// database, so it refuses to run against anything but 127.0.0.1.
import { readdirSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";
import path from "node:path";
import { connect, api, BASE } from "../../scripts/cms/lib.mjs";

if (!BASE.startsWith("http://127.0.0.1")) throw new Error("local CMS only");
const dir = path.resolve(import.meta.dirname, "../../.wrangler/state/v3/d1/miniflare-D1DatabaseObject");
const db = new DatabaseSync(path.join(dir, readdirSync(dir).find((f) => f.endsWith(".sqlite") && f !== "metadata.sqlite")));
let failed = 0;
const check = (name, ok, detail = "") => {
  if (!ok) failed++;
  console.log(`${ok ? "ok  " : "FAIL"} ${name}${detail ? ` — ${detail}` : ""}`);
};
const pt = (t) => [{ _type: "block", _key: "a", style: "normal", markDefs: [], children: [{ _type: "span", _key: "b", text: t, marks: [] }] }];
const tryApi = (...a) => api(...a).then((d) => ({ ok: true, d }), (e) => ({ ok: false, e: String(e.message) }));

await connect();
const me = (await api("GET", "/auth/me")).user ?? (await api("GET", "/auth/me"));
const setRole = (r) => db.prepare("UPDATE users SET role = ? WHERE id = ?").run(r, me.id);
const stamp = Date.now().toString(36);
try {
  setRole(30); // Author
  const a = (await api("POST", "/content/news", { locale: "zh-TW", slug: `wf-${stamp}`, data: { title: "TEST FIXTURE 審核", summary: "x", body: pt("x"), category: "company", translation_status: "source", review_status: "approved" } })).item;
  check("Author cannot self-approve (saved as submitted)", a.data.review_status === "submitted", a.data.review_status);
  const pub = await tryApi("POST", `/content/news/${a.id}/publish`, {});
  check("Author cannot publish unapproved news", !pub.ok, pub.e?.slice(0, 80));

  setRole(40); // Editor approves
  const cur = await api("GET", `/content/news/${a.id}`);
  await api("PUT", `/content/news/${a.id}`, { _rev: cur._rev, data: { ...cur.item.data, review_status: "approved" } });
  setRole(30); // …then the Author can publish
  const pub2 = await tryApi("POST", `/content/news/${a.id}/publish`, {});
  check("Author can publish once an Editor approved", pub2.ok, pub2.e);
  setRole(40);
  const b = (await api("POST", "/content/news", { locale: "zh-TW", slug: `wf-ed-${stamp}`, data: { title: "TEST FIXTURE 編輯", summary: "x", body: pt("x"), category: "company", translation_status: "source", review_status: "draft" } })).item;
  const pub2b = await tryApi("POST", `/content/news/${b.id}/publish`, {});
  check("Editor can publish directly", pub2b.ok, pub2b.e);

  const c = (await api("POST", "/content/case_studies", { locale: "zh-TW", slug: `wf-cs-${stamp}`, data: { title: "TEST FIXTURE 案例", summary: "x", body: pt("x"), translation_status: "source", review_status: "approved", client_name: "TEST", client_disclosure: "anonymized", approved: false } })).item;
  const pub3 = await tryApi("POST", `/content/case_studies/${c.id}/publish`, {});
  check("Case study without client authorisation cannot be published (even by an Editor)", !pub3.ok, pub3.e?.slice(0, 80));
  const cc = await api("GET", `/content/case_studies/${c.id}`);
  await api("PUT", `/content/case_studies/${c.id}`, { _rev: cc._rev, data: { ...cc.item.data, approved: true } });
  const pub4 = await tryApi("POST", `/content/case_studies/${c.id}/publish`, {});
  check("Case study with client authorisation can be published", pub4.ok, pub4.e);

  const tasks = db.prepare("SELECT task_name, next_run_at FROM _emdash_cron_tasks WHERE plugin_id = 'bxr-cms'").all();
  const at = tasks[0] && Date.parse(tasks[0].next_run_at);
  check("publishing queued exactly one rebuild task", tasks.length === 1 && tasks[0].task_name === "rebuild", JSON.stringify(tasks));
  check("rebuild delayed about 2 minutes", at > Date.now() + 60_000 && at < Date.now() + 3 * 60_000, tasks[0]?.next_run_at);
} finally {
  setRole(50);
}
console.log(failed ? `FAIL: ${failed}` : "PASS");
process.exit(failed ? 1 : 0);
