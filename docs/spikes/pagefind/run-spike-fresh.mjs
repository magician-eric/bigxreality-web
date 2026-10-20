import * as pagefind from "pagefind";
import { chromium } from "playwright-core";
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";

const { index } = await pagefind.createIndex();
const added = await index.addDirectory({ path: "site" });
console.log("indexed pages:", added.page_count);
await index.writeFiles({ outputPath: "site/pagefind" });
await pagefind.close();

const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".wasm": "application/wasm", ".json": "application/json" };
const server = createServer(async (req, res) => {
  let p = path.join("site", decodeURIComponent(req.url.split("?")[0]));
  try { if ((await stat(p)).isDirectory()) p = path.join(p, "index.html"); res.writeHead(200, { "content-type": types[path.extname(p)] ?? "application/octet-stream" }); res.end(await readFile(p)); }
  catch { res.writeHead(404).end(); }
}).listen(4399);

const CASES = {
  tw: [["小部隊", "zh 連續詞 3 字"], ["無人機", "zh 連續詞"], ["戰術訓練", "zh 4 字"], ["近接戰鬥", "zh 4 字"], ["胸掛顯示板", "zh 5 字"], ["無人船", "zh"], ["訓練", "zh 2 字"], ["搖桿", "zh 2 字"], ["協同", "zh 2 字"], ["射擊", "zh 2 字"], ["部隊戰", "zh 跨詞片段"], ["SUT", "代號"], ["MUM-T", "含連字號代號"], ["CQB", "英文縮寫"], ["tactical", "英文（應無結果）"], ["LISTINGTOKEN", "列表頁（應無結果）"], ["PENDINGTOKEN", "待翻譯頁（應無結果）"], ["NAVTOKEN", "選單文字（應無結果）"]],
  en: [["tactical", "完整字"], ["tact", "前綴"], ["drone", "完整字"], ["dron", "前綴"], ["unmanned", "完整字"], ["train", "前綴（training）"], ["ctical", "字中片段"], ["marksmanship", "完整字"], ["joystick", "完整字"], ["SUT", "代號"], ["無人機", "中文（應無結果）"], ["ドローン", "日文（應無結果）"], ["PENDINGTOKEN", "待翻譯頁（應無結果）"]],
  jp: [["無人艇", "漢字"], ["訓練", "漢字 2 字"], ["戦術訓練", "漢字 4 字"], ["近接戦闘", "漢字 4 字"], ["ドローン", "片假名"], ["ジョイスティック", "片假名長字"], ["シナリオ", "片假名"], ["ディスプレイ", "片假名"], ["操縦します", "漢字＋平假名"], ["操縦", "漢字（活用前）"], ["できます", "平假名"], ["小部隊", "漢字"], ["SUT", "代號"], ["drone", "英文（應無結果）"], ["無人機", "繁中詞（日文頁沒有這個詞）"], ["PENDINGTOKEN", "待翻譯頁（應無結果）"]],
};

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const results = {};
for (const lang of ["tw", "en", "jp"]) {
  results[lang] = [];
  for (const [q, note] of CASES[lang]) {
    const page = await browser.newPage();
    await page.goto(`http://127.0.0.1:4399/${lang}/search/`);
    const urls = await page.evaluate(async (q) => {
      const pf = await import("/pagefind/pagefind.js");
      await pf.init();
      const r = await pf.search(q);
      return Promise.all(r.results.map(async (x) => (await x.data()).url));
    }, q);
    results[lang].push({ q, note, urls });
    console.log(`${lang} | ${q.padEnd(16)} | ${note.padEnd(22)} | ${urls.length} | ${urls.join(" ")}`);
    await page.close();
  }
}
await browser.close();
server.close();
