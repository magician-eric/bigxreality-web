# Big x Reality 官網 2.0 — 第二階段技術規劃

> 狀態：**CMS 架構變更評估中（2026-10-19）**。原本的 Decap CMS＋GitHub 架構已被新決策取代，見 **§13**。§3.6、§11.1、§8 的 T27–T30（Decap）不再執行；其餘頁面、搜尋、測試規劃保留，工時已併入 §13.9。等新架構核准後才開始開發。
> 基準：`main` @ `df47220`（PR #1 合併後）。
> 範圍：Solutions、Resources、News、Insights、Case Studies、共用標籤、內容關聯、站內搜尋。
> 原則：能共用就共用；沿用第一階段的 Astro 7.3.8、Design Tokens、元件、三語架構、SEO 系統；不導入 Tailwind，不建第二套設計系統或第二套關聯系統。

---

## 0. 現況確認

### 0.1 第一階段實際完成的東西

| 項目 | 狀態 |
|---|---|
| 頁面 | `/[lang]/products/`、`/[lang]/products/{sut,uav,usv}/`（共 12 頁）＋ `/` → `/en/` |
| 內容 collection | `products`、`solutions`（只有卡片用的欄位）、`scenarios`、`pages`；`insights` / `news` / `case-studies` **只有 schema、沒有任何檔案** |
| 關聯 | `lib/content.ts`：`validateRelations()`（錯誤 slug 讓 build 失敗）、`integratedProducts()`（正反查合併）、`relatedArticles()`（文章 → 產品反查） |
| SEO | `SeoHead`：canonical、hreflang（只列實際存在的語言）、x-default、OG/Twitter、JSON-LD（Organization / BreadcrumbList / Product）；`sitemap.xml.ts` 排除待翻譯頁 |
| 測試 | `npm test`（5 個單元測試）、`qa:a11y`、`qa:behaviour`（27 項）、`qa:links`、`qa:lighthouse`、`qa:shots` |

### 0.2 Decap CMS 實際狀態

**尚未建立。** Repo 裡沒有 `public/admin/`、沒有 `config.yml`、沒有 OAuth 設定，也沒有 Decap 套件。
`grep` 只在 `docs/PLAN.md`、`README.md`、`content.config.ts` 的註解和需求文件裡找到「Decap」字樣。
第一階段做的只有「資料夾與欄位結構讓 Decap 之後能直接讀寫」（`<collection>/<lang>/<slug>.md`）。
**目前沒有任何可用的 CMS 後台**，所有內容都要直接改 Markdown 檔。

### 0.3 第一階段 PLAN §5 原定的其他項目

Cloudflare Pages、排程發布、Cookie 同意與 GA、301 轉址（含參數型 Pages Functions）、每月備份、CI 自動檢查——
**本次指令沒有列入**，建議移到第三階段（部署與上線）。Pagefind 和標籤頁在本次範圍內。
Decap 的處理方式見 §3.6，需要你決定（§9 D1）。

### 0.4 內容現況（最大的風險）

**目前沒有任何真實的 News、Insights、Case Studies。** 依「不虛構內容」原則，我不會寫範例文章。
如果沒有真實內容，這些列表頁上線時會是空的。處理方式：
- **測試**：用 `tests/fixtures/content/` 的測試內容（明顯標示 TEST FIXTURE、永遠不會進正式 build）驗證所有模板，見 §10。
- **正式 build**：列表為空時顯示空狀態訊息並 `noindex`，Resources Hub 隱藏空的區塊。
- **需要你提供**：至少幾篇真實文章，才能做最終視覺驗收（§9 資料清單）。

Solutions 詳細頁也只有第一階段那一句說明。舊 repo 的 `src/data/solutions-rich.ts` 有**官方英文原文**（Military、Police、Smart City，當時由業主提供）
和**官方繁中原文**（Police、Smart City）；日文是當時 Claude 翻譯的，**不能用**。是否沿用這些原文要你確認（§9 D6）。

---

## 1. 第一階段可重用元件盤點

| 元件／模組 | 現況 | 第二階段用法 | 需要的修改 |
|---|---|---|---|
| `BaseLayout` | 版型、字型、跳到主要內容、待翻譯橫幅 | 所有新頁 | 語言切換的退回頁目前寫死為產品總覽 → 改成參數 `fallbackPath`；加 `searchable` 參數控制 Pagefind 標記 |
| `SeoHead` | canonical、hreflang、OG、JSON-LD | 所有新頁 | `product` 參數泛化為 `structuredData`（加 Article / NewsArticle / CollectionPage）；文章加 `article:published_time` 等 OG 欄位 |
| `Header` | 五個主選單、語言、搜尋、手機選單 | 不變 | 「資源」改成可展開的子選單（§5.3） |
| `Footer` | 選單、聯絡資訊 | 不變 | 「資源」下列三個子項目連結 |
| `PageHero` | 深色 Hero、麵包屑、最多兩個按鈕 | Solutions 總覽與詳細頁、Resources、三個列表頁 | 無（圖片可省略的情況已支援） |
| `SectionHead` | 小標＋H2＋說明＋查看全部 | 所有區塊標題、相關內容區 | 無 |
| `CtaBand` | 深色 CTA | Solutions、文章頁結尾 | 無 |
| `CardProduct` | 產品卡 | Solution 頁「相關產品」 | 無 |
| `CardSolution` | 解決方案卡 | Solutions 總覽、文章頁「相關解決方案」 | 無 |
| `CardArticle` | 文章卡（≤767px 左圖右文） | 所有文章列表、相關文章 | 加 `headingLevel` 參數（列表頁用 h2）；標籤改為連到標籤頁 |
| `FilterBar` | 領域按鈕＋文字篩選，只對同一頁的 DOM 生效 | Case Studies 列表（依領域） | 選項改成參數（目前寫死領域）；**不能用在有分頁的列表**，原因見 §5.2 |
| `SectorTag` | 領域標籤 | 文章卡、案例頁 | 無 |
| `Breadcrumb`、`Text`、`ImagePlaceholder`、`FormButton`、`Logo` | — | 直接沿用 | 無 |
| `lib/content.ts` | `getLocalized`、`availableLangs`、`validateRelations`、`integratedProducts`、`relatedArticles` | 所有新頁的資料來源 | 擴充驗證範圍（標籤、文章互相關聯）；新增 `relatedToSolution()`、`relatedToArticle()`、`articlesByTag()`；**不另寫新系統** |
| `lib/pending.ts` | 區塊顯示規則 | 所有詳細頁 | `visibleProductSections` 泛化為依區塊設定運作的 `visibleSections()` |
| `sitemap.xml.ts` | 產品頁＋總覽 | 所有新頁 | 改成由各頁型登記的清單產生 |
| `i18n-coverage` | 三語檢查 | 自動涵蓋新 collection | 無 |
| 產品頁的區塊樣式（`.tiles`、`.steps`、`.spec`、`.prose`） | 寫在 `[slug].astro` 的 scoped style | Solutions 的 Challenges / Capabilities、文章正文 | 抽成共用元件 `TileGrid`、`Prose`，產品頁改用它們（外觀不變，有截圖比對） |

---

## 2. Sitemap 與路由表

### 2.1 新增路由（每個都有 `en` / `tw` / `jp` 三種）

| 路由 | 頁面 | 索引規則 |
|---|---|---|
| `/[lang]/solutions/` | Solutions 總覽 | 可索引 |
| `/[lang]/solutions/{military,police,fire-rescue,smart-city}/` | 領域詳細頁 | 可索引（待翻譯則 noindex） |
| `/[lang]/resources/` | Resources Hub | 三類都沒有內容時 noindex |
| `/[lang]/news/`、`/[lang]/news/page/[n]/` | 消息列表＋分頁 | 0 篇時 noindex |
| `/[lang]/news/[slug]/` | 消息內頁 | 可索引（待翻譯則 noindex） |
| `/[lang]/insights/`、`/[lang]/insights/page/[n]/` | 技術文章列表＋分頁 | 同上 |
| `/[lang]/insights/[slug]/` | 技術文章內頁 | 同上 |
| `/[lang]/case-studies/` | 案例列表（不分頁，見 §5.2） | 0 篇時 noindex |
| `/[lang]/case-studies/[slug]/` | 案例內頁 | 同上 |
| `/[lang]/tags/` | 標籤總覽 | 可索引 |
| `/[lang]/tags/[slug]/` | 標籤頁（三類文章合併） | **少於 3 篇時 noindex 且不進 sitemap**（業主決定） |
| `/[lang]/search/` | 搜尋 | **一律 noindex**、不進 sitemap、不進搜尋索引 |

- 分頁：每頁 12 篇；第 1 頁就是 `/news/`，不產生 `/news/page/1/`；每一頁的 canonical 指向自己。
- 某一語言沒有某篇文章時，該語言不產生那一頁（沿用第一階段做法）。

### 2.2 不在本階段（照樣是未建立頁面，連結檢查會列出）

首頁 `/[lang]/`、`/technologies/…`、`/company/…`、`/contact/`、`/privacy/`。

### 2.3 選單結構

```
Solutions ── 總覽、Military、Police、Fire & Disaster Response、Smart City   （第一層照舊連到總覽）
Products
Technologies
Resources ── 資源總覽、News、Insights、Case Studies                         （第一層改為可展開子選單）
Company
```

Solutions 是否也做子選單：建議**先不做**（總覽頁已經列出四個領域，選單越少越容易操作），見 §9 D3。

---

## 3. CMS Schema 擴充計畫

### 3.1 原則

- **只擴充 `src/content.config.ts`，不另建資料層**。關聯一律存 slug，由 `validateRelations()` 在 build 時驗證。
- 每個關聯**只存在一邊**，反向由程式查出（和第一階段 `integratedOps` 相同做法）。
- 結構欄位只讀 `tw` 檔（沿用 §2.1 規則）。

