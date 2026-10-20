import { test } from "node:test";
import assert from "node:assert/strict";
import { publishDecision, saveRule, nextRun } from "bxr-cms";

const AUTHOR = { role: 30 };
const EDITOR = { role: 40 };

test("authors cannot publish unapproved content; editors can", () => {
  assert.ok(publishDecision("news", { review_status: "submitted" }, AUTHOR)?.cancel);
  assert.equal(publishDecision("news", { review_status: "approved" }, AUTHOR), undefined);
  assert.equal(publishDecision("news", { review_status: "draft" }, EDITOR), undefined);
  assert.equal(publishDecision("scenarios", {}, AUTHOR), undefined);
});

test("case studies need client authorisation for everyone", () => {
  assert.ok(publishDecision("case_studies", { review_status: "approved", approved: 0 }, EDITOR)?.cancel);
  assert.equal(publishDecision("case_studies", { review_status: "approved", approved: 1 }, EDITOR), undefined);
});

test("an author's save cannot self-approve", () => {
  assert.equal(saveRule("insights", { review_status: "approved", title: "x" }, AUTHOR)?.review_status, "submitted");
  assert.equal(saveRule("insights", { review_status: "approved" }, EDITOR), undefined);
  assert.equal(saveRule("insights", { review_status: "submitted" }, AUTHOR), undefined);
});

test("rebuild is debounced but capped", () => {
  const t0 = Date.parse("2026-10-20T00:00:00Z");
  assert.equal(nextRun(t0, null, 2, 10), "2026-10-20T00:02:00.000Z");
  assert.equal(nextRun(t0 + 9 * 60_000, t0, 2, 10), "2026-10-20T00:10:00.000Z");
});
