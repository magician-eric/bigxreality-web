import { test } from "node:test";
import assert from "node:assert/strict";
import { tokenize, searchLanguage } from "../src/lib/search-tokenize.ts";
import { portableTextToHtml, portableTextToPlain } from "../src/lib/emdash/portable-text.ts";

test("CJK runs become overlapping encoded bigrams; Latin words stay", () => {
  const t = tokenize("UAV 戰術訓練");
  assert.match(t, /^UAV( qz[a-z]{8}){3}$/);
  // a query's bigrams appear consecutively inside the document's tokens
  assert.ok(tokenize("SUT 戰術訓練系統").includes(tokenize("戰術訓練")));
  assert.equal(tokenize("術").split(" ").length, 1);
});

test("Japanese kana and the long-vowel mark are tokenized", () => {
  assert.equal(tokenize("シミュレーション").split(" ").length, "シミュレーション".length - 1);
});

test("search language codes are lower case", () => {
  assert.equal(searchLanguage("zh-Hant-TW"), "zh-hant-tw");
});

test("Portable Text renders safe HTML", () => {
  const span = (text: string, marks: string[] = []) => ({ _type: "span", _key: "s", text, marks });
  const html = portableTextToHtml(
    [
      { _type: "block", _key: "a", style: "h1", children: [span("Title")] },
      { _type: "block", _key: "b", style: "normal", markDefs: [{ _type: "link", _key: "l", href: "javascript:alert(1)" }], children: [span("<b>x</b>", ["l", "strong"])] },
      { _type: "block", _key: "c", listItem: "bullet", level: 1, children: [span("one")] },
      { _type: "block", _key: "d", listItem: "bullet", level: 2, children: [span("nested")] },
      { _type: "block", _key: "e", listItem: "bullet", level: 1, children: [span("two")] },
      { _type: "htmlBlock", _key: "f", html: "<script>alert(1)</script>" },
    ],
    () => undefined,
  );
  assert.ok(html.includes('<h2 id="title">Title</h2>'), "h1 in the editor becomes h2, with an anchor");
  assert.ok(!html.includes("javascript:") && !html.includes("<script>"));
  assert.ok(html.includes("<strong>&lt;b&gt;x&lt;/b&gt;</strong>"));
  assert.ok(html.replace(/\n/g, "").includes("<ul><li>one<ul><li>nested</li></ul></li><li>two</li></ul>"));
  assert.equal(portableTextToPlain([{ _type: "block", children: [span("a")] }]), "a");
});