### 3.2 共用文章欄位（三種文章共用一個 `articleBase`）

| 欄位 | 型別 | 語言 | 說明 |
|---|---|---|---|
| `translationStatus` | enum | 各語言 | 既有 |
| `draft` | boolean | tw | 既有 |
| `publishDate` | date | tw | 既有；未來日期不輸出 |
| `updatedAt` | date，可省略 | tw | **新增**；JSON-LD `dateModified` |
| `title`、`summary` | string | 各語言 | 既有 |
| `cover` | `{ src, alt }`，可省略 | 圖 tw／alt 各語言 | 既有 |
| Markdown 正文 | — | 各語言 | **新增驗證**：正文不可為空（空白文章不輸出，build 列出警告） |
| `tags` | slug[] | tw | 既有；**改為驗證**必須存在於 `tags` collection |
| `relatedProducts` | slug[] | tw | 既有 |
| `relatedSolutions` | slug[] | tw | 既有；Solution 頁反查用 |
| `relatedNews`、`relatedInsights`、`relatedCaseStudies` | slug[]（三個陣列） | tw | **新增**（Related Articles）；分成三個欄位是為了配合 Decap relation widget（見 §3.6）；驗證目標存在；程式合併成一個清單，並合併正反兩個方向 |
| `seo` | `{ title?, description?, ogImage? }` | 文字各語言、圖 tw | **新增**（和產品相同結構，抽成共用 `seoFields`） |

### 3.3 各類型的專屬欄位（只加需求文件寫到的）

| Collection | 新增欄位 | 依據 |
|---|---|---|
| `news` | `category`: `company \| exhibition \| award \| product-launch \| partnership \| media`（必填）；`event?: { name, location?, startDate, endDate? }`（展覽用）；`source?: { name, url }`（媒體報導用） | requirements §15 News 類型 |
| `insights` | `author?: string`、`readingTime` 由正文自動計算（不存） | requirements §22「作者、日期、更新日期」 |
| `case-studies` | `client: { name, disclosure: public \| anonymized }`；`approval: { approved: boolean, date?, note? }`（**`approved: false` 不輸出**）；`challenge`、`solution`：段落文字；`outcomes?: { label, value, note? }[]`；`domains`（領域） | requirements §15 案例內容項目、「不得虛構客戶」、§16 公開授權 |

案例的「使用產品」就是 `relatedProducts`，不另設欄位；「使用技術」等 Technologies collection 建立後再加（本階段不做技術頁）。

### 3.4 Solutions 擴充（目前只有卡片欄位）

| 欄位 | 型別 | 語言 | 區塊 |
|---|---|---|---|
| `hero.eyebrow`、`hero.title`、`hero.description`、`hero.image?` | — | 各語言（圖 tw） | Hero |
| Markdown 正文 | — | 各語言 | Overview |
| `challenges?: { title, description }[]` | — | 各語言 | Challenges |
| `capabilities?: { title, description }[]` | — | 各語言 | Capabilities |
| `cta?: { title, description }` | — | 各語言 | CTA |
| `seo?` | 共用 `seoFields` | — | — |

**Related Products / Case Studies / Insights / News 不存在 Solution 檔裡**，全部由反查產生：
- 相關產品 ← `products.relatedSolutions`（第一階段已有）
- 相關文章 ← 三種文章的 `relatedSolutions`

所以不會出現「產品資料複製一份到解決方案」的情況。

### 3.5 新增 `tags` collection（後台固定清單）

`src/content/tags/<lang>/<slug>.md`：`translationStatus`、`name`、`description?`。
文章只能選既有標籤（Decap relation widget），build 驗證不存在的標籤會失敗。

### 3.6 與 Decap CMS 的整合（⚠️ 已被 §13 取代，不執行）

| 項目 | 規劃 |
|---|---|
| 設定檔 | `public/admin/config.yml`，`i18n.structure: multiple_folders`、`locales: [tw, en, jp]`、`default_locale: tw`；結構欄位 `i18n: duplicate`、文字欄位 `i18n: true` |
| 關聯欄位 | relation widget，`value_field: "{{slug}}"`；三種文章關聯各用一個 relation widget（Decap 一個 relation widget 只能指向一個 collection），所以 §3.2 的文章互相關聯分成 `relatedNews`、`relatedInsights`、`relatedCaseStudies` 三個欄位，程式端合併，仍是同一套驗證 |
| 單一資料來源 | Markdown 檔就是唯一來源；Decap 只是編輯介面，不另存資料 |
| 避免 schema 與後台不一致 | 新增測試：讀 `config.yml` 與 zod schema，比對欄位名稱、必填與選項值，不一致就失敗 |
| 本機測試 | `decap-server`（本機 proxy backend）讓編輯畫面能在本機實際存檔測試，不需要 GitHub 登入 |
| 正式登入 | GitHub backend＋Cloudflare Worker OAuth 代理（第一階段已決定）；需要 Cloudflare 帳號，建議放第三階段 |

**是否在第二階段建立 Decap**：見 §9 D1。

---

## 4. 頁面模板與元件重用表

| 頁面 | 結構 | 重用 | 新增 |
|---|---|---|---|
| Solutions 總覽 | PageHero → 四張解決方案卡 → CtaBand | `PageHero`、`CardSolution`、`CtaBand` | — |
| Solution 詳細頁 | PageHero → 頁內導覽 → Overview → Challenges → Capabilities → 相關產品 → 相關案例 → 相關技術文章 → 相關消息 → CTA | `PageHero`、`SectionHead`、`CardProduct`、`CardArticle`、`CtaBand`、頁內導覽 | `TileGrid`、`Prose`、`InPageNav`（從產品頁抽出） |
| Resources Hub | PageHero → 最新消息（3）→ 技術文章（3）→ 案例（3），每區「查看全部」→ 標籤列 | `PageHero`、`SectionHead`（viewAll）、`CardArticle` | `TagList` |
| News / Insights 列表 | PageHero（無圖）→ 分類／標籤連結 → 卡片網格 → 分頁 | `PageHero`、`CardArticle` | `Pagination`、`EmptyState` |
| Case Studies 列表 | PageHero → 領域篩選 → 卡片網格 | `PageHero`、`FilterBar`（參數化後）、`CardArticle` | — |
| 文章內頁（三種共用） | ArticleHeader（麵包屑、類型・日期、H1、摘要、封面）→ 專屬欄位區 → 正文 → 標籤 → 相關產品／解決方案／文章 → CtaBand | `Breadcrumb`、`SectionHead`、`CardProduct`、`CardSolution`、`CardArticle`、`CtaBand` | `ArticleLayout`、`ArticleHeader`、`CaseFacts`（案例：客戶、領域、使用產品、挑戰、方案、成果）、`NewsMeta`（展覽／媒體資訊） |
| 標籤總覽／標籤頁 | PageHero（無圖）→ 文章卡片 | `PageHero`、`CardArticle` | `TagList` |
| 搜尋 | PageHero（無圖）→ 搜尋框 → 類型篩選 → 結果 | `PageHero`、搜尋框樣式沿用 `FilterBar` | `SearchPage`（Pagefind API＋自繪結果，見 §5） |

**視覺一致性**：文章內頁的標題區用淺色背景（深色 Hero 留給 Solution 與列表頁），正文寬度 ≤ 6 欄（設計系統 P.11）。
每個區塊只有一個紅色焦點；文章頁的紅色按鈕只在結尾 CtaBand。新元件只用既有 tokens，不新增顏色或字級。

---

## 5. 搜尋與標籤的技術方案

### 5.1 搜尋方案比較

| 方案 | 優點 | 缺點 | 結論 |
|---|---|---|---|
| **Pagefind**（靜態索引） | build 後產生分段索引，只下載用到的片段；依 `<html lang>` 自動分語言索引；不需伺服器或付費服務；可用 `data-pagefind-filter` 做類型篩選 | 中文／日文斷詞品質要實測（§9 R1） | **建議採用** |
| 自建 JSON 索引＋前端比對（MiniSearch / Fuse） | 完全掌控 | 整份索引一次下載，內容越多越慢；中日文斷詞要自己處理；要自己維護 | 不建議 |
| Algolia 等託管服務 | 搜尋品質最好 | 月費、外部依賴、要同步資料、Cookie／隱私問題 | 不符合「不導入大型服務」 |

### 5.2 Pagefind 怎麼避免「不該被搜到的內容」

1. **只有明確標記的頁面進索引**：只在「已發布、非待翻譯、可索引」的詳細頁（產品、解決方案、三種文章）加 `data-pagefind-body`。Pagefind 只要有任何頁面用了這個屬性，就會忽略其他所有頁面——列表頁、標籤頁、搜尋頁、待翻譯頁自動排除。
2. **草稿與未來日期**本來就不會被 build 出來，所以不可能進索引。
3. **語言分離**：Pagefind 依 `<html lang>`（`en` / `zh-Hant-TW` / `ja-JP`）分成三份索引，搜尋頁只載入目前語言那一份。
4. **自動測試**：build 後直接用 Pagefind 的 Node API 查詢——待翻譯頁的獨有字串必須查不到、`/tw/` 搜尋結果不能出現 `/en/` 網址、索引頁數必須等於預期頁數。

搜尋結果頁用 Pagefind 的 JS API 自己畫結果（沿用 `CardArticle` 的樣式），**不用 Pagefind 內建 UI**，避免多一套視覺。
Pagefind 的 JS 只在 `/search/` 頁載入，不影響其他頁效能。

### 5.3 產品篩選元件能不能重用

