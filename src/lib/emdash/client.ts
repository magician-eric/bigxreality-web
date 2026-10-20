/**
 * Build-time client for the EmDash REST API (read-only).
 *
 * EMDASH_URL         CMS origin, e.g. https://www.bigxreality.com
 * EMDASH_TOKEN       API token with the content:read and media:read scopes
 * CF_ACCESS_CLIENT_ID / CF_ACCESS_CLIENT_SECRET
 *                    Cloudflare Access service token, needed when /_emdash is behind Access
 */
export type Json = Record<string, any>;

/** URL segment → EmDash locale. tw is the translation source (docs/PLAN.md §2.1). */
export const CMS_LOCALES = { tw: "zh-TW", en: "en", jp: "ja" } as const;
export type UrlLang = keyof typeof CMS_LOCALES;
export const SOURCE_LOCALE = CMS_LOCALES.tw;

export const cmsBase = () => (process.env.EMDASH_URL ?? "http://127.0.0.1:4400").replace(/\/$/, "");

export function cmsHeaders(): Record<string, string> {
  const token = process.env.EMDASH_TOKEN;
  if (!token) throw new Error("EMDASH_TOKEN is not set (API token with content:read and media:read scopes)");
  const h: Record<string, string> = { authorization: `Bearer ${token}` };
  if (process.env.CF_ACCESS_CLIENT_ID) {
    h["cf-access-client-id"] = process.env.CF_ACCESS_CLIENT_ID;
    h["cf-access-client-secret"] = process.env.CF_ACCESS_CLIENT_SECRET ?? "";
  }
  return h;
}

async function request(path: string, attempt = 1): Promise<Response> {
  try {
    const r = await fetch(`${cmsBase()}${path}`, { headers: cmsHeaders() });
    if (r.status >= 500 && attempt < 3) throw new Error(`HTTP ${r.status}`);
    return r;
  } catch (e) {
    if (attempt >= 3) throw e;
    await new Promise((res) => setTimeout(res, 500 * attempt));
    return request(path, attempt + 1);
  }
}

export async function cmsGet(path: string): Promise<Json> {
  const r = await request(`/_emdash/api${path}`);
  const text = await r.text();
  let j: Json;
  try {
    j = JSON.parse(text);
  } catch {
    throw new Error(`EmDash ${path}: ${r.status} (not JSON — is Cloudflare Access blocking the build? ${text.slice(0, 120)})`);
  }
  if (!r.ok || j.success === false) throw new Error(`EmDash ${path}: ${r.status} ${JSON.stringify(j.error ?? j)}`);
  return j.data;
}

export async function cmsFile(path: string): Promise<Buffer> {
  const r = await request(path);
  if (!r.ok) throw new Error(`EmDash media ${path}: ${r.status}`);
  return Buffer.from(await r.arrayBuffer());
}

const published = new Map<string, Promise<Json[]>>();
/** Every published entry of a collection in one locale (memoised for the build). */
export function listPublished(collection: string, locale: string): Promise<Json[]> {
  const key = `${collection}:${locale}`;
  if (!published.has(key)) {
    published.set(key, (async () => {
      const items: Json[] = [];
      let cursor: string | undefined;
      do {
        const q = new URLSearchParams({ status: "published", locale, limit: "100", ...(cursor ? { cursor } : {}) });
        const page = await cmsGet(`/content/${collection}?${q}`);
        items.push(...page.items);
        cursor = page.nextCursor ?? undefined;
      } while (cursor);
      return items;
    })());
  }
  return published.get(key)!;
}

/**
 * Translation group → URL slug, taken from the published tw entry. All languages
 * share the tw slug so hreflang pairs and relations line up even if an editor
 * gives a translation a different slug.
 */
export async function groupSlugs(collection: string): Promise<Map<string, string>> {
  return new Map((await listPublished(collection, SOURCE_LOCALE)).map((i) => [i.translationGroup as string, i.slug as string]));
}
