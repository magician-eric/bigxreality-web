import { test } from "node:test";
import assert from "node:assert/strict";
import { createServer, type Server } from "node:http";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import path from "node:path";
import { resolveContentSource, bootstrapDecision } from "../src/lib/content-source.ts";

const run = promisify(execFile);
const SCRIPT = path.resolve(import.meta.dirname, "../scripts/cms/check-source.mjs");

test("historical Workers Builds accepts emdash and bootstrap only", () => {
  assert.equal(resolveContentSource("emdash", true), "emdash");
  assert.equal(resolveContentSource("bootstrap", true), "bootstrap");
  assert.throws(() => resolveContentSource("markdown", true), /Legacy Workers builds/);
  assert.throws(() => resolveContentSource("fixtures", true), /Legacy Workers builds/);
  assert.throws(() => resolveContentSource(undefined, true), /Legacy Workers builds/);
  assert.throws(() => resolveContentSource("draft", false), /must be/);
  assert.equal(resolveContentSource(undefined, false), "markdown");
});

test("bootstrap is refused once the CMS has an admin", () => {
  assert.equal(bootstrapDecision(null).ok, true);
  assert.equal(bootstrapDecision({ success: true, data: { needsSetup: true } }).ok, true);
  assert.equal(bootstrapDecision({ success: true, data: { needsSetup: false } }).ok, false);
});

async function gate(answer: ((res: import("node:http").ServerResponse) => void) | null, env: Record<string, string> = {}) {
  let server: Server | undefined;
  let url = "http://127.0.0.1:9"; // closed port = Worker not deployed yet
  if (answer) {
    server = createServer((req, res) => (req.url === "/_emdash/api/setup/status" ? answer(res) : res.writeHead(404).end()));
    await new Promise<void>((r) => server!.listen(0, "127.0.0.1", r));
    url = `http://127.0.0.1:${(server.address() as { port: number }).port}`;
  }
  try {
    await run(process.execPath, [SCRIPT], { env: { ...process.env, WORKERS_CI: "1", BXR_CONTENT_SOURCE: "bootstrap", EMDASH_URL: url, ...env } });
    return true;
  } catch {
    return false;
  } finally {
    server?.close();
  }
}
const json = (body: unknown) => (res: import("node:http").ServerResponse) => res.writeHead(200, { "content-type": "application/json" }).end(JSON.stringify(body));

test("bootstrap gate: first deployment and fresh CMS are allowed", async () => {
  assert.equal(await gate(null), true, "Worker not deployed yet");
  assert.equal(await gate((res) => res.writeHead(404).end("not found")), true, "no Worker on that URL");
  assert.equal(await gate(json({ success: true, data: { needsSetup: true, step: "start" } })), true, "CMS not set up");
});

test("bootstrap gate: set-up or protected CMS is refused", async () => {
  assert.equal(await gate(json({ success: true, data: { needsSetup: false } })), false, "admin exists");
  assert.equal(await gate((res) => res.writeHead(403).end()), false, "behind Cloudflare Access");
  assert.equal(await gate((res) => res.writeHead(302, { location: "https://x.cloudflareaccess.com" }).end()), false, "Access login redirect");
});

test("bootstrap gate needs EMDASH_URL in the legacy Workers profile; other sources pass through", async () => {
  const noUrl = await run(process.execPath, [SCRIPT], { env: { ...process.env, WORKERS_CI: "1", BXR_CONTENT_SOURCE: "bootstrap", EMDASH_URL: "" } }).then(() => true, () => false);
  assert.equal(noUrl, false);
  const markdown = await run(process.execPath, [SCRIPT], { env: { ...process.env, WORKERS_CI: "1", BXR_CONTENT_SOURCE: "markdown" } }).then(() => true, () => false);
  assert.equal(markdown, false, "markdown still refused in the legacy Workers profile");
  const emdash = await run(process.execPath, [SCRIPT], { env: { ...process.env, WORKERS_CI: "1", BXR_CONTENT_SOURCE: "emdash" } }).then(() => true, () => false);
  assert.equal(emdash, true);
});