`FilterBar` 是對「同一頁裡的卡片」做顯示／隱藏，所以：
- **可以用**：Case Studies 列表（不分頁、數量少）依領域篩選；Solution 頁不需要。
- **不能用**：有分頁的 News / Insights 列表——只能篩到目前這一頁，結果會是錯的。這兩個列表改用**標籤頁連結**（靜態頁）和**站內搜尋**。
- 要改的地方：選項從寫死的領域改成參數 `options`、網址參數名稱改成參數。產品總覽的行為不變（行為測試會驗證）。

### 5.4 標籤

- 標籤是固定清單（`tags` collection），只套用在三種文章上。
- `/[lang]/tags/[slug]/` 合併三種文章、依日期排序；少於 3 篇 → `noindex`、不進 sitemap、不進搜尋。
- 文章卡和文章頁的標籤都連到標籤頁；標籤沒有翻譯時顯示 `[待翻譯]`（沿用規則）。

### 5.5 Resources 子選單（鍵盤與無障礙）

採 **disclosure 導覽模式**（不是 ARIA `menu`，網站導覽不適合用 menu role）：
- 「資源」是 `<button aria-expanded aria-controls>`，Enter／Space 開合，Esc 關閉並把焦點回到按鈕，焦點移出子選單時自動關閉。
- 子選單第一項是「資源總覽」連結，所以不需要讓按鈕本身也當連結。
- 目前所在頁（資源總覽、三個列表、文章頁）時，「資源」顯示底線且子選單對應項目加 `aria-current`。
- 手機版：同一個按鈕在漢堡選單中展開成巢狀清單，沿用第一階段的焦點鎖定。
- 不靠 hover 開啟（觸控與鍵盤一致），沒有 JS 時子選單直接展開顯示。

---

## 6. SEO 與多語系處理

| 項目 | 做法 |
|---|---|
| canonical | 每頁指向自己；分頁頁指向自己的頁碼網址（不指向第 1 頁） |
| hreflang | 只列實際存在且已發布的語言版本；分頁頁只在該語言也有同一頁碼時才列；x-default 只在英文版存在時輸出（沿用 `SeoHead`） |
| 待翻譯 | `noindex`、不進 sitemap、不進 Pagefind、顯示「[待翻譯]」橫幅（沿用） |
| 空白內容 | 正文空白的文章不輸出並在 build 列出警告；0 篇的列表頁 `noindex` 並顯示空狀態 |
| 標籤頁 | 少於 3 篇 `noindex`、不進 sitemap |
| 搜尋頁 | 一律 `noindex`，不進 sitemap，`robots.txt` 不封鎖（讓搜尋引擎看到 noindex） |
| 結構化資料 | News → `NewsArticle`；Insights → `Article`（含作者）；Case Studies → `Article`；列表 → `CollectionPage`＋`ItemList`；全部加 `BreadcrumbList`；JSON-LD 不輸出任何 `[待提供]` |
| OG | 文章用封面裁成 1200×630；`og:type=article`、`article:published_time`、`article:modified_time`、`article:tag` |
| 語言切換 | 文章在目標語言不存在時，退回該語言的列表頁（不是產品總覽） |
| Sitemap | 每種頁型登記自己的網址與可索引規則，一處產生，測試比對「sitemap 裡的網址 = 可索引的頁面」 |

---

## 7. 預計新增／修改的檔案

**新增**

```
src/pages/[lang]/solutions/index.astro
src/pages/[lang]/solutions/[slug].astro
src/pages/[lang]/resources/index.astro
src/pages/[lang]/news/[...page].astro          列表＋分頁（Astro paginate）
src/pages/[lang]/news/[slug].astro
src/pages/[lang]/insights/[...page].astro
src/pages/[lang]/insights/[slug].astro
src/pages/[lang]/case-studies/index.astro
src/pages/[lang]/case-studies/[slug].astro
src/pages/[lang]/tags/index.astro
src/pages/[lang]/tags/[slug].astro
src/pages/[lang]/search/index.astro
src/layouts/ArticleLayout.astro
src/components/ArticleHeader.astro、CaseFacts.astro、NewsMeta.astro
src/components/TileGrid.astro、Prose.astro、InPageNav.astro（從產品頁抽出）
src/components/Pagination.astro、EmptyState.astro、TagList.astro、SearchResults.astro
src/content/tags/{tw,en,jp}/                    標籤清單（內容待提供）
src/content/pages/{tw,en,jp}/{solutions,resources,news,insights,case-studies,tags,search}.md   各列表頁文案
tests/fixtures/content/                          測試用內容（標示 TEST FIXTURE，不進正式 build）
tests/relations.test.ts、tests/sections.test.ts
scripts/qa-search.mjs                            Pagefind 索引檢查
scripts/check-sitemap.mjs                        sitemap 與可索引頁面比對
public/admin/index.html、public/admin/config.yml（若 §9 D1 決定本階段做）
tests/decap-config.test.ts（同上）
```

**修改**

```
src/content.config.ts          §3 的 schema 擴充
src/lib/content.ts             驗證擴充、反查函式
src/lib/pending.ts             visibleSections() 泛化（產品頁沿用）
src/components/SeoHead.astro   structuredData 泛化、文章 OG
src/components/Header.astro    Resources 子選單
src/components/Footer.astro    Resources 子連結
src/components/FilterBar.astro 選項參數化
src/components/CardArticle.astro  headingLevel、標籤連結
src/layouts/BaseLayout.astro   fallbackPath、searchable
src/pages/[lang]/products/[slug].astro  改用抽出的共用元件（外觀不變）
src/pages/sitemap.xml.ts       頁型登記
src/content/solutions/**       §3.4 新欄位（內容 [待提供] 或業主確認的原文）
src/content/ui/*.json          新增介面文字
scripts/qa-*.mjs               加入新頁面
package.json                   pagefind、postbuild 產生索引
docs/PLAN.md                   標示第一階段 §5 哪些項目移到第三階段
```

---

## 8. 工作拆分與預估時間（修訂版）

> ⚠️ CMS 架構變更後，本節的 T27–T30（Decap）取消，其餘任務的工時併入 §13.9 的新估算。

時數是開發與自我測試的時間，不含等待資料與審核。分類標記：

- 🆕 新增功能　♻️ 沿用既有元件（只組裝，不改元件）　🔧 修改既有元件
- 🗂 CMS 設定　🔍 搜尋　🧪 自動化測試　🔗 除錯與整合

### 8.1 任務與工時

| # | 任務 | 分類 | 工時 |
|---|---|---|---|
| **T0** | **Pagefind 三語技術驗證**（§12），回報後才繼續 | 🔍🧪 | 4 |
| **基礎** | | | |
| T1 | 測試資料隔離機制：`BXR_CONTENT=fixtures` 切換內容目錄、輸出到 `dist-fixtures/`、正式 build 防呆檢查（§11.5） | 🆕🧪 | 3 |
| T2 | 測試資料內容：三語、News ≥ 13 篇（測分頁）、Insights、Case Studies、標籤（≥3 篇與 <3 篇各一）、待翻譯／草稿／未來日期／未授權各一 | 🧪 | 3 |
| T3 | Schema 擴充（§3）：文章共用欄位、各類專屬欄位、Solutions、`tags` collection | 🔧 | 3 |
| T4 | 關聯驗證與反查擴充（`lib/content.ts`），不另建系統 | 🔧 | 3 |
| T5 | 單元測試：關聯驗證、反查、區塊顯示規則 | 🧪 | 2 |
| T6 | 共用設定：`site.json` 加 `listing.pageSize`（News / Insights 12、Case Studies 不分頁＝`null`） | 🆕 | 0.5 |
| **共用元件** | | | |
| T7 | 從產品頁抽出 `TileGrid`、`Prose`、`InPageNav`，產品頁改用 | 🔧 | 2 |
| T8 | 產品頁回歸：抽出前後截圖逐像素比對＋原 27 項行為測試 | 🧪 | 1 |
| T9 | `BaseLayout`：`fallbackPath`、`searchable` 參數 | 🔧 | 1 |
| T10 | `SeoHead`：`structuredData` 泛化、文章 OG | 🔧 | 2 |
| T11 | `CardArticle`：`headingLevel`、標籤連結 | 🔧 | 0.5 |
| T12 | `FilterBar`：選項與網址參數參數化（產品總覽行為不變） | 🔧 | 1 |
| T13 | `Header` Resources 子選單（disclosure，桌機＋手機＋鍵盤）、`Footer` 子連結 | 🔧 | 3.5 |
| **頁面** | | | |
| T14 | Solutions 內容匯入：舊站官方原文，逐欄標示來源與語言（§11.3） | 🆕 | 2 |
| T15 | Solutions 總覽（`PageHero`＋`CardSolution`＋`CtaBand`） | ♻️ | 1 |
| T16 | Solution 詳細頁（`PageHero`、`InPageNav`、`TileGrid`、`Prose`、`CardProduct`、`CardArticle`、`CtaBand`） | ♻️ | 2.5 |
| T17 | **`ArticleLayout`＋`ArticleHeader`（淺色 Hero）**：三種文章內頁共用一個版型 | 🆕 | 3 |
| T18 | `CaseFacts`（案例）、`NewsMeta`（展覽／媒體） | 🆕 | 2 |
| T19 | 三種文章內頁路由（都用 `ArticleLayout`） | ♻️ | 1.5 |
| T20 | **`ArticleListPage`＋`Pagination`＋`EmptyState`**：所有列表頁共用一個元件，篇數讀 T6 設定 | 🆕 | 3 |
| T21 | News / Insights / Case Studies 列表路由（都用 `ArticleListPage`；Case Studies 用同一個分頁路由，設定為不分頁） | ♻️ | 1 |
| T22 | Resources Hub（`PageHero`、`SectionHead`、`CardArticle`）＋`TagList` | ♻️🆕 | 2 |
| T23 | 標籤總覽與標籤頁（`ArticleListPage`）、<3 篇 noindex | ♻️ | 2 |
| T24 | Sitemap 改為頁型登記 | 🔧 | 1.5 |
| **搜尋** | | | |
| T25 | Pagefind 接入 build：自訂索引 integration＋雙字詞編碼（§12.4） | 🔍 | 3 |
| T26 | 搜尋頁：Pagefind JS API＋自繪結果（沿用卡片樣式）、類型篩選、只載入目前語言 | 🔍🆕 | 3.5 |
| **CMS** | | | |
| T27 | `public/admin/config.yml`：products、solutions、scenarios、pages、news、insights、case-studies、tags；三語、relation、media | 🗂 | 4 |
| T28 | 本機 `decap-server` 設定與操作說明 | 🗂 | 1 |
| T29 | 後台設定與 zod schema 一致性測試 | 🗂🧪 | 2 |
| T30 | 後台 E2E 測試（Playwright 操作 `/admin/`，§11.1 的每一項） | 🗂🧪 | 5 |
| **測試與整合** | | | |
| T31 | `qa:search`：索引隔離、待翻譯／列表／測試資料不進索引 | 🔍🧪 | 2 |
| T32 | `check:sitemap`：sitemap ＝可索引頁面 | 🧪 | 1 |
| T33 | `qa:behaviour` 擴充（子選單、分頁、語言退回、標籤 noindex、篩選、反查） | 🧪 | 3 |
| T34 | `qa:a11y`、`qa:shots`、Lighthouse 涵蓋所有新頁型 | 🧪 | 2.5 |
| T35 | 最小 CI（GitHub Actions）＋部署環境相容性（§11.2） | 🔗🧪 | 3 |
| T36 | 除錯與整合（跨頁問題、三語邊界情況、修正測試發現的問題） | 🔗 | 6 |
| T37 | 文件（README、PLAN 更新、後台操作說明） | 🔗 | 1 |
| | **合計** | | **約 87 h** |

