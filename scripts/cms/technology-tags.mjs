#!/usr/bin/env node
/** Add only the optional insights field; existing entries and all other schema stay untouched.
 * Default is read-only. Use --apply locally; remote writes also need --allow-remote after owner approval.
 */
import { readFile } from "node:fs/promises";
import { connect, api, BASE } from "./lib.mjs";
const expected = JSON.parse(await readFile(new URL("../../seed/seed.json", import.meta.url), "utf8"))
  .collections.find((c) => c.slug === "insights").fields.find((f) => f.slug === "technology_tags");
const apply = process.argv.includes("--apply");
if (apply && !/^http:\/\/(127\.0\.0\.1|localhost)(:\d+)?$/.test(BASE) && !process.argv.includes("--allow-remote")) {
  throw new Error("Remote schema writes require owner approval and explicit --allow-remote. No change made.");
}
await connect();
const result = await api("GET", "/schema/collections/insights/fields");
const fields = result.items ?? result.fields ?? result;
const existing = fields.find((f) => f.slug === expected.slug);
if (existing) {
  if (existing.type !== expected.type || existing.translatable !== false || JSON.stringify(existing.validation?.options) !== JSON.stringify(expected.validation.options)) {
    throw new Error("Existing technology_tags schema differs; refusing to alter it. Review the schema manually.");
  }
  console.log("technology_tags already matches; no changes.");
} else if (!apply) {
  console.log("Missing optional insights.technology_tags field. Proposed additive schema:", JSON.stringify(expected));
  console.log("Nothing changed. Apply locally with --apply; remote use additionally requires owner approval and --allow-remote.");
} else {
  await api("POST", "/schema/collections/insights/fields", expected);
  console.log("Added optional insights.technology_tags only. Existing article data was not changed.");
}
