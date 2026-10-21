# 核心技術第一階段

本文件保留第一批的實作與驗收紀錄。第二批完成後，七項技術皆有三語詳細頁，最新操作與驗收見 [第二批文件](TECHNOLOGIES-BATCH-TWO.md)。

固定技術 ID 為 `xr`、`ai-simulation`、`digital-simulation`、`training-design`、`system-integration`、`decision-visualization`、`domain-expertise`。本階段公開三語總覽與 `xr`、`training-design`、`domain-expertise` 的三語詳細頁；其餘四項只有總覽簡介，不產生空白公開頁或失效連結。

繁中正式內容與英、日完整翻譯集中在 `src/data/technologies-content.ts`。英文、日文逐段對照繁中母版，沒有借用其他語言文章補空缺。內容區塊、清單、FAQ 與 CTA 共用資料結構，頁面沿用既有 Header、Footer、SeoHead、Breadcrumb、FAQ 及品牌樣式。

## 驗收

使用專案指定 Node 22，並先完成依賴安裝。建置前先停止自己啟動的開發伺服器；完成建置後再重新啟動 `npm run dev`，避免長時間 watcher 讀取建置中間產物而出現暫時 500。在本雲端環境可先 `source /workspace/.cloud-tools/bxr-env.sh`；其他環境請將 `CHROMIUM_PATH` 設為可用 Chromium 執行檔。

```bash
npm test
npm run check
npm run build
npm run qa:technologies
npm run check:sitemap
npm run qa:links
```

技術頁驗收讀取 `dist/client` 的實際 HTML，測試三語總覽及九個詳細頁、完整文案、區塊／段落／清單數量、單一 H1、SEO、canonical、hreflang、BreadcrumbList、索引與 sitemap、FAQ 初始 HTML／鍵盤／單項展開，以及手機 390px、平板 820px、桌面 1440px 的水平溢位與 FAQ 操作。它也檢查相關文章最多六篇、語言與日期順序、文章反向連結與 Article 結構化資料（有文章時）。

驗收產生 `.qa/technologies-content-audit.md`，列出逐頁三語區塊、段落、FAQ、圖片／Alt、CTA 與 SEO 比對。依業主最新要求，技術頁只保留圖片位置，不插入或新增圖片；Hero 與相關產品／解決方案／文章卡片沿用既有圖片位置元件，提供當語 aria-label。技術頁不展示缺少資料的 Footer 聯絡欄位；其他既有頁面的預設行為維持不變。每次執行重建報告，失敗會保留非零結束碼。報告的數量檢查能找出遺漏，不能取代翻譯語意與宣稱的人工審閱。

```bash
npm run build:fixtures
QA_DIST=dist-fixtures/client npm run qa:technologies
```

Fixture 模式只用於驗證文章關聯，所有測試頁維持 noindex，不可部署。正式 Markdown 建置則讓完整三語技術頁可索引，並列入 sitemap。

## SEO、AEO 與 GEO

技術頁可檢索的完整段落、定義、標題與 FAQ 均存在於初始 HTML，FAQ 使用既有單開 Accordion。沿用全站 canonical、hreflang、BreadcrumbList 與文章 Article 資料，不虛構評分、認證、作者或案例。