### 8.2 分類小計

| 分類 | 工時 | 說明 |
|---|---|---|
| 🆕 新增功能 | 約 18 | `ArticleLayout`、`ArticleListPage`、`CaseFacts`、`NewsMeta`、搜尋頁、測試資料機制、Solutions 內容匯入 |
| ♻️ 沿用既有元件 | 約 9 | 頁面只組裝既有元件，不重寫 |
| 🔧 修改既有元件 | 約 18 | 都是加參數或抽出，原本的頁面行為不變 |
| 🗂 CMS 設定 | 12 | 含 E2E |
| 🔍 搜尋 | 約 12.5 | 含技術驗證 |
| 🧪 自動化測試 | 約 32 | 含與其他分類重疊的測試任務 |
| 🔗 除錯與整合 | 10 | 含 CI 與部署相容性 |

（分類有重疊，小計加總會大於合計。）

### 8.3 為什麼比原估 53～59 小時多

| 增加項目 | 原因 | 增加 |
|---|---|---|
| CMS 由「設定＋一致性測試」擴大成 E2E 驗證五種內容的新增、編輯、圖片、三語、關聯、發布狀態 | §11.1 決策 | +6 |
| 隔離的測試資料（目錄切換、獨立輸出、防呆檢查、資料本身） | §11.5 決策 | +6 |
| CI 與部署環境相容性提前到第二階段 | §11.2 決策 | +3 |
| 除錯與整合原本含在 QA 裡，現在單獨列出 | §11.7 要求分開標示 | +6 |
| Pagefind 驗證加入日文假名、英文部分字詞、跨語言隔離 | §11.6 決策 | +1 |
| Solutions 原文逐欄標示來源、語言、待確認 | §11.3 決策 | +2 |
| 其他拆細後的差異（共用設定、Footer） | — | +2.5 |
| 搜尋自訂索引（T0 驗證後追加，§12.4） | Pagefind 原生中文斷詞不穩定 | +1.5 |

### 8.4 共用原則（避免每頁重做一套）

- **所有文章內頁**只用 `ArticleLayout`；三種文章的差異只在 `CaseFacts` / `NewsMeta` 兩個插槽元件。
- **所有列表頁**（News、Insights、Case Studies、標籤頁）只用 `ArticleListPage`；差異只有資料來源、篇數設定、篩選選項。
- **詳細頁的區塊**（Solution、產品、文章）共用 `TileGrid`、`Prose`、`InPageNav`、`SectionHead`、卡片元件。
- 不新增任何顏色、字級或間距數值；全部用既有 tokens。

### 8.5 執行順序

T0（回報）→ T1–T6 → T7–T13 → T14–T24 → T25–T26 → T27–T30 → T31–T37。
每完成一組會跑完整測試；第一階段的測試一直保持通過。

## 9. 風險、待提供資料與待決策事項

### 9.1 技術風險

| # | 風險 | 影響 | 處理 |
|---|---|---|---|
| R1 | Pagefind 對中文／日文的斷詞品質無法從這個環境查證（官網連不到） | 搜尋可能找不到兩字詞 | W0 實測；不夠好時改評估「Pagefind＋字元 n-gram 前處理」或其他方案，先回報再決定 |
| R2 | 沒有真實文章 | 列表頁上線時是空的，視覺驗收無法完成 | 測試內容驗證模板；正式頁顯示空狀態＋noindex；請業主提供內容 |
| R3 | 抽出共用元件可能改到產品頁外觀 | 第一階段回歸 | 抽出前後截圖逐像素比對＋原有 27 項行為測試 |
| R4 | Decap 設定與 zod schema 不同步 | 後台存出來的檔案 build 失敗 | 一致性測試（W11） |
| R5 | 四個 Solution 頁大部分欄位是 `[待提供]` | 頁面很空 | 區塊規則照舊（沒填不顯示）；可先沿用舊站官方原文（D6） |
| R6 | 案例需要客戶公開授權 | 不能上線未授權案例 | `approval.approved` 必須為 true 才輸出 |

### 9.2 待提供資料

- 真實的 News、Insights、Case Studies（建議各至少 3 篇，才能驗證分頁與標籤 noindex 規則），含封面照片、日期、標籤。
- 案例：客戶名稱或匿名方式、公開授權、經確認的成果數據。
- 標籤清單（中文名稱與 slug）。
- 四個領域的 Hero 文案、Overview、Challenges、Capabilities、主圖。
- 各列表頁的標題與說明文字（Resources、News、Insights、Case Studies、Tags、Search）。
- 第一階段尚未補的 `[待提供]` 項目（表單網址、聯絡資訊等）仍然有效。

### 9.3 待決策事項

> D1、D2、D4–D7 已於 2026-10-19 決定，見 §11。D3、D8 照建議執行。

| # | 問題 | 建議 |
|---|---|---|
| D1 | Decap CMS 是否在第二階段建立？ | 建議做 W11（`config.yml`＋本機測試＋一致性測試），正式登入（OAuth Worker）放第三階段 |
| D2 | 第一階段 §5 的部署項目（Cloudflare、GA、301、備份、CI）移到第三階段？ | 是 |
| D3 | Solutions 要不要也做子選單？ | 先不做，總覽頁已列出四個領域 |
| D4 | News / Insights 每頁篇數 | 12 篇 |
| D5 | Case Studies 列表要不要分頁？ | 先不分頁（案例數量少），超過 24 篇再加 |
| D6 | 是否沿用舊站官方原文（英文 Military / Police / Smart City、繁中 Police / Smart City）當 Solution 內容？ | 建議沿用，但需要你確認原文仍有效；日文不沿用（當時是 AI 翻譯） |
| D7 | 文章內頁的標題區用淺色背景（深色只留給 Solution 與列表頁 Hero）？ | 是，維持深淺交錯，也讓文章閱讀更舒適 |
| D8 | 搜尋結果要不要包含 Solutions 和 Products 以外的固定頁（例如之後的公司介紹）？ | 本階段只含指定的五種；固定頁等建立時再加 |

---

## 10. 驗收標準與自動化測試

### 10.1 驗收標準

1. `npm run build` 0 錯誤；正式內容與測試內容兩種 build 都通過。
2. 第一階段頁面（產品總覽、SUT / UAV / USV）外觀與行為不變：截圖比對＋原有 27 項行為測試全數通過。
3. 所有新頁三語路由正確；hreflang 只指向實際存在的版本；canonical 指向自己。
4. 待翻譯、草稿、未來日期、未授權案例、正文空白的內容：不出現在列表、sitemap、搜尋索引，也不被搜尋引擎索引。
5. axe（WCAG 2.1 AA）：所有新頁型在 1440 / 390 寬度 serious / critical 為 0；Resources 子選單鍵盤操作通過。
6. Lighthouse（`/tw/solutions/military/`、一篇文章、搜尋頁）四項 ≥ 90；低於 90 要說明原因。
7. 連結檢查：除了 §2.2 的未建立頁面以外，0 個壞連結。
8. MUM-T、Counter-UAS 沒有產品頁、不出現在產品列表與搜尋的「產品」類型中。

### 10.2 自動化測試（新增）

| 測試 | 檢查內容 |
|---|---|
| `tests/relations.test.ts` | 每種關聯的錯誤 slug 都讓驗證失敗；正反查合併結果正確；文章互相關聯不重複、不含自己 |
| `tests/sections.test.ts` | Solution 與文章頁的區塊顯示規則 |
| `qa:behaviour` 擴充 | Resources 子選單（Enter / Esc / 焦點）、分頁連結、語言切換退回列表頁、標籤頁 noindex 門檻、案例領域篩選、Solution 頁反查出 SUT/UAV/USV |
| `qa:search`（新） | 各語言索引分離；待翻譯／列表／搜尋頁不在索引；已知字串可查到；索引頁數 = 預期 |
| `check:sitemap`（新） | sitemap 網址 = 可索引頁面集合；沒有 noindex 頁；沒有重複 canonical |
| `qa:a11y` 擴充 | 每種新頁型 × 1440 / 390 |
| `qa:shots` 擴充 | 每種新頁型截圖；產品頁回歸比對 |
| `qa:links` | 照舊，更新「未建立頁面」清單 |
| `tests/decap-config.test.ts`（D1） | `config.yml` 欄位與 zod schema 一致 |

