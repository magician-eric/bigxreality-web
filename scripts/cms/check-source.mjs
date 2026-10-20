#!/usr/bin/env node
// Runs before every build (prebuild). Validates BXR_CONTENT_SOURCE and, for the one-time
// bootstrap deployment, asks the deployed CMS whether it has been set up yet:
//   - Worker not deployed yet / no JSON answer (404, unreachable) → first deployment, allowed
//   - CMS answers needsSetup: true                                 → allowed
//   - CMS answers needsSetup: false (an admin exists)               → refused
//   - 401/403 (Cloudflare Access in front of the CMS)               → refused (CMS exists)
import { resolveContentSource, bootstrapDecision } from "../../src/lib/content-source.ts";

const ci = !!process.env.WORKERS_CI;
const source = resolveContentSource(process.env.BXR_CONTENT_SOURCE, ci);
if (source !== "bootstrap") process.exit(0);

const base = process.env.EMDASH_URL?.replace(/\/$/, "");
if (!base) {
  if (ci) {
    console.error("BXR_CONTENT_SOURCE=bootstrap needs EMDASH_URL (the Worker's own URL) so the build can confirm the CMS is not set up yet.");
    process.exit(1);
  }
  console.warn("bootstrap: EMDASH_URL not set, skipping the CMS check (local build).");
  process.exit(0);
}

let status = null;
try {
  const headers = {};
  if (process.env.CF_ACCESS_CLIENT_ID) {
    headers["cf-access-client-id"] = process.env.CF_ACCESS_CLIENT_ID;
    headers["cf-access-client-secret"] = process.env.CF_ACCESS_CLIENT_SECRET ?? "";
  }
  const r = await fetch(`${base}/_emdash/api/setup/status`, { headers, redirect: "manual", signal: AbortSignal.timeout(15000) });
  if (r.status === 401 || r.status === 403 || (r.status >= 300 && r.status < 400)) {
    console.error(`bootstrap refused: ${base}/_emdash is protected (HTTP ${r.status}), so the CMS is already set up. Switch to BXR_CONTENT_SOURCE=emdash (docs/DEPLOY.md §2.4).`);
    process.exit(1);
  }
  status = await r.json().catch(() => null);
} catch (e) {
  console.warn(`bootstrap: ${base} not reachable (${e.message}); treating this as the first deployment.`);
}
const decision = bootstrapDecision(status);
if (!decision.ok) {
  console.error(`bootstrap refused: ${decision.reason}`);
  process.exit(1);
}
console.warn("bootstrap build: site generated from src/content Markdown, every page noindex. Switch to BXR_CONTENT_SOURCE=emdash after importing content.");
