// node --test tests/  (Node ≥ 22.18 strips TypeScript types natively)
import { test } from "node:test";
import assert from "node:assert/strict";
import { visibleProductSections, hasContent, containsPending, PENDING } from "../src/lib/pending.ts";
import { markPending, markPendingHtml } from "../src/lib/text.ts";

test("left-out fields hide their section", () => {
  assert.deepEqual(visibleProductSections({}), []);
  assert.deepEqual(visibleProductSections({ capabilities: [], components: [], overview: "  " }), []);
  assert.deepEqual(visibleProductSections({ overview: "text", deployment: {} }), ["overview"]);
});

test("[待提供] counts as content, so the section shows with the marker", () => {
  const s = visibleProductSections({
    capabilities: [{ title: PENDING, description: PENDING }],
    deployment: { area: PENDING },
    integratedOps: { description: PENDING },
  });
  assert.deepEqual(s, ["capabilities", "deployment", "integratedOps"]);
});

test("sections keep template order", () => {
  const s = visibleProductSections({ relatedArticles: ["a"], scenarios: [{ title: "x", description: "y" }], overview: "x", relatedSolutions: ["military"] });
  assert.deepEqual(s, ["overview", "scenarios", "relatedSolutions", "relatedArticles"]);
});

test("hasContent / containsPending", () => {
  assert.equal(hasContent(0), true);
  assert.equal(hasContent([{ a: undefined }]), false);
  assert.equal(containsPending({ a: [{ b: "x [待提供] y" }] }), true);
  assert.equal(containsPending({ a: 1 }), false);
});

test("markers are escaped and wrapped", () => {
  assert.equal(markPending("<b>[待提供]"), '&lt;b&gt;<mark class="pending">[待提供]</mark>');
  assert.equal(
    markPendingHtml('<p title="[待提供]">核心價值：[待提供]</p>'),
    '<p title="[待提供]">核心價值：<mark class="pending">[待提供]</mark></p>',
  );
});