---

## 11. 審核決策（2026-10-19）

### 11.1 Decap CMS（⚠️ 已被 §13 取代，不執行）
本階段建立 `config.yml` 並完成**本機測試**。E2E 測試要驗證 Products、Solutions、News、Insights、Case Studies 各自的：
新增、編輯、圖片上傳（寫入正確的 media 資料夾、Markdown 路徑可被 Astro 讀取）、三語內容（tw / en / jp 三個檔案）、關聯欄位（只能選既有 slug）、發布狀態（`draft`、`publishDate`、`translationStatus`）。
每個 E2E 案例最後都跑一次 build，確認後台存出來的檔案能通過 schema 與關聯驗證。測試結束後還原所有檔案。
正式 GitHub 登入（Cloudflare Worker OAuth 代理）放第三階段。

### 11.2 部署環境與 CI
**目前沒有任何 CI**（沒有 `.github/workflows/`），也沒有鎖定 Node 版本的檔案。第二階段補上：
- `.node-version`（`22`）：Cloudflare Pages 與本機、CI 用同一個 Node 主版本。
- 最小 CI（GitHub Actions，每個 PR 與 push 到 `main`）：`npm ci` → `npm run build` → `npm test` → `check:sitemap` → `qa:links` → `qa:search` → `qa:behaviour` → `qa:a11y`。Lighthouse 與截圖仍手動跑（結果不穩定，不適合當 CI 關卡）。
- 部署相容性檢查：在乾淨環境用 `npm ci && npm run build` 驗證；確認 build 不依賴開發機才有的東西（例如 `/opt/pw-browsers` 只用在 QA，不用在 build）；確認輸出是純靜態檔，`/` 轉址在沒有伺服器設定時也能運作；Pagefind 二進位檔在 Linux x64 可執行。
- Cloudflare 正式部署、GA、301、正式備份放第三階段。

### 11.3 Solutions 內容來源
沿用舊 repo `src/data/solutions-rich.ts` 中業主當時提供的官方原文：

| 領域 | 英文 | 繁中 | 日文 |
|---|---|---|---|
| Military | 官方原文 | `[待提供]` | `[待翻譯]` |
| Police | 官方原文 | 官方原文 | `[待翻譯]` |
| Fire & Disaster Response | `[待提供]`（舊站沒有此頁） | `[待提供]` | `[待翻譯]` |
| Smart City | 官方原文 | 官方原文 | `[待翻譯]` |

- 每個 Markdown 檔的 frontmatter 加 `source` 註記（來源檔、提供日期、語言），頁面不顯示。
- 舊站原文寫於改版前，內容（例如提到的產品名稱）要請你重新確認；會在 PR 列出每一段需要確認的句子。
- **不使用舊 repo 的日文**（當時是 AI 翻譯，未經審核）。
- 舊站原文的段落結構和新模板（Overview / Challenges / Capabilities）不完全對應時，只放進意思明確對應的欄位，其餘保留 `[待提供]`，不改寫原文。

### 11.4 Resources
- News、Insights 每頁 12 篇，寫在 `site.json` 的 `listing.pageSize`，可調整。
- Case Studies 初期不分頁，但和其他列表用**同一個分頁路由與元件**，只要把設定改成數字就會開始分頁。
- 文章詳細頁採淺色 Hero（`ArticleHeader`）。

### 11.5 測試資料隔離
- 位置：`tests/fixtures/content/`，結構和 `src/content/` 相同；每個檔案標題前綴 `TEST FIXTURE`。
- 只有設定 `BXR_CONTENT=fixtures` 時才會使用，輸出到 `dist-fixtures/`，永遠不寫進 `dist/`。
- 防呆：正式 build 結束時檢查 `dist/`（含 sitemap 與 Pagefind 索引）不得出現 `TEST FIXTURE` 字樣或測試資料的 slug，出現就讓 build 失敗。
- 測試資料 build 的每一頁都加 `noindex`，`robots.txt` 改為全部禁止，避免被誤部署時被索引。

### 11.6 Pagefind 技術驗證
見 §12。品質不符時先回報測試結果與替代方案，不自行導入大型搜尋服務。

### 11.7 工時拆分
見 §8（修訂版）。

---

## 12. Pagefind 技術驗證結果（T0，2026-10-19）

### 12.1 測試方式

- Pagefind 1.5.2，Chromium 實際執行 Pagefind 的搜尋程式（和正式網站相同的執行方式）。
- 隔離的測試網站：三語 × 4 篇可索引頁（SUT、UAV、USV、MUM-T），另有列表頁、待翻譯頁、搜尋頁（都不應被搜到）。
  繁中文字取自第一階段正式內容；英文、日文是只供測試的句子。
- 44 個測試案例，涵蓋：中文 2～5 字連續詞與跨詞片段、英文完整字與前綴、日文漢字／片假名／平假名、代號（SUT、MUM-T、CQB）、跨語言隔離、不應被索引的頁面。
- 重現腳本：`docs/spikes/pagefind/`。

### 12.2 結果

| | Pagefind 原生斷詞 | 雙字詞＋ASCII 編碼（方案） |
|---|---|---|
| 繁中 | **15/20**：「訓練」（四頁都有）只找到 1 頁；「戰術訓練」0 頁；「訓練系統」只找到 1／3 頁；「無人機」漏掉 MUM-T 頁；「部隊戰」多出不含此詞的頁 | **20/20** |
| 英文 | 10/10（完整字、前綴都正常；字中片段如 `ctical` 找不到，屬正常行為） | 10/10 |
| 日文 | 13/14（漢字、片假名、平假名、活用形都正常） | 14/14 |
| 跨語言隔離 | 正常：搜尋結果只會出現目前語言的網址 | 正常 |
| 不應被搜到的頁面 | 正常：列表頁、待翻譯頁、選單文字都查不到 | 正常 |
| **合計** | **38/44** | **44/44** |

### 12.3 原因

- 和 `<html lang>` 的寫法無關（`zh-Hant-TW`、`zh-TW`、`zh`、`zh-Hans` 結果相同）。
- 只有兩頁時一切正常；加入第三頁（USV 或 MUM-T）後，SUT 頁就搜不到「訓練」。
  同一個詞在某頁能不能被找到，會受索引裡其他頁面影響，**結果不穩定**，內容越多越可能出問題。
- 即使改成我們自己先切好詞再交給 Pagefind，只要詞是中日文字元，問題依舊；改成純英文字母後就完全消失。
  判斷是 Pagefind 處理非拉丁文字詞時的索引問題，不是內容或設定錯誤。
- 另一個規則（不是錯誤）：多詞查詢中「完全找不到的詞」會被忽略。例如日文頁搜「無人機」，日文內容沒有「人機」，就只用「無人」找。英文查詢也是同樣規則。

### 12.4 建議方案：Pagefind＋自訂索引（仍是純靜態、不需外部服務）

1. **build 後**由一個小 integration 讀取 `dist/` 中標記為可索引的頁面（已發布、非待翻譯、非測試資料），
   用 Pagefind 的 Node API `addCustomRecord()` 建索引，而不是讓 Pagefind 自己掃 HTML。
2. 繁中、日文的文字切成**重疊雙字詞**（「戰術訓練」→ 戰術、術訓、訓練），每個雙字詞**編碼成固定長度的英文字母**後再交給 Pagefind；英文照原文。
3. 搜尋頁對查詢字串做**同一個函式**的處理後再查詢。索引與查詢共用 `tokenize()`，有單元測試。
4. 語言代碼用小寫（`zh-hant-tw`、`ja-jp`），和 Pagefind 搜尋端的比對方式一致（驗證中發現大寫會讓中日文頁誤用英文索引）。
5. 結果顯示用索引時存入的 `title`、`summary`、類型、日期（meta），**不用 Pagefind 自動產生的摘要**（編碼後的內容不能當摘要）。這和原本「自繪結果、不用內建 UI」的計畫一致。
6. 類型篩選（產品／解決方案／消息／技術文章／案例）用 `addCustomRecord` 的 `filters`。

| 項目 | 影響 |
|---|---|
| 搜尋品質 | 繁中、日文改成「包含這段文字」的比對，2 字以上的任何連續片段都找得到 |
| 效能 | 搜尋頁才載入 Pagefind（`pagefind.js` 約 45 KB＋索引片段）；其他頁面不受影響。測試網站 12 頁的索引只有 16 KB |
| 摘要高亮 | 中日文沒有關鍵字高亮（用文章摘要取代） |
| 維護 | 多一個約 30 行的斷詞函式與一個 build integration；Pagefind 升級後可用 `docs/spikes/pagefind/run-native.mjs` 重測，若原生問題已修正可以拿掉編碼 |
| 工時 | T25 由 1.5 h 增為 3 h（+1.5 h），合計約 87 h |

### 12.5 其他方案（不建議，僅供比較）

| 方案 | 說明 | 不建議的原因 |
|---|---|---|
| 維持 Pagefind 原生斷詞 | 不用額外程式 | 繁中結果不穩定，內容越多越嚴重 |
| MiniSearch＋同一個雙字詞斷詞，每種語言一份 JSON 索引 | 程式庫約 7 KB，完全自己掌控 | 整份索引一次下載，內容增加後搜尋頁變慢；要自己處理分段載入。若 Pagefind 方案未來出問題，這是備案 |
| Algolia 等託管服務 | 品質最好 | 月費、外部依賴、資料同步；不符合「不導入大型服務」 |

