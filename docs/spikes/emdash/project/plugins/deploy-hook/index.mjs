// SPIKE (K2): EmDash native plugin that asks Cloudflare Workers Builds to rebuild the
// static site whenever public content changes. Production URL format (official Deploy
// Hook): https://api.cloudflare.com/client/v4/workers/builds/deploy_hooks/<uuid>
// Cloudflare itself drops a second POST while a build is still initialising.
import { definePlugin } from "emdash";

const PUBLIC_EVENTS = ["content:afterPublish", "content:afterUnpublish", "content:afterDelete"];

export function deployHookPlugin(options = {}) {
  return { id: "bxr-deploy-hook", version: "0.1.0", format: "native", entrypoint: "bxr-deploy-hook", options };
}

export function createPlugin(options = {}) {
  const url = options.url;
  const trigger = async (name, event, ctx) => {
    if (!url) return ctx.log.warn("deploy hook URL not configured");
    const payload = { reason: name, collection: event.collection, id: event.content?.id ?? event.id };
    // "log:" = local verification only. EmDash blocks plugin requests to private
    // addresses (SSRF protection), so a local mock server cannot receive the POST.
    if (url.startsWith("log:")) return ctx.log.info(`DEPLOY_HOOK_CALL ${JSON.stringify(payload)}`);
    const res = await ctx.http.fetch(url, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
    ctx.log.info(`deploy hook ${res.status} after ${name} ${event.collection}`);
  };
  return definePlugin({
    id: "bxr-deploy-hook",
    version: "0.1.0",
    capabilities: ["content:read", "network:request"],
    allowedHosts: url && !url.startsWith("log:") ? [new URL(url).hostname] : ["api.cloudflare.com"],
    hooks: Object.fromEntries(PUBLIC_EVENTS.map((name) => [name, async (event, ctx) => trigger(name, event, ctx)])),
  });
}
export default createPlugin;
