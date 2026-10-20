// Spike helpers: EmDash REST client using the dev-only session (dev-bypass).
export const BASE = process.env.EMDASH_URL ?? "http://127.0.0.1:4400";
let cookie = "";
export async function login() {
  const r = await fetch(`${BASE}/_emdash/api/auth/dev-bypass`, { method: "POST", headers: { "content-type": "application/json" }, body: "{}" });
  cookie = (r.headers.getSetCookie?.() ?? []).map((c) => c.split(";")[0]).join("; ");
  if (!r.ok) throw new Error(`login ${r.status}`);
  return (await r.json()).data.user;
}
export async function api(method, path, body, { raw = false } = {}) {
  const headers = { cookie, "X-EmDash-Request": "1" };
  let payload;
  if (body instanceof FormData) payload = body;
  else if (body !== undefined) { headers["content-type"] = "application/json"; payload = JSON.stringify(body); }
  const r = await fetch(`${BASE}/_emdash/api${path}`, { method, headers, body: payload });
  const text = await r.text();
  let json; try { json = JSON.parse(text); } catch { json = { raw: text.slice(0, 200) }; }
  if (raw) return { status: r.status, json };
  if (!r.ok || json.success === false) throw new Error(`${method} ${path} → ${r.status} ${JSON.stringify(json.error ?? json).slice(0, 300)}`);
  return json.data;
}
const results = [];
export function check(id, name, ok, detail = "") {
  results.push({ id, name, ok, detail });
  console.log(`${ok ? "PASS" : "FAIL"}  ${id}  ${name}${detail ? `  — ${detail}` : ""}`);
}
export function summary() {
  const failed = results.filter((r) => !r.ok).length;
  console.log(`\n${results.length - failed}/${results.length} passed`);
  return results;
}
export const pt = (text) => [{ _type: "block", _key: Math.random().toString(36).slice(2, 10), style: "normal", markDefs: [], children: [{ _type: "span", _key: "s1", text, marks: [] }] }];
/** EmDash content locales (BCP-47). The site maps them to its URL segments en / tw / jp. */
export const L = { en: "en", tw: "zh-TW", jp: "ja" };