**請確認是否採用 §12.4 方案。確認後才開始 T1 以後的實作。**

---

## 13. CMS 架構變更：Cloudflare 管內容（2026-10-19，待核准）

> 新決策：GitHub 只管程式碼；文章、產品、解決方案、案例、標籤、三語內容與媒體都存在 Cloudflare；
> 五位編輯不需要 GitHub 帳號，透過後台登入編輯、審核、發布；改內容不需要 commit、PR 或人工部署；初期目標每月 US$0。
> 本節只做評估與規劃：**沒有修改程式、沒有建立 D1／R2、沒有部署、沒有啟用付費、沒有動 DNS、沒有刪除 Markdown。**

### 13.1 結論先講

**建議：方案 A —— EmDash（Cloudflare 官方的開源 CMS，以 Astro 為基礎）＋「混合式」輸出。**

- 公開頁面維持**靜態建置**（和第一階段一樣），由 Cloudflare 的靜態檔服務直接回應——不吃 Worker 請求額度，造訪量再大也是 $0。
- 後台（`/_emdash/admin`）、內容 API、草稿預覽是**同一個 Astro 專案裡的動態路由**，跑在 Worker 上，只有編輯人員會用到。
- 編輯按「發布」或排程時間到了 → 自動觸發 Cloudflare 重新建置（約 3～5 分鐘後上線）→ 頁面、Sitemap、hreflang、搜尋索引一起更新。
- 第一階段的元件、路由、SEO、Zod schema、關聯驗證**全部保留**；主要改的是「內容從哪裡讀」（Markdown 檔 → D1）。

**但有兩件事必須先驗證或取得核准**，見 §13.11：
1. EmDash 在 **Workers 免費方案**（每次請求 CPU 上限 10 ms）能不能穩定運作——第三方資料說法互相矛盾，必須實測。不行的話需要 Workers Paid（**US$5／月**）。
2. **R2 啟用時 Cloudflare 會要求綁定付款方式**（免費額度內不收費，但超過會自動計費）。這需要你核准。

### 13.2 三個方案比較

| | **A. EmDash（建議）** | B. 自建輕量 CMS（Workers＋D1＋R2） | C. 外部 SaaS Headless CMS（Sanity、Storyblok、Contentful 等） |
|---|---|---|---|
| 是什麼 | Cloudflare 官方開源（MIT）CMS，Astro integration；npm `emdash` 1.3.1（2026-10-18），1.0 於 2026-04-27 發布 | 自己寫後台介面、API、權限、版本、排程 | 內容存在廠商雲端，網站 build 時抓 |
| 內容存放 | D1＋R2（自己的 Cloudflare 帳號） | D1＋R2 | **廠商雲端**（違反「內容存在 Cloudflare」原則） |
| 第二階段總工時 | **約 148 h**（§13.9） | 約 220 h | 約 110 h |
| 固定費用 | $0（若免費方案 CPU 不夠：$5／月） | $0 | 免費方案常限制角色、審核流程、版本保留天數；需要時月費 US$15～100+ |
| 五位編輯權限 | 內建角色：admin／editor／author／contributor；登入可接 **Cloudflare Access** 或 passkey | 要自己做 | 廠商提供，免費方案常限使用人數或角色 |
| 三語編輯 | 內建 i18n（每語言一筆、互相連結）、hreflang 模組 | 要自己做 | 多數支援 |
| 圖片／PDF | 媒體庫（R2）、簽名網址上傳、焦點裁切 | 要自己做 | 廠商 CDN |
| 草稿／審核／排程 | 內建：草稿、審核（approvals）、排程發布、預覽 | 要自己做 | 多數支援，排程常需付費 |
| 版本與還原 | 內建 revisions、稽核紀錄（audit）、匯出／匯入 | 要自己做 | 付費方案較完整 |
| 備份 | D1 Time Travel（免費 7 天）＋ `wrangler d1 export`＋R2 同步 | 同左 | 依廠商；資料不在自己手上 |
| 安全性 | Access 擋在後台前；後台程式由 Cloudflare 團隊維護、開源可審 | 安全責任全在我們 | 廠商負責，但多一個外部依賴 |
| 未來擴充 | 外掛系統、表單、留言、重新導向、全文搜尋都有 | 每項都要自己寫 | 依廠商功能 |
| 對第一階段影響 | 中：換內容來源與圖片來源，元件與頁面不變 | 中：同左 | 中：同左 |
| 主要風險 | 專案只有半年歷史；資料模型偏 WordPress；免費方案 CPU 限制未確認 | 開發與長期維護成本最高；權限、版本等容易出安全問題 | 違反新原則；廠商鎖定與漲價 |

**不選 B 的原因**：本專案需要的權限、三語、審核、排程、版本、媒體庫、稽核紀錄，EmDash 都已經有，自己寫要多約 70 小時，之後所有維護與安全修補也都要自己負責。
**不選 C 的原因**：內容不在自己的 Cloudflare 帳號，和這次的決策直接衝突。

**也評估過但排除**：Payload CMS（官方 Cloudflare 範本明確要求 Workers Paid，且以 Next.js 為主，和 Astro 不同框架）；SonicJS（v3 仍是 beta）；Keystatic／TinaCMS／Decap（都以 Git 儲存內容，違反新原則）。

### 13.3 靜態、SSR、混合式比較

| | 全靜態（現況） | 全 SSR（每個頁面由 Worker 即時產生） | **混合式（建議）** |
|---|---|---|---|
| 公開頁面 | 靜態檔 | 每次造訪都跑 Worker＋查 D1 | 靜態檔 |
| 內容更新 | 要重新 build（目前要 commit） | 立即 | 自動重新 build，約 3～5 分鐘 |
| 速度（LCP） | 最快 | 每頁多一次 Worker 執行與資料庫查詢 | 最快 |
| 費用 | $0 | 大型情境每月約 150 萬次 Worker 請求，尖峰日會超過免費的 10 萬次／日 → 需 $5／月；免費方案每次 10 ms CPU 對 SSR 很吃緊 | $0（只有編輯操作用到 Worker） |
| 搜尋／Sitemap | build 時產生 | 要另外設計即時更新 | build 時產生，永遠同步 |
| 維護 | 簡單 | 要處理快取、失效、錯誤頁 | 簡單；多一個 build 觸發機制 |

### 13.4 回答你的七個問題

1. **Astro 還適合靜態架構嗎？** 適合。公開頁面維持靜態輸出；只把後台、API、預覽設為動態路由（Astro 的 on-demand route＋`@astrojs/cloudflare` adapter）。用 Workers 靜態檔的 `run_worker_first` 只讓 `/_emdash/*`、`/preview/*` 和舊站參數型網址進 Worker，其他請求直接由靜態檔回應。
2. **D1 內容怎麼給 Astro 頁面？** build 時先把 D1 匯出成 SQLite 檔（`wrangler d1 export`），再由**自訂的 Content Layer loader** 讀取已發布的內容交給 Astro Content Collections。頁面程式和現在一樣用 `getCollection()`，不需要知道內容來自 D1。（另一個做法是 build 時直接連遠端 D1；哪個較穩定是技術驗證項目。）
3. **編輯發布後網站怎麼更新？** 發布或排程觸發一個 Worker 動作：標記「需要重建」。一個每 5 分鐘執行的 Cron Trigger 檢查標記與到期的排程內容，有需要才呼叫 Cloudflare 的 deploy hook 重新建置。短時間內多次發布會合併成一次 build。
4. **需要 Cloudflare 重新建置嗎？** 需要，但全自動，不經過 GitHub。預估每月約 150 次 build × 約 4 分鐘＝ 600 分鐘，在 Workers Builds 免費的 3,000 分鐘／月內。
5. **能只更新異動內容嗎？** Astro 靜態建置不支援只重建單頁。全站約 500～1,000 頁，build 只要幾分鐘，現階段不值得為此增加複雜度；圖片轉檔用 build 快取避免每次重做。未來若 build 超過 10 分鐘，可把 News 等頻繁更新的頁面改為動態＋快取（屆時另提方案）。
6. **Zod schema 與關聯驗證怎麼延續？** 完全保留。`content.config.ts` 的 schema 照用，只把 `glob()` loader 換成 D1 loader；`validateRelations()` 照常在 build 時檢查，關聯錯誤會讓 build 失敗並保留目前的網站版本（不會發布壞掉的網站）。後台另外用 EmDash 的必填、reference 欄位擋住大部分錯誤，Zod 是最後一道關卡。關聯仍然**只存一邊**，反向由程式查出。
7. **搜尋、Sitemap、SEO 怎麼同步？** 它們都在同一次 build 產生（Pagefind 索引、`sitemap.xml`、每頁 meta 與 hreflang），所以一定一致。待翻譯、草稿、未來日期的內容不會被 build 出來，也就不會進索引。

### 13.5 第一階段哪些保留、哪些要改

