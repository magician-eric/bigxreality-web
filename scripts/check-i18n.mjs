import path from "node:path";
import { i18nCoverage, formatCoverage } from "./lib/i18n-coverage.mjs";

const result = await i18nCoverage(path.resolve(import.meta.dirname, ".."));
const lines = formatCoverage(result);
for (const l of lines) console.warn(`warn  ${l}`);
for (const p of result.pending) console.log(`      pending: ${p}`);
if (!lines.length) console.log("i18n: every slug exists in en, tw and jp");
