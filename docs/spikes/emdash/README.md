# EmDash 本機技術驗證（K2，2026-10-19）

結論與工時評估見 `docs/PHASE-2-PLAN.md` §14。這裡記錄怎麼重現。

- **只在本機執行**：D1、R2 都是 wrangler／miniflare 的本機模擬（`.wrangler/state`）。沒有登入 Cloudflare、沒有建立任何雲端資源、沒有部署。
- **測試環境與正式程式隔離**：用 `git archive` 複製一份網站到暫存資料夾操作，正式 repo 的程式碼完全沒有修改。
- `project/` 是測試環境中**新增或修改**的檔案（不是完整專案）；`project/content.config.diff` 是對第一階段 `src/content.config.ts` 的修改。
- 測試內容標示 `TEST FIXTURE`，只存在本機模擬資料庫。產品、解決方案、整合情境用的是第一階段的正式文字（透過 `tests/05-import.mjs` 匯入）。

## 版本

| 套件 | 版本 | 備註 |
|---|---|---|
| astro | 7.3.8 | 第一階段鎖定版本，未變更 |
| emdash、@emdash-cms/cloudflare | 1.3.1 | EmDash 本身以 Astro `^7.3.2` 開發 |
| @astrojs/cloudflare | **14.3.4** | 最新 14.4.0 要求 Astro 7.4，不能用 |
| @astrojs/react | 7.1.0 | 後台介面需要；只在後台路由載入 |
| react、react-dom | 19.2.4 | |
| wrangler | 4.151.2 | 本機模擬 D1／R2 |
| Node.js | 22.22.0 | |

## 重現步驟

```bash
# 1. 隔離的網站副本
git archive HEAD | tar -x -C <spike>
cd <spike> && npm ci
npm i -E emdash@1.3.1 @emdash-cms/cloudflare@1.3.1 @astrojs/cloudflare@14.3.4 \
  @astrojs/react@7.1.0 react@19.2.4 react-dom@19.2.4 @cloudflare/kumo@2.6.0 @phosphor-icons/react kysely
npm i -D -E wrangler@4.151.2 @cloudflare/workers-types
# 2. 放入 project/ 的檔案，套用 content.config.diff；npm i ./plugins/deploy-hook
npx emdash secrets generate --write .env
npx emdash seed --validate seed/seed.json
# 3. 測試（tests/ 放在 <spike>/spike-tests/）
spike-tests/reset.sh                      # 清空本機 D1/R2，啟動 dev server，完成初始設定
node spike-tests/01-model.mjs             # 資料模型、三語、翻譯狀態、關聯、重複欄位、圖片
node spike-tests/02-reverse.mjs           # 反向關聯
node spike-tests/03-lifecycle.mjs         # 草稿、發布、版本、排程、下架、垃圾桶、角色權限
node spike-tests/04-admin.mjs             # 後台介面（瀏覽器）
node spike-tests/08-deploy-hook.mjs       # 發布事件觸發重建
node spike-tests/09-builtins.mjs          # SEO 欄位、整站匯出、稽核紀錄
# 4. 資料來源替換比較
spike-tests/reset.sh && node spike-tests/05-import.mjs   # 匯入第一階段 Markdown
# 建立唯讀 token（content:read）後：
BXR_CONTENT_SOURCE=emdash EMDASH_TOKEN=<token> npx astro build
python3 spike-tests/06-compare.py <第一階段 dist> dist/client
node spike-tests/07-visual.mjs <第一階段 dist> dist/client <輸出資料夾>
```

## 結果摘要

| 腳本 | 結果 |
|---|---|
| 01-model | 11/11 |
| 02-reverse | 3/3 |
| 03-lifecycle | 18/18 |
| 04-admin | 6/6 |
| 05-import | 27 筆（9 筆內容 × 3 語）全部匯入並發布 |
| 06-compare | 12 頁 SEO 標籤全部相同；HTML 只差 Counter-UAS 參與產品的順序（見 `screenshots/counter-uas-order-diff.png`）與空白字元 |
| 07-visual | USV 頁 0 像素差異；其他頁的差異只在上述那一行 |
| 08-deploy-hook | 5/5（記錄模式；EmDash 的 SSRF 防護不允許外掛連到本機位址） |
| 09-builtins | 3/3（稽核紀錄只記錄安全相關操作，見 §14） |
| 第一階段原有測試（對 EmDash 版 build） | 單元 5/5、axe 0 個嚴重問題、手機選單鍵盤通過、壞連結 0、行為測試 26/27（根目錄改由 `_redirects` 301，測試需改寫） |
| Pagefind 三語品質（重跑 `docs/spikes/pagefind`） | 採用的方式 44/44（繁中 20/20、英 10/10、日 14/14）；原生斷詞 38/44 |
