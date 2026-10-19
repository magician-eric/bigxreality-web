# Pagefind 三語搜尋技術驗證（第二階段 T0）

結果與結論見 `docs/PHASE-2-PLAN.md` §12。這裡只放重現方式。

測試網站是隔離的假資料：繁中文字取自第一階段的正式內容，英文、日文是只供測試用的句子，不會進網站。

```bash
cd docs/spikes/pagefind
npm init -y && npm i -E pagefind@1.5.2 playwright-core@1.64.1
node make-site.mjs           # 產生 site/（三語 × 4 篇可索引頁＋列表頁、待翻譯頁、搜尋頁）
node run-native.mjs          # 基準：Pagefind 原生 HTML 索引與中日文斷詞
node run-bigram.mjs          # 方案：雙字詞＋ASCII 編碼的自訂索引
node minimal.mjs             # 最小案例（兩頁）
node only.mjs <標籤> <資料夾...>   # 只索引部分頁面，用來縮小問題範圍
```

| 檔案 | 用途 |
|---|---|
| `cases.mjs` | 44 個測試案例與預期結果（兩種方案共用） |
| `tokenize.mjs` | 方案用的斷詞與編碼（索引與查詢共用同一個函式） |
| `run-spike-fresh.mjs` | 第一次探索用的原始腳本 |
