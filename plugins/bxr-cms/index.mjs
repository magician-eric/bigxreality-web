// Big x Reality EmDash plugin (docs/PHASE-2-PLAN.md §14.3 C2, C3).
//
// 1. Rebuild: public pages are prerendered, so publishing, unpublishing or deleting
//    content must rebuild the site. Each change (re)schedules one task a few minutes
//    ahead, so a burst of edits causes one Workers Builds run instead of many; a
//    change made after a long burst still triggers within `maxDelayMinutes`.
// 2. Review: Contributors and Authors cannot publish an entry until an Editor marks it
//    "approved"; when they edit an approved entry it goes back to "submitted".
//    Case studies additionally need the client-authorisation box ticked, for everyone.
import { definePlugin } from "emdash";

export const REVIEWED = ["products", "solutions", "news", "insights", "case_studies"];
const EDITOR = 40;
const TASK = "rebuild";

export function bxrCmsPlugin(options = {}) {
  return { id: "bxr-cms", version: "1.0.0", format: "native", entrypoint: "bxr-cms", options };
}

/** Pure decision used by the publish hook (exported for tests). */
export function publishDecision(collection, content, actor) {
  if (collection === "case_studies" && !truthy(content.approved)) {
    return { cancel: true, reason: "案例尚未勾選「已取得客戶公開授權」，不能發布。" };
  }
  if (REVIEWED.includes(collection) && actor && actor.role < EDITOR && content.review_status !== "approved") {
    return { cancel: true, reason: "這篇內容尚未經編輯核准（審核狀態需為 approved），請改為「submitted」送審。" };
  }
}

/** Pure save rule used by the save hook (exported for tests). */
export function saveRule(collection, content, actor) {
  if (!REVIEWED.includes(collection) || !actor || actor.role >= EDITOR) return;
  if (content.review_status === "approved") return { ...content, review_status: "submitted" };
}

/** Next run time for the rebuild task: `delay` after now, but no later than `max` after the first pending change. */
export function nextRun(now, firstPending, delayMinutes, maxDelayMinutes) {
  const wanted = now + delayMinutes * 60_000;
  const cap = (firstPending ?? now) + maxDelayMinutes * 60_000;
  return new Date(Math.min(wanted, cap)).toISOString();
}

function truthy(v) {
  return v === true || v === 1 || v === "1" || v === "true";
}

export function createPlugin(options = {}) {
  const fallbackUrl = options.url;
  const settingsUrl = async (ctx) => (await ctx.settings.get("deployHookUrl")) || fallbackUrl;

  const queue = (reason) => async (event, ctx) => {
    const now = Date.now();
    const first = (await ctx.kv.get("firstPending")) ?? now;
    await ctx.kv.set("firstPending", first);
    const delay = (await ctx.settings.get("delayMinutes")) ?? 2;
    const max = (await ctx.settings.get("maxDelayMinutes")) ?? 10;
    const at = nextRun(now, first, delay, max);
    await ctx.cron.schedule(TASK, { schedule: at, data: { reason, collection: event.collection } });
    ctx.log.info(`rebuild queued for ${at} after ${reason} ${event.collection}`);
  };

  return definePlugin({
    id: "bxr-cms",
    version: "1.0.0",
    capabilities: ["content:read", "network:request", "hooks.content-policy:register"],
    allowedHosts: ["api.cloudflare.com"],
    admin: {
      settingsSchema: {
        deployHookUrl: {
          type: "secret",
          label: "Workers Builds Deploy Hook URL",
          description: "Cloudflare → Workers → bxr-web → Settings → Builds → Deploy Hooks 產生的網址。空白時不會自動重建網站。",
        },
        delayMinutes: { type: "number", label: "發布後幾分鐘重建", default: 2, min: 1, max: 30 },
        maxDelayMinutes: { type: "number", label: "連續編輯時最多延後幾分鐘", default: 10, min: 2, max: 60 },
      },
    },
    hooks: {
      "content:afterPublish": queue("publish"),
      "content:afterUnpublish": queue("unpublish"),
      "content:afterDelete": queue("delete"),
      "content:beforePublish": async (event) => publishDecision(event.collection, event.content, event.actor),
      "content:beforeSave": async (event) => saveRule(event.collection, event.content, event.actor),
      cron: async (event, ctx) => {
        if (event.name !== TASK) return;
        await ctx.kv.delete("firstPending");
        const url = await settingsUrl(ctx);
        if (!url) return ctx.log.warn("deploy hook URL not configured; site not rebuilt");
        const payload = { reason: event.data?.reason, collection: event.data?.collection };
        // "log:" = local verification only (EmDash blocks plugin requests to private addresses).
        if (url.startsWith("log:")) return ctx.log.info(`DEPLOY_HOOK_CALL ${JSON.stringify(payload)}`);
        const res = await ctx.http.fetch(url, { method: "POST" });
        ctx.log.info(`deploy hook responded ${res.status}`);
        if (!res.ok) throw new Error(`deploy hook failed: ${res.status}`);
      },
    },
  });
}
export default createPlugin;