| 項目 | 處理 |
|---|---|
| 元件、版型、Design Tokens、Logo、CIS | **保留，不改** |
| 三語路由、hreflang、canonical、Sitemap、SEO 元件 | **保留** |
| `content.config.ts` 的 Zod schema、`lib/content.ts` 關聯驗證與反查 | **保留**；loader 換成 D1 |
| 產品頁、產品總覽頁 | **保留**；只改資料來源與圖片來源（R2 遠端圖片＋Astro 圖片轉檔） |
| Markdown 正文 | EmDash 正文是 Portable Text（結構化富文字）→ 新增一個渲染元件；第一階段的 `[待提供]` 標記規則照用 |
| `src/content/**/*.md` | **不刪除**。內容匯入 D1 後，正式資料來源改為 D1；Markdown 移到 `tests/fixtures/content/` 當測試資料（需要你另外核准這一步） |
| `src/data/site.json`、`src/content/ui/*.json` | 站點設定移到 CMS 的 Site Settings；介面文字（按鈕、選單）屬於程式的一部分，**建議留在 GitHub** |
| Astro 輸出模式 | `static` → 加 adapter 的混合式（公開頁面仍全部預先產生） |
| 部署 | Cloudflare Workers（含靜態檔）＋ Workers Builds 自動建置 |
| 新增套件 | `emdash`、`@emdash-cms/cloudflare`、`@astrojs/cloudflare`、`@astrojs/react`、React——**只在後台路由載入**，公開頁面不會多任何 JS |

### 13.6 CMS 必要功能對照（EmDash）

| 需求 | EmDash 是否內建 | 需要我們做的 |
|---|---|---|
| Products、Solutions、News、Insights、Case Studies、Tags、Site Settings、SEO 欄位 | 自訂 collection＋欄位（文字、數字、選單、重複欄位、reference、圖片、檔案、日期） | 依 §3 的 schema 建立 collection |
| 三語、各語言獨立編輯 | 內建 i18n（每語言一筆，互相連結） | 設定 `en`／`tw`／`jp`（`tw` 對應 `zh-Hant-TW`） |
| 翻譯完成狀態、未完成不得索引 | 未內建這個欄位 | 加 `translationStatus` 欄位；build 時沿用第一階段的 noindex／sitemap 排除規則 |
| 新增、編輯、刪除、草稿 | 內建（刪除先進垃圾桶） | — |
| 預覽 | 內建預覽機制 | 預覽路由改用**我們自己的頁面模板**呈現 |
| 審核與發布 | 內建 approvals＋角色 | 設定：contributor 只能送審，editor 才能發布 |
| 排程發布 | 內建 scheduled publish | 接上「觸發重新建置」 |
| 版本紀錄與還原 | 內建 revisions | — |
| 圖片上傳 | 媒體庫（R2，簽名網址上傳） | 設定公開媒體網域、圖片尺寸規則 |
| 權限控管 | 內建角色；登入可接 Cloudflare Access | Access 原則（只允許指定 Email）＋角色對應 |
| 關聯驗證 | reference 欄位只能選既有內容 | build 時 `validateRelations()` 再驗證一次 |

### 13.7 Cloudflare 免費額度（官方文件，2026-10 查詢）

| 服務 | 免費方案 | 超過後 |
|---|---|---|
| **Workers** | 每日 10 萬次請求（UTC 0 點重置），每次請求 CPU 10 ms；Worker 大小上限 64 MiB（舊的 3 MB 限制已取消） | 免費方案超過額度回傳錯誤（不會計費）。Workers Paid：**US$5／月**起，含每月 1,000 萬次請求、3,000 萬 CPU 毫秒，超過每百萬次 $0.30、每百萬 CPU 毫秒 $0.02 |
| **靜態檔（Workers static assets／Pages）** | **請求免費且不限量**；每個版本最多 2 萬個檔案，單檔 25 MiB | — |
| **Pages** | 每月 500 次 build、同時 1 個、單次 20 分鐘；每站 2 萬個檔案 | 付費方案提高上限 |
| **Workers Builds** | 每月 3,000 build 分鐘、同時 1 個、單次 20 分鐘 | 付費方案 6,000 分鐘，超過每分鐘 $0.005 |
| **D1** | 每日讀 500 萬列、寫 10 萬列；帳號總容量 5 GB、單一資料庫 500 MB；10 個資料庫；Time Travel 7 天 | 免費方案超過額度直接查詢失敗（不會計費）。Paid 方案：每月含讀 250 億列、寫 5,000 萬列、5 GB；超過讀 $0.001／百萬列、寫 $1.00／百萬列、儲存 $0.75／GB-月；Time Travel 30 天 |
| **R2** | 每月 10 GB-月儲存、100 萬次 Class A（寫入、列表）、1,000 萬次 Class B（讀取）；**對外流量免費** | 儲存 $0.015／GB-月、Class A $4.50／百萬次、Class B $0.36／百萬次。**R2 免費額度不會自動停用，超過就計費** |
| **Access（Zero Trust）** | 50 人以內免費 | 第 51 人起全部人數改為付費方案（約 $7／人／月） |

**信用卡**：Workers、D1、Pages、Access 免費方案不需要；**R2 啟用時需要綁定付款方式**（多數來源一致；Cloudflare 說明是因為 R2 用量不設上限）。Cloudflare **沒有可設定的花費上限**，只能設用量通知。

**必須付費的情況**：Worker 每次 CPU 超過 10 ms 或每日超過 10 萬次請求、D1 單一資料庫超過 500 MB、Access 超過 50 人、R2 超過免費額度。

### 13.8 費用估算

**共同假設**：5 位編輯、三語、100 篇文章、30 個產品與解決方案頁、5 GB 圖片與 PDF。

| 計算假設 | 數值 |
|---|---|
| 每次造訪平均瀏覽頁數 | 3 頁 |
| 每頁的 HTML、CSS、JS、字型、圖片 | 全部是靜態檔（圖片在 build 時轉成 AVIF／WebP 放進靜態檔）→ **免費、不計 Worker 請求** |
| 會進 Worker 的公開請求 | 舊站參數型網址轉址＋找不到的網址，抓 2%／造訪 |
| 使用站內搜尋 | 10% 造訪；Pagefind 索引是靜態檔 → 免費 |
| PDF 下載（從 R2） | 5%／造訪，每次 1 次 Class B |
| 編輯後台 | 5 人 × 22 個工作天 × 每人每天 300 次 API 請求 ≈ 33,000 次／月 |
| 排程檢查 Cron | 每 5 分鐘 1 次 ≈ 8,640 次／月 |
| 重新建置 | 約 150 次／月，每次約 4 分鐘；每次讀 D1 約 2 萬列、從 R2 讀約 300 張原圖 |
| D1 編輯操作 | 每次 API 平均讀 50 列；每月寫入約 3,000 列 |

| 項目 | 小型（5,000 造訪／月） | 中型（50,000） | 大型（500,000） | 免費額度 |
|---|---|---|---|---|
| 公開頁面瀏覽 | 15,000（靜態） | 150,000（靜態） | 1,500,000（靜態） | 不限 |
| Worker 請求／月 | 約 41,700 | 約 42,600 | 約 51,600 | 每日 10 萬（約 300 萬／月） |
| 每日平均 Worker 請求 | 約 1,400 | 約 1,400 | 約 1,700 | 100,000 |
| D1 讀取／月 | 約 465 萬列 | 約 465 萬列 | 約 465 萬列 | 每日 500 萬列 |
| D1 寫入／月 | 約 3,000 列 | 約 3,000 列 | 約 3,000 列 | 每日 10 萬列 |
| D1 容量 | < 100 MB | < 100 MB | < 100 MB | 單庫 500 MB |
| R2 儲存 | 5 GB | 5 GB | 5 GB | 10 GB |
| R2 Class B／月 | 約 45,250 | 約 47,500 | 約 70,000 | 1,000 萬 |
| R2 Class A／月 | 約 2,000 | 約 2,000 | 約 2,000 | 100 萬 |
| Build 分鐘／月 | 約 600 | 約 600 | 約 600 | 3,000 |
| Access 使用者 | 7（5 編輯＋2 管理員） | 7 | 7 | 50 |
| **每月費用** | **US$0** | **US$0** | **US$0** | |

- 三種情境的差異幾乎只在靜態頁面，而靜態頁面不計費，所以都在免費額度內。**最大的不確定因素不是流量，而是 EmDash 後台在免費方案的 10 ms CPU 限制下能否運作**；若不行，固定成本變成 **US$5／月**（三種情境相同，額度遠用不完）。
- 若改用全 SSR：大型情境每月約 150 萬次 Worker 請求，尖峰日會超過 10 萬次 → 至少 US$5／月。這也是建議混合式的原因。
- 圖片若改用 Cloudflare Images 即時轉檔會另外計費，**不建議**；沿用 build 時轉檔。
- R2 公開媒體網域前面加快取，避免 PDF 被大量盜連時 Class B 次數暴增。

### 13.9 第二階段工時（新架構）

分類：🆕 新增功能　♻️ 沿用既有元件　🔗 整合　🧪 測試

