import { test } from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { scanContent, endsWithPeriod } from "../scripts/lib/punctuation.mjs";

const ROOT = path.resolve(import.meta.dirname, "../src/content");

test("headline-style fields (titles, names, sub-headlines, taglines, card titles) end without a period", async () => {
  const found = await scanContent(ROOT);
  assert.deepEqual(found.map((f) => `${f.file}: ${f.key} = ${f.value}`), []);
});

test("the rule recognises sentence-final marks", () => {
  for (const s of ["訓練。", "Train.", "好嗎？", "完成！", "a;"]) assert.equal(endsWithPeriod(s), true, s);
  for (const s of ["訓練", "Train", "VR｜沉浸式環境", "SUT（Small Unit Tactical）"]) assert.equal(endsWithPeriod(s), false, s);
});
