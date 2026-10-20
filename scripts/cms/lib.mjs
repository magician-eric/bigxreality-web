// Shared EmDash REST helpers for the CMS scripts (import, settings pull, checks).
//
// Auth: EMDASH_TOKEN (API token; Bearer) — or, against a local `astro dev` only,
// the dev-bypass session (no token needed). CF_ACCESS_CLIENT_ID/SECRET are sent when
// set, for a CMS behind Cloudflare Access.
export const BASE = (process.env.EMDASH_URL ?? "http://127.0.0.1:4400").replace(/\/$/, "");
export const LOCALES = { tw: "zh-TW", en: "en", jp: "ja" };
export const LANG_ORDER = ["tw", "en", "jp"]; // tw first: it is the translation source

let cookie = "";
function headers(extra = {}) {
  const h = { "X-EmDash-Request": "1", ...extra };
  if (process.env.EMDASH_TOKEN) h.authorization = `Bearer ${process.env.EMDASH_TOKEN}`;
  else if (cookie) h.cookie = cookie;
  if (process.env.CF_ACCESS_CLIENT_ID) {
    h["cf-access-client-id"] = process.env.CF_ACCESS_CLIENT_ID;
    h["cf-access-client-secret"] = process.env.CF_ACCESS_CLIENT_SECRET ?? "";
  }
  return h;
}

export async function connect() {
  if (process.env.EMDASH_TOKEN) return;
  const local = /^http:\/\/(127\.0\.0\.1|localhost)(:\d+)?$/.test(BASE);
  if (!local) throw new Error("EMDASH_TOKEN is required for a remote CMS");
  const r = await fetch(`${BASE}/_emdash/api/auth/dev-bypass`, { method: "POST", headers: { "content-type": "application/json" }, body: "{}" });
  if (!r.ok) throw new Error(`dev-bypass login failed: ${r.status} (is \`astro dev\` running at ${BASE}?)`);
  cookie = (r.headers.getSetCookie?.() ?? []).map((c) => c.split(";")[0]).join("; ");
}

export async function api(method, path, body) {
  const init = { method, headers: headers() };
  if (body instanceof FormData) init.body = body;
  else if (body !== undefined) {
    init.headers["content-type"] = "application/json";
    init.body = JSON.stringify(body);
  }
  const r = await fetch(`${BASE}/_emdash/api${path}`, init);
  const text = await r.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error(`${method} ${path} → ${r.status}: ${text.slice(0, 200)}`);
  }
  if (!r.ok || json.success === false) throw new Error(`${method} ${path} → ${r.status} ${JSON.stringify(json.error ?? json).slice(0, 400)}`);
  return json.data;
}

/** All entries (any status) of a collection in one locale. */
export async function listAll(collection, locale, status) {
  const items = [];
  let cursor;
  do {
    const q = new URLSearchParams({ locale, limit: "100", ...(status ? { status } : {}), ...(cursor ? { cursor } : {}) });
    const page = await api("GET", `/content/${collection}?${q}`);
    items.push(...page.items);
    cursor = page.nextCursor ?? undefined;
  } while (cursor);
  return items;
}