| # | 項目 | 內容 | 🆕 | ♻️ | 🔗 | 🧪 | 小計 |
|---|---|---|---|---|---|---|---|
| 1 | CMS 技術驗證 | 本機：EmDash＋本機 D1／R2 模擬、三語、重複欄位、reference、Access 登入流程、匯出；雲端：免費方案 CPU 實測（需核准，§13.11） | 6 | | 2 | 2 | 10 |
| 2 | D1 資料模型 | 依 §3 建立 collections（products、solutions、scenarios、pages、news、insights、case-studies、tags、site settings）、translationStatus | 8 | | | 2 | 10 |
| 3 | R2 媒體管理 | 媒體設定、公開媒體網域與快取、Astro 遠端圖片轉檔、PDF | 3 | | 2 | | 5 |
| 4 | Workers API | build 用的匯出、重建標記、Cron 排程檢查與合併觸發、舊站參數型轉址路由 | 6 | | 1 | 1 | 8 |
| 5 | 後台登入與權限 | Access 原則、角色對應、送審／發布權限 | 2 | | 2 | 1 | 5 |
| 6 | CMS 管理介面 | 欄位中文標籤與說明、審核流程設定、預覽改用我們的模板 | 6 | | 4 | | 10 |
| 7 | Astro 內容讀取整合 | D1 loader（保留 Zod 與關聯驗證）、Portable Text 渲染、adapter 混合式設定、現有 Markdown 匯入 D1 的一次性腳本 | 8 | 2 | 4 | | 14 |
| 8 | Solutions、Resources、News、Insights、Case Studies、標籤頁 | §8 的 T7–T24（共用元件抽出、`ArticleLayout`、`ArticleListPage` 等） | 13 | 9 | 7.5 | 3 | 32.5 |
| 9 | 搜尋 | Pagefind＋雙字詞編碼（§12.4）、搜尋頁 | 4 | 1 | 1.5 | | 6.5 |
| 10 | 自動化測試 | 測試資料（本機 D1 種子資料）、單元、搜尋、sitemap、行為、a11y、截圖、Lighthouse、**CMS E2E**（新增／編輯／圖片／三語／關聯／草稿／審核／排程／版本還原／權限）、build 觸發測試 | | | | 23.5 | 23.5 |
| 11 | 備份與還原驗證 | D1 匯出、R2 同步、本機 Linux 腳本、本機還原演練＋一次雲端還原演練 | 3 | | 1 | 2 | 6 |
| 12 | CI 與部署相容性 | GitHub Actions（只跑程式測試）、Workers Builds 設定 | | | 2 | 1 | 3 |
| 13 | 除錯與整合 | 跨系統問題、三語邊界、build 失敗處理 | | | 10 | | 10 |
| 14 | 文件 | 編輯操作手冊、管理員手冊、還原手冊 | 4 | | | | 4 |
| | **合計** | | **63** | **12** | **37** | **35.5** | **約 148 h** |

**和舊估算的差異**：舊架構約 87 h（含 Decap 12 h）。新架構拿掉 Decap 12 h，增加 CMS 相關工作（項目 1～7、11）約 68 h，以及多一層系統的整合與除錯約 5 h。

**更省時的選項（可以只選其中幾項）**：

| 簡化 | 省下 | 代價 |
|---|---|---|
| 預覽先用 EmDash 內建預覽，不套我們的模板 | 4 h | 編輯看不到最終版面，要發布後才看得到 |
| 審核流程先只用角色（contributor 只能存草稿，editor 發布），不設多階段審核 | 2 h | 沒有「送審→退回」紀錄 |
| 第一版不做排程發布，改為發布即重建 | 2 h | 無法預約時間發布 |
| 本階段只上 Solutions＋News＋Case Studies，Insights 與標籤頁延後 | 約 8 h | 內容類型較少 |

### 13.10 資料安全與備份

| 層級 | 做法 | 涵蓋 |
|---|---|---|
| 單篇內容 | EmDash 版本紀錄（revisions）＋刪除先進垃圾桶 | 誤改、誤刪單篇 |
| 整個資料庫（短期） | D1 Time Travel：免費方案可還原到 **7 天內**任一時間點 | 大量誤刪、錯誤匯入 |
| 每日自動備份 | Cron Worker 每日把 D1 匯出 SQL 存到 R2 的私有備份 bucket，保留 30 天 | 超過 7 天的問題 |
| **每月本機 Linux 備份（沿用原規劃）** | 地端 Linux 的 systemd timer：用**唯讀** API token 執行 `wrangler d1 export`（SQL）＋ EmDash 匯出（JSON，可讀的完整內容）；用唯讀 S3 金鑰以 `rclone sync` 同步 R2 媒體；保留 12 個月份、產生 checksum。**建議改為每週** | Cloudflare 帳號或平台故障、帳號被誤刪 |
| 程式碼 | GitHub（含每月 `git bundle`，沿用原規劃） | — |
| 操作紀錄 | EmDash 稽核紀錄（誰在何時改了什麼） | 追查問題 |
| 權限分級 | Cloudflare Access 只允許名單內 Email 登入後台；CMS 內角色：管理員（2 人）、編輯（可發布）、作者（只能送審）；Cloudflare 帳號本身只給管理員並開啟兩步驟驗證；build 與備份用的 API token 只給最小權限 | 帳號外洩、誤操作 |
| 資料匯出 | 內容 JSON、D1 SQL、R2 原始檔，三者都能在不依賴 EmDash 的情況下讀取 | 未來換 CMS |
| 還原演練 | 每季在本機把備份還原成一個新的 D1＋R2，跑一次 build 確認網站正常 | 確認備份真的能用 |

**平台故障時的復原流程**：
1. 網站本身是靜態檔，Cloudflare 後台或 D1 故障時**公開網站照常運作**，只是暫時無法編輯。
2. 若 Cloudflare 帳號無法使用：用本機備份的 D1 SQL 建立新資料庫、R2 原始檔上傳到新 bucket、從 GitHub 部署程式，約半天可恢復。
3. 必要時可把 D1 SQL 轉成 SQLite 檔，在任何 Node.js 主機用 EmDash 的 SQLite 模式暫時運作。

### 13.11 需要你核准的事（核准前不會執行）

| # | 事項 | 費用影響 |
|---|---|---|
| K1 | 採用 §13.1 的建議架構（EmDash＋混合式） | — |
| K2 | **技術驗證第一階段（本機）**：在本機用 D1／R2 模擬器測試 EmDash，不建立任何 Cloudflare 資源 | $0，不需要任何 Cloudflare 操作 |
| K3 | **技術驗證第二階段（雲端）**：在你的 Cloudflare 帳號建立一個測試用 D1 與一個測試用 Worker（免費方案），實測 10 ms CPU 限制；結束後刪除 | $0；需要 Cloudflare API token（建議只給 Workers、D1 權限） |
| K4 | **R2 啟用（綁定付款方式）**：媒體與備份需要 R2 | 免費額度內 $0；超過會自動計費。建議同時設定用量通知 |
| K5 | 若 K3 結果顯示免費方案不夠：升級 Workers Paid | **US$5／月** |
| K6 | 內容匯入 D1 後，`src/content/**/*.md` 移到 `tests/fixtures/content/` 當測試資料（不刪除） | — |
| K7 | 備份頻率：本機 Linux 每週（建議）或每月 | — |

### 13.12 遷移計畫

| 步驟 | 內容 | 是否需要 Cloudflare 資源 |
|---|---|---|
| M1 | 本機技術驗證（K2），回報結果 | 否 |
| M2 | 雲端技術驗證（K3），回報免費方案是否足夠 | 是（測試用，結束後刪除） |
| M3 | 在 repo 中加入 EmDash、adapter、collections 設定；第一階段頁面改由 D1 loader 讀取，**用本機 D1 確認第一階段頁面輸出和現在完全相同**（截圖比對＋原有 27 項行為測試） | 否 |
| M4 | 一次性匯入腳本：把現有 Markdown 內容與圖片匯入本機 D1／R2，比對匯入前後 build 結果一致 | 否 |
| M5 | 第二階段頁面、搜尋、測試（§13.9 項目 8～10） | 否 |
| M6 | 建立正式 D1、R2、Access、Workers Builds（K4 核准後）；匯入內容；在 `*.workers.dev` 預覽網址驗收 | 是 |
| M7 | 編輯人員帳號與操作訓練；備份與還原演練 | 是 |
| M8 | 正式網域、DNS、GA、301（第三階段） | 是 |

### 13.13 新增風險

| 風險 | 處理 |
|---|---|
| EmDash 只有約半年的穩定版歷史，API 可能變動 | 鎖定精確版本；只用官方公開的 API；網站頁面透過我們自己的 loader 讀資料，未來換 CMS 只要改 loader |
| EmDash 的資料模型偏 WordPress（文章、頁面、區塊） | 技術驗證先確認能表達 §3 的結構化欄位（重複欄位、reference、三語） |
| 免費方案 10 ms CPU | K3 實測；不夠時 $5／月 |
| R2 沒有花費上限 | 用量通知；公開媒體加快取；備份 bucket 不公開 |
| 每次發布要等約 3～5 分鐘才上線 | 後台顯示「發布中／已上線」狀態；需要立即看到的用預覽 |
| build 失敗（例如關聯錯誤） | 網站維持上一個正常版本；後台與 Email 通知管理員 |

### 13.14 資料來源

- Workers 價格與限制：<https://developers.cloudflare.com/workers/platform/pricing/>、<https://developers.cloudflare.com/workers/platform/limits/>
- 靜態檔計費：<https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/>
- `run_worker_first`：<https://developers.cloudflare.com/workers/static-assets/routing/worker-script/>
- Workers Builds：<https://developers.cloudflare.com/workers/ci-cd/builds/limits-and-pricing/>
- Pages 限制：<https://developers.cloudflare.com/pages/platform/limits/>
- D1 價格、限制、Time Travel：<https://developers.cloudflare.com/d1/platform/pricing/>、<https://developers.cloudflare.com/d1/platform/limits/>、<https://developers.cloudflare.com/d1/reference/time-travel/>
- R2 價格：<https://developers.cloudflare.com/r2/pricing/>
- Access 價格：<https://www.cloudflare.com/sase/products/access/>
- R2 需要付款方式：<https://community.cloudflare.com/t/why-using-r2-free-tier-involves-giving-card-info/945179>
- EmDash：npm `emdash` 1.3.1、`@emdash-cms/cloudflare` 1.3.1（套件內容已檢查）；<https://github.com/emdash-cms/emdash>
- EmDash 免費方案的不同說法：<https://www.bitdoze.com/deploy-emdash-cloudflare-workers/>、<https://emdash-labs.com/blog/deploying-emdash-to-cloudflare-what-we-learned>
- Payload 需要 Workers Paid：<https://github.com/payloadcms/payload/blob/main/templates/with-cloudflare-d1/README.md>

> 註：這個開發環境無法直接開啟 Cloudflare 官網，以上額度是透過搜尋取得官方文件內容（2026-10 查詢）。實作前會在 Cloudflare 後台再確認一次。