依 Google 已公布的 FAQ 複合式搜尋結果政策，其呈現資格主要限於具公信力的政府及健康網站。BXR 為 B2B 商業網站，本批技術頁採保守方式，不新增 FAQPage JSON-LD，仍保留可檢索的完整 FAQ HTML。FAQPage 的存在本身不代表符合 Google 呈現資格。官方來源：[Google FAQ structured data](https://developers.google.com/search/docs/appearance/structured-data/faqpage)。本次環境嘗試重新擷取此文件時回傳 HTTP 403，因此未宣稱已在線核對最新版本。SEO、AEO、GEO 不保證排名或 AI 推薦。

## CMS 與發布驗證邊界

沿用既有 `insights` 技術文章與資源中心，文章的 `technologyTags` 是固定 ID 陣列，可同時標記多個技術。技術頁採共用查詢，只呈現符合語言、已發布且有內容的最新六篇文章，沒有文章時不渲染整個列表。文章反向連結對三項已公開技術導向獨立頁，其餘四項導向總覽的對應技術錨點，不連到尚未建立的頁面。

正式網站公開頁是預先建置 HTML；CMS 更新需經發布事件觸發既有重建流程，再由 Workers Builds 以 `BXR_CONTENT_SOURCE=emdash` 拉取已發布內容。只有儲存草稿不會改變已發布關聯；修改標籤後必須再次發布。既有插件處理所有集合（包括 insights）的發布、取消發布與刪除事件，採兩分鐘 debounce，最長等待十分鐘後呼叫 hook。Deploy Hook 在後台 Plugins → Big x Reality → Settings 設定，細節見 [DEPLOY.md](DEPLOY.md)。本開發不直接變更正式 CMS 資料、憑證或部署設定。

本地與 fixture 的驗收不等同於正式發布驗收。正式環境需由業主確認 Deploy Hook 與 CMS build 唯讀憑證，發布／更新一篇已授權測試文章並確認重建成功，再核對對應語言技術頁新增／移除關聯、排序與文章反向連結。未執行此正式操作時，交付報告必須明確保留此驗證項目，不能宣稱已確認正式內容發布成功。

### 既有 CMS 的增量欄位更新

CMS 使用既有 `insights` 集合的非翻譯、多選欄位 `technology_tags`，載入後對應網站資料的 `technologyTags`。繁中來源保存結構標籤，各語文章保留各自正文與翻譯狀態。新 seed 已包含此選填欄位；未設定標籤的舊文章維持原有行為，不會被自動加入任何技術分類。

```bash
# 對應你已啟動的本機 Astro CMS 埠（script 預設為 4400）
export EMDASH_URL=http://127.0.0.1:4321
# 只讀檢查現有欄位與提案，不改 schema 或文章
node scripts/cms/technology-tags.mjs
# 僅在自己的本機 CMS 套用缺少的選填欄位
node scripts/cms/technology-tags.mjs --apply
```

腳本只新增缺少的欄位，重複執行不重複新增；若現有同名欄位規格不同則停止，不覆蓋既有 schema。遠端寫入另需業主確認及明確 `--allow-remote`，本次沒有執行遠端操作。正式環境請使用既有安全憑證注入，不要把 token 寫進命令、文件或 Git。

本次已執行 `tests/cms/technology-tags.mjs` 的真實本機 CMS 整合測試：建立暫時三語文章、發布、變更標籤但不發布、再次發布，透過真正 EmDash loader 讀 HTTP CMS 資料並執行共用查詢，確認英文使用獨立正文、日文 pending 被排除，以及發布事件確實更新既有重建任務的排程與 payload（`reason: publish`、`collection: insights`），並非僅以舊任務存在判定成功。暫時文章及測試 token 已清除。此驗證補足純 Markdown fixture 的範圍，但不代表正式遠端 Deploy Hook 已呼叫或正式網站已部署。

## 本次驗證紀錄

- 技術頁完整性驗收：Markdown 352 項、fixture 367 項全部通過。Fixture 實際確認 TW 標籤文章出現在 XR／訓練設計頁、文章反向連結與 Article 結構化資料；JP pending 與缺少 EN 翻譯不會混入列表。
- 單元測試：28 個通過。
- Sitemap：72 個 URL 通過。
- 全站內部連結／資源：檢查 5,722 筆，壞連結為零；檢查器另列六個既有規劃頁（`/tw/`、`/en/`、`/jp/` 與各語 `/privacy/`），它們尚未實作，不能視為全部內部連結都可訪問。
- 可及性：三語代表技術頁（TW XR、EN 模擬訓練設計、JP 專業領域知識）於 1440px、390px 共六次 axe 檢查，critical、serious、moderate、minor 均為零；手機選單鍵盤開啟、焦點限制、Esc 關閉與焦點返回均通過。
- 真實本機 CMS 發布 → loader → 查詢 → 重建任務排程測試通過；正式遠端 CMS／Deploy Hook／部署未執行。

技術頁完整性工具的最終實測比對表另見 [TECHNOLOGIES-CONTENT-AUDIT.md](TECHNOLOGIES-CONTENT-AUDIT.md)；每次 QA 的原始報告仍輸出到 `.qa/technologies-content-audit.md`。

## 三語頁面路徑

| 頁面 | 繁體中文 | English | 日本語 |
|---|---|---|---|
| 核心技術總覽 | `/tw/technologies/` | `/en/technologies/` | `/jp/technologies/` |
| XR 延展實境 | `/tw/technologies/xr/` | `/en/technologies/xr/` | `/jp/technologies/xr/` |
| 模擬訓練設計 | `/tw/technologies/training-design/` | `/en/technologies/training-design/` | `/jp/technologies/training-design/` |
| 專業訓練領域知識 | `/tw/technologies/domain-expertise/` | `/en/technologies/domain-expertise/` | `/jp/technologies/domain-expertise/` |

以上為完成建置的站內路徑，並非已部署到正式網域的宣告。

## 修改檔案

| 檔案 | 用途 |
|---|---|
| `src/data/technologies-content.ts` | 繁中母版、完整英日翻譯、總覽、FAQ、CTA 與 SEO |
| `src/lib/technologies.ts` | 七項穩定 ID、三項公開頁、共用文章查詢、技術名稱與雙向連結 |
| `src/pages/[lang]/technologies/index.astro` | 三語總覽與七項技術簡介 |
| `src/pages/[lang]/technologies/[slug].astro` | 九個技術詳細頁及既有產品／解決方案關聯 |
| `src/components/TechnologySections.astro` | 共用編輯型內容、各技術版面差異 |
| `src/components/RelatedTechnologyArticles.astro` | 最新六篇同語相關技術文章，空列表不渲染 |
| `src/components/ArticleDetail.astro` | 既有技術文章反向連結 |
| `src/components/Footer.astro`、`src/layouts/BaseLayout.astro` | 技術頁選用隱藏缺少資料欄位；沿用既有 Footer 與 SEO |
| `src/content.config.ts`、`src/lib/emdash/loader.ts` | 接入 `technologyTags`／CMS `technology_tags`，兼容舊文章 |
| `seed/seed.json`、`emdash-env.d.ts` | 選填多選標籤的 CMS seed 與型別 |
| `scripts/cms/import-markdown.mjs` | 既有匯入流程保留技術標籤 |
| `scripts/cms/technology-tags.mjs` | 預設只讀、可重複執行的增量 schema 更新工具 |
| `src/pages/sitemap.xml.ts` | 加入完整三語總覽及九個詳細頁 |
| `tests/technologies.test.ts` | 標籤篩選、日期排序、語言狀態與雙向連結測試 |
| `tests/cms/technology-tags.mjs` | 真實本機 CMS → loader → 查詢 → 重建任務驗證 |
| `tests/fixtures/content/insights/tw/fixture-insight-1.md` | 將既有測試文章關聯 XR 與訓練設計 |
| `scripts/qa-technologies.mjs` | 建置 HTML、三語、響應式、FAQ、SEO 與文章關聯驗收及報表 |
| `package.json` | 增加 `qa:technologies` 入口；依賴與 lockfile 不變 |
| `tsconfig.json` | 排除 fixture／preview／QA 產物，避免建置後型別檢查誤掃輸出 |
| `README.md` | 技術模組文件入口 |
| `docs/TECHNOLOGIES.md`、`docs/TECHNOLOGIES-CONTENT-AUDIT.md` | 操作、限制、修改清單、三語完整性比對與實測結果 |

未改動既有 12 項產品正式內容、翻譯稽核文案或產品分類，未新增 MUM-T、NOVA 或 Counter-UAS 產品。
