# Big x Reality 官網 2.0 — 第二階段技術規劃

> 狀態：**原則核准，依 §11 決策修訂（2026-10-19）**。執行順序：先做 Pagefind 技術驗證並回報 → 確認可行後依 §8 分階段實作。不部署。
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

### 3.6 與 Decap CMS 的整合

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

### 11.1 Decap CMS
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
