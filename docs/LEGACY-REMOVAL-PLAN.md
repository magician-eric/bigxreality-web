# 舊架構安全移除計畫（待流程驗收及確認後執行）

本文件只定義清理依賴與順序，不是第二套架構。唯一架構見 ARCHITECTURE.md。本次不刪任何外部資源；無法讀取 Cloudflare 帳戶或真人 GitHub 發布時，不宣稱完成外部退役。

修正前逐檔與套件分類： [盤點快照](audits/architecture-baseline-2026-10-30/README.md)。快照固定在 main 7c9602b，不代表本 PR 後仍保留 preview.yml；下列依賴先決條件優先。

## 目前已確認的呼叫鏈

- astro.config.mjs 無條件載入 @astrojs/cloudflare、EmDash、D1／R2 adapter、bxr-cms plugin，所以即使 Pages 讀 Git，直接卸載仍會讓 build 失敗。
- src/content.config.ts 匯入 emdashLoader，content-source 還有 emdash／bootstrap／fixtures／markdown；正式 Pages 已固定 markdown 並拒絕其他模式。
- src/lib/site.ts 的 .cms-site.json 是舊 EmDash 覆寫；Pages 的 Git 模式不走它。
- src/worker.ts／live.config.ts／middleware.ts／wrangler.jsonc／seed／.emdash 是舊 runtime、schema 與部署。
- scripts/cms/* 是舊匯入與遠端抓取；scripts/sveltia/* 才是唯一正式 CMS 工具，不能一起刪。
- React 仍被 Footer 的 @phosphor-icons/react/dist/ssr 使用，不能以「移除 CMS」為由刪除 React renderer。
- tests/search-tokenize.test.ts 同時包含正式搜尋與 EmDash Portable Text 測試；只能拆出後者，不能整檔刪除。
- scripts/lib/cms-content.mjs 讀的是目前 Git Markdown，雖檔名有 cms，並非 EmDash loader，應保留。

## 建議保留

Astro、React SSR 圖示所需依賴、Sharp、字型、Markdown、Pagefind、Sveltia App／產生器／自訂欄位、Git 內容與媒體、三語規則、SEO／版型／無障礙／發布驗證。fixtures 是非發布測試，不是第二 CMS。

## 建議移除／重寫（尚未執行）

| 項目 | 先決條件／影響 |
| --- | --- |
| @astrojs/cloudflare、@emdash-cms/cloudflare、emdash、bxr-cms | 先移除 Astro integration、loader 匯入、Worker/live config 與相關測試，驗證純靜態輸出 |
| @cloudflare/kumo、kysely | 未找到前台直接引用，但 EmDash 仍間接使用；拆舊依賴後由 npm 重建 lock，不手刪共享套件 |
| github-slugger | 目前只用於 Portable Text 轉換與其測試；搜尋分詞仍保留 |
| wrangler、@cloudflare/workers-types | Worker 與 provider 專用型別／工具移除後卸載 |
| src/lib/emdash/*、src/live.config.ts、src/worker.ts | 舊內容與 API 沒有正式依賴、資料已比對備份後移除 |
| scripts/cms/*、plugins/bxr-cms/*、seed/seed.json、.emdash、emdash-env.d.ts | 確認無待匯入的唯一資料與使用者依賴；必要資料先封存 |
| src/middleware.ts、Astro manual i18n 設定 | 現有前台用 src/i18n 自有三語路由；先驗證移除 CMS locale 後的三語與路由，再移除舊 middleware |
| content-source／site override | 只保留正式 Git 與隔離測試，不刪 draft／翻譯／日期／核准等公開資格檢查 |
| 舊環境變數與部署文件 | 新流程正式驗收後，清除不用的 secret／Hook／Workers CI 設定；不列印 secret 值 |
| 舊 dist/client 中間輸出 | 移除 adapter 後變 dist；同步修改 build-search、serve／QA 的 11 個舊輸出路徑，不先刪子路徑封裝功能 |

## 外部狀態仍需確認

GitHub Pages 實際來源／最新成功部署、main 分支保護、Sveltia 真人授權與 PR；Cloudflare Worker 是否仍對外、D1 是否有唯一內容、R2 是否有未進 Git 的素材、DNS／custom domain／Deploy Hook。wrangler 的綁定不是資源真的已建立或正在使用的證明。

## 執行順序

1. 先完成 CMS→main→Actions→Pages 的真人隔離驗收，保存正式部署 SHA、內容／媒體指紋及分支差異。
2. 核對外部 Worker／D1／R2／路由。備份設定、D1 匯出與 R2 清單／原始媒體，將唯一資料逐項比對後遷移；不自動拿任一份覆寫 Git。
3. 在另一個獨立清理分支拆 Astro／loader／runtime 呼叫鏈，再卸載套件與更新 lock。
4. 改成明確 static build，維持原網址與唯一 base，調整搜尋／測試輸出路徑。通過產品、方案、三語、新聞、CMS、媒體、SEO、Pages 驗證。
5. PR 人工審核後發布；確認 Pages 版本與 main 一致，且不再需要 Cloudflare 資料。
6. 由管理者依核准範圍停用外部自動建置／Hook，再退役服務。刪 D1／R2／Worker 是獨立的不可逆操作門檻，未確認前不執行。

## 回復

程式／設定由原始提交與 Git revert 回復；舊分支不重設。保留最後成功 Pages artifact 與來源 SHA，可重新執行該版本的工作流程。外部資料靠事前匯出與平台備份回復，Git revert 不能復原已刪資料庫／bucket；不得未備份就刪服務。沒有證據證明使用的外部系統，不繼續作為正式架構，但在資料確認前也不擅自銷毀。
