# bigxreality-web

Big x Reality 官網 2.0（Astro 7.3.8，純靜態輸出）。規劃與決定紀錄見 [`docs/PLAN.md`](docs/PLAN.md)。

## 本機執行

需要 Node 22.12 以上。

```bash
npm install
npm run dev        # http://localhost:4321/tw/products/
npm run build      # 輸出到 dist/（會先產生字型與 favicon）
```

## 品質檢查

先 `npm run build`，再執行：

| 指令 | 內容 |
|---|---|
| `npm test` | 單元測試（區塊顯示規則、[待提供] 標記） |
| `npm run check` | Astro / TypeScript 型別檢查 |
| `npm run check:i18n` | 三語檔案完整度（build 時也會自動列出） |
| `npm run qa:links` | 內部連結檢查，分開列出「尚未建立的頁面」與「壞連結」 |
| `npm run qa:a11y` | axe（WCAG 2.1 AA）三頁 × 1440 / 390，加手機選單鍵盤測試 |
| `npm run qa:behaviour` | 篩選、語言切換、hreflang、noindex、JSON-LD、關聯正反查等行為測試 |
| `npm run qa:lighthouse [路徑]` | Lighthouse 四項分數（預設 `/tw/products/sut/`），報告寫到 `.qa/lighthouse.html` |
| `npm run qa:shots` | Playwright 截圖到 `docs/screenshots/phase-1/` |

瀏覽器預設用 `/opt/pw-browsers/chromium`；其他環境請設定 `CHROMIUM_PATH`。

## 內容

- 內容在 `src/content/<collection>/<tw|en|jp>/<slug>.md`（Decap CMS `multiple_folders` 結構）。
- 排序、領域、關聯、日期、草稿這些結構欄位只讀 `tw` 檔。
- 沒有填的欄位：整個區塊不顯示；填 `[待提供]`：區塊照常顯示並標出缺什麼。
- 介面文字在 `src/content/ui/<lang>.json`，站點設定在 `src/data/site.json`。
- `design-source/` 是設計來源，程式直接引用，不要修改。
