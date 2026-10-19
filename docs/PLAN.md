# Big x Reality 官網 2.0 — 第一階段技術規劃

> 狀態：**待審**。審過之後才開始寫程式。
> 範圍：基礎建設＋產品總覽頁＋產品頁（`/[lang]/products/`、`/[lang]/products/[slug]/`）。
> 依據：`design-source/`（tokens、Web Design System v1.0、CIS v3.2 素材、requirements-2.0.md）、
> 第一階段任務書、舊 repo `bigxreality/bigxreality-website`（只讀）。

---

## 0. 開工前檢查結果

### 0.1 design-source 檔案

| 任務書第 9 節要求 | 實際位置 | 結果 |
|---|---|---|
| `BXR_Web_Tokens_v1.0.css` | `design-source/` | ✅ |
| `BXR_Web_Design_System_v1.0.pdf`（24 頁） | `design-source/` | ✅ 已讀完 24 頁 |
| `cis-v3.2/` 官方 Logo SVG | `design-source/01_Logo/SVG/`（14 個） | ✅ 但不在 `cis-v3.2/` 子資料夾，是攤平放在根目錄 |
| `cis-v3.2/` 圖示、領域圖形 | `design-source/04_Graphics/Icons/`（12）、`04_Graphics/Sector/`（20） | ✅ 同上 |
| `cis-v3.2/` `BXR_Colors_v3.2.css` / `.json` | `design-source/02_Color/` | ✅ 同上 |
| `requirements-2.0.md` | `design-source/` | ✅ |

第 9 節列的東西都在，只是資料夾結構和 `design-source/readme` 寫的 `cis-v3.2/...` 不同。
程式會直接引用實際路徑。

另外有兩點提醒（不影響開工）：
- `design-source/readme` 提到的 **`BXR_CIS_Brand_Guidelines_v3_2.pdf`（89 頁 CIS 手冊）不在 repo 裡**。
  設計系統 PDF 已經整理了網站需要的規則；遇到設計系統標「提案」的地方，我會照設計系統做，並在報告裡列出。
- 根目錄有 17 張主視覺 JPG 和 `06_KeyVisuals/` 重複。程式只引用 `06_KeyVisuals/` 的版本。

### 0.2 舊 repo 盤點（`bigxreality/bigxreality-website`，只讀）

**重要發現：舊 repo 不是正式站的原始碼。** 它是一個沒有上線的 Astro 7 改版草稿，部署在
GitHub Pages 預覽網址，用 Tailwind、`/zh-tw/` 路徑、PT Mono 字型（三樣都和新規範衝突）。
該 repo 自己的文件也寫到，當時同樣連不到 `bigxreality.com`，所以裡面很多圖是佔位圖。

**影片**

| 檔案 | 規格 | 備註 |
|---|---|---|
| `home-hero-video-1.mp4` | 1280×720、24fps、4.1 秒、1.28 MB、H.264 High、**有音軌** | 來源只有 720p |
| `home-hero-video-2.mp4` | 1920×1080、30fps、2.9 秒、2.59 MB（7 Mbps）、H.264 High、**有音軌** | 位元率偏高 |

**真實照片**（其餘大部分是有條紋的「PLACEHOLDER · TEMPORARY」佔位圖，不會使用）

| 原檔 | 尺寸 | 推測內容 | 第一階段用途 |
|---|---|---|---|
| `images/SUT軍事.jpeg` | 1686×1080 | 四名學員戴 VR 頭盔、持訓練槍，背景有載具模擬器 | **SUT 產品主圖**（請確認這張是 SUT） |
| `images/兵棋圖台.jpeg` | 1620×1080 | 兵棋圖台 | 不使用（產品尚未建頁） |
| `images/快艇載具訓練系統.jpeg` | 810×1080 | 有人快艇模擬器 | 不使用。**這是快艇，不是 USV 無人船，不能拿來當 USV 圖** |
| `images/悍馬車載具訓練系統.jpeg` | 1620×1080 | 悍馬車模擬器 | 不使用 |
| `images/攜帶式警勤訓練器.jpeg` | 1620×1080 | 警勤訓練 | 不使用 |
| `images/警察hero.jpeg` | 1620×1080 | 警勤訓練 | 不使用 |
| `images/反制無人機.png` | 1920×1080 | 遊戲畫面截圖（瞄準鏡＋無人機） | 不使用。之後若要放在 Counter-UAS 情境，需確認是否為實際系統畫面 |
| `images/城市1920.jpg` | 1792×1008 | 看起來是 AI 生成圖（畫面裡有「BIG X REALITY」字樣） | **不使用**（需求文件禁止用 AI 圖冒充） |
| `home/products/*.webp` 等 | 1200×900 | 上面照片的 4:3 重新壓縮版 | 不使用，改用原始 JPEG |

**沒有 UAV、USV 的產品照片。** 這兩頁會顯示「[產品圖・待提供]」。

**舊網址：** 見 [`docs/legacy-urls.md`](./legacy-urls.md)。正式站連不到，清單不完整。

### 0.3 會從舊 repo 複製進來的檔案（審核通過後）

- `SUT軍事.jpeg` → `src/assets/images/products/sut-hero.jpg`（改用 ASCII 檔名，內容不變）
- 兩支影片 → `media-src/hero/`（原始檔保存；首頁階段才壓縮輸出，見 §4.3）

---

## 1. 專案結構

```
bigxreality-web/
├─ design-source/              設計與需求來源（唯讀，程式直接引用，不複製、不修改）
├─ docs/
│  ├─ PLAN.md                  本文件
│  ├─ legacy-urls.md           舊網址清單（301 用）
│  └─ screenshots/phase-1/     QA 截圖（PR 說明引用）
├─ media-src/hero/             原始影片（不會進 dist；首頁階段壓縮後輸出）
├─ public/
│  ├─ favicon.svg              = 01_Logo/SVG/BXR_Symbol_Red.svg 原檔
│  ├─ favicon-16/32/48.png、apple-touch-icon.png（180）、icon-192/512.png
│  │                           由官方 Symbol SVG 直接點陣化（不重畫）
│  └─ robots.txt
├─ scripts/
│  ├─ check-i18n.mjs           三語檔案完整度檢查（build 時也會跑，只警告不中斷）
│  ├─ check-links.mjs          掃描 dist 所有內部連結，列出 404
│  ├─ qa-a11y.mjs              Playwright＋axe-core，掃三頁 × 兩種寬度
│  ├─ qa-screenshots.mjs       Playwright 截圖 1440 / 390
│  └─ make-favicons.mjs        由官方 Symbol SVG 輸出 favicon PNG
├─ src/
│  ├─ assets/images/
│  │  ├─ products/             產品圖（第二階段 = Decap media_folder）
│  │  └─ solutions/            解決方案圖
│  ├─ components/              共用元件（見 §1.1）
│  ├─ content/                 Markdown 內容（Decap multiple_folders 結構）
│  │  ├─ products/{tw,en,jp}/{sut,uav,usv}.md
│  │  ├─ solutions/{tw,en,jp}/{military,police,fire-rescue,smart-city}.md
│  │  ├─ scenarios/{tw,en,jp}/{mum-t,counter-uas}.md     整合訓練情境（不是產品）
│  │  ├─ pages/{tw,en,jp}/products.md                    產品總覽頁的文案
│  │  ├─ insights/  news/  case-studies/   {tw,en,jp}/    第一階段只建 schema，沒有檔案
│  │  └─ ui/{tw,en,jp}.json                              選單、按鈕、區塊標題等介面文字
│  ├─ content.config.ts        所有 collection 的 zod schema
│  ├─ data/site.json           站點設定（JSON，第二階段 Decap 可直接編輯）
│  ├─ i18n/                    語言設定、網址轉換、hreflang 計算
│  ├─ integrations/            自訂 Astro integration（build 時跑三語檢查）
│  ├─ layouts/BaseLayout.astro <html lang>、SeoHead、Header、main、Footer
│  ├─ lib/                     內容查詢：已發布篩選、關聯正反查、[待提供] 判斷
│  ├─ pages/
│  │  └─ [lang]/products/
│  │     ├─ index.astro        產品總覽
│  │     └─ [slug].astro       產品頁
│  └─ styles/
│     ├─ global.css            @import design-source/BXR_Web_Tokens_v1.0.css（不複製）＋ reset ＋ 字級
│     └─ fonts.css             @fontsource 自架字型
├─ astro.config.mjs
├─ package.json
└─ tsconfig.json
```

**原則**
- 樣式數值只用 tokens 檔的變數；tokens 沒有、但設計系統 PDF 有的值（字級、按鈕高度、卡片規格等），
  寫在 `global.css` 並在註解標明 PDF 頁碼。兩邊都沒有的值不自己發明，會列在報告裡。
- Logo 直接引用 `design-source/01_Logo/SVG/` 原檔（以 `<img>` 輸出），不複製、不修改、不 inline 改色。
- 不用 Tailwind、不用前端框架。互動（漢堡選單、篩選、頁內導覽）用少量原生 JS，關掉 JS 時內容仍完整可讀。

### 1.1 元件

| 元件 | 重點實作 |
|---|---|
| `Header` | `theme="dark" \| "light"`；高 72px，Logo 32px（≤1023px 改 28px）；淺色用 `BXR_Logo_H_Color.svg`、深色用 `BXR_Logo_H_Reverse.svg`；目前所在項目加 2px BxR Red 底線＋`aria-current`；搜尋圖示連到 `/[lang]/search/`；語言切換到同一頁另一語言；紅色「聯絡我們」；≤1023px 漢堡選單：`aria-expanded`、Esc 關閉、焦點留在選單內、關閉後焦點回到按鈕，按鈕 ≥ 44×44px；「跳到主要內容」連結 |
| `Footer` | Logo、選單連結、聯絡資訊（讀 `site.json`）、隱私權政策、版權年份（build 當年） |
| `PageHero` | Command Black 底；麵包屑；英文小標；H1；說明；右側圖片（LCP：`fetchpriority="high"`、不 lazy）；最多兩個按鈕（紅色主按鈕＋外框次按鈕） |
| `SectionHead` | 英文小標＋H2＋說明（≤ 6 欄寬）＋可省略的「查看全部」 |
| `CtaBand` | 深色區；標題、說明、紅色主按鈕＋外框次按鈕 |
| `FilterBar` | 篩選按鈕（`aria-pressed`），結果數用 `aria-live` 播報，篩選狀態寫進網址 `?domain=`；搜尋框只做外觀，見 §6 第 13 題 |
| `CardProduct` | 16:9 圖片；沒圖時顯示「[產品圖・待提供]」；中文名、英文名、短描述、領域標籤；整張卡可點（標題是連結文字）；hover：標題變 Text Red、圖片 400ms 放大 1.02 |
| `CardSolution` | 圖片、領域代號（附領域色點）、名稱、說明 |
| `CardArticle` | 封面、類型・日期（B612 Mono）、標題、摘要、#標籤；≤767px 改成左圖右文。第一階段沒有文章內容，元件會做好，產品頁「相關文章」區塊有資料時才顯示 |
| `SeoHead` | title、description、canonical、hreflang、OG、Twitter、JSON-LD（Organization＋BreadcrumbList；產品頁加 Product） |
| 輔助元件 | `Button`、`SectorTag`、`Breadcrumb`、`Pending`（顯示 `[待提供]`）、`Picture`（包 Astro `<Picture>`） |

---

## 2. 內容 schema（`src/content.config.ts`）

### 2.1 共用規則

- **語言資料夾**：`src/content/<collection>/<lang>/<slug>.md`，`lang` = `tw` / `en` / `jp`（與網址一致）。
  檔名就是 slug，三語相同。這是 Decap `i18n.structure: multiple_folders` 可直接讀寫的結構。
- **結構欄位以 `tw` 為準**：排序、領域、關聯、草稿、發布日期這類不需要翻譯的欄位，只讀 `tw` 檔。
  `en` / `jp` 檔即使有這些欄位也會被忽略。第二階段 Decap 會設成 `i18n: duplicate`（編輯一次，自動複製）。
  這樣可以避免「三個語言的關聯不一致」。
- **`[待提供]` 和「不顯示」的分別**：
  - 欄位**沒有填**（或是空陣列）→ 整個區塊不顯示。
  - 欄位填了 **`[待提供]`** → 區塊照樣顯示，並在頁面上顯示 `[待提供]` 標記。
  - 範例內容依任務書規定，需求文件沒寫到的欄位一律填 `[待提供]`，所以三個範例產品的 12 個區塊幾乎都會出現。
    「沒資料就隱藏」的邏輯會另外用測試資料驗證（測試資料不會提交進內容資料夾）。
- **數值欄位**：型別為「數字或 `[待提供]`」（`z.union([z.number(), z.literal("[待提供]")])`）。
- **翻譯狀態**：每個語言檔都有 `translationStatus: source | pending | translated`。
  `en` / `jp` 範例檔是複製的中文，所有文字前面加 `[待翻譯]`，狀態設為 `pending`。
- **發布條件**：`draft: false` 而且 `publishDate <= build 當下時間`，才會輸出頁面、出現在列表和關聯裡。
- **圖片**：用 Astro `image()` 驗證路徑；只要有圖，`alt` 就是必填（`z.string().min(1)`）。

### 2.2 `products`

| 欄位 | 型別 | 語言 | 說明 |
|---|---|---|---|
| `translationStatus` | enum | 各語言 | |
| `draft` | boolean | tw | |
| `publishDate` | date | tw | 未來日期不輸出（排程發布） |
| `updatedAt` | date，可省略 | 各語言 | |
| `order` | number | tw | 列表排序 |
| `domains` | `("military"\|"police"\|"fire-rescue"\|"smart-city")[]` | tw | 領域標籤、篩選依據 |
| `hero.name` | string | 各語言 | 產品名稱 |
| `hero.englishName` | string | 各語言 | 英文名 |
| `hero.code` | string | tw | 代號，例如 `SUT`；也用來預填表單 |
| `hero.tagline` | string | 各語言 | 一句話定位 |
| `hero.image` | `{ src: image(), alt: string }`，可省略 | 圖 tw／alt 各語言 | 沒有就顯示「[產品圖・待提供]」 |
| `summary` | string，可省略 | 各語言 | 卡片短描述；沒填就用 `hero.tagline` |
| Markdown 內文 | — | 各語言 | ③ 產品概述 `overview` |
| `capabilities` | `{ title, description }[]` | 各語言 | ④ 核心能力 |
| `howItWorks` | `{ title, description }[]` | 各語言 | ⑤ 運作方式（依序編號） |
| `scenarios` | `{ title, description }[]` | 各語言 | ⑥ 產品自己的訓練情境 |
| `integratedScenarios` | `reference("scenarios")[]` | tw | ⑥ 參與的整合訓練情境（MUM-T、Counter-UAS） |
| `components` | `{ name, description }[]` | 各語言 | ⑦ 系統組成 |
| `deployment` | `{ personnel?: {min,max} \| "[待提供]", area?: 數字(m²) \| "[待提供]", setupTime?: 數字(分鐘) \| "[待提供]", notes?: string }` | 數字 tw／notes 各語言 | ⑧ 部署方式 |
| `integratedOps.description` | string | 各語言 | ⑨ 整合作戰說明 |
| `integratedOps.products` | `reference("products")[]` | tw | ⑨ 可整合的產品。**只需在一邊填**：SUT 填了 UAV，UAV 頁會自動顯示 SUT（正反查合併） |
| `relatedSolutions` | `reference("solutions")[]` | tw | ⑩ |
| — | — | — | ⑪ 相關文章：由 insights / news / case-studies 的 `relatedProducts` 反查，自動產生 |
| `cta.title` / `cta.description` | string | 各語言 | ⑫ 結尾 CTA 文案 |
| `cta.brochure` / `cta.demo` | boolean | tw | 是否顯示型錄／Demo 按鈕；表單網址在 `site.json`，產品代號自動預填 |
| `seo.title` / `seo.description` | string，可省略 | 各語言 | 沒填就用 `hero.name` / `hero.tagline` |
| `seo.ogImage` | image，可省略 | tw | 沒填就由主圖裁成 1200×630 |

② 頁內導覽依實際有顯示的區塊自動產生（錨點連結＋目前位置標示，`scroll-margin-top` 避免被固定 Header 擋住）。

### 2.3 其他 collection（第一階段只做到產品頁需要的程度）

| collection | 第一階段欄位 | 內容 |
|---|---|---|
| `solutions` | `translationStatus`、`draft`、`order`、`domain`、`name`、`englishName`、`summary`、`image?` | 4 筆，只用來顯示產品頁的「關聯解決方案」卡片。**不建解決方案頁** |
| `scenarios` | `translationStatus`、`order`、`name`、`englishName`、`code`、`summary`、`products: reference("products")[]` | 2 筆：MUM-T、Counter-UAS。**不是產品，沒有自己的頁面**；顯示在產品總覽的「整合訓練情境」區塊和相關產品頁的情境區塊 |
| `pages` | 產品總覽頁的 hero / 整合訓練情境 / CTA 文案 | 1 筆×3 語 |
| `insights`、`news`、`case-studies` | `translationStatus`、`draft`、`publishDate`、`title`、`summary`、`cover?`、`tags[]`、`relatedProducts[]`、`relatedSolutions[]` | 第一階段沒有檔案，只為了讓「相關文章」反查可以運作 |
| `ui` | 選單、按鈕、區塊標題、篩選標籤等 | 3 個 JSON（tw / en / jp） |

`site.json` 欄位：公司中英文名稱、聯絡資訊（地址、電話、Email）、社群連結、104 徵才網址、
Google 表單（型錄、Demo 各一：表單網址＋產品欄位的 `entry.xxxx` 代號）、GA ID `G-CSKFKPZTTE`。
沒提供的值一律 `[待提供]`。表單網址是 `[待提供]` 時，按鈕不會變成死連結，而是顯示為停用狀態並標示「表單網址待提供」。

### 2.4 範例內容會用到的需求文件原文

只使用 requirements-2.0.md 明確寫到的內容，其他一律 `[待提供]`：

| 產品 | 可用內容（章節） |
|---|---|
| SUT | 名稱「SUT 小型部隊專項訓練系統」（§8）、英文「Small Unit Tactical Training System」（§12）、約 1–4 人（§9.1）、核心訊息句（§12）、能力與情境：基礎射擊、CQB、小部隊戰術情境、隊形掩護與移動、小隊溝通與協同、情境判斷、訓練評估、可與無人載具整合（§9.1、§12）、關聯 Military（§22） |
| UAV | 名稱「UAV 無人機戰術訓練系統」（§8）、獨立產品、學員以搖桿操控虛擬無人機（§9.2）、飛行操控／搖桿操作／任務情境／與地面部隊協同（§9.2）。英文名 `[待提供]` |
| USV | 名稱「USV 無人船 VR 訓練系統」（§8）、可獨立運行的 VR App、可串流畫面到 SUT 的 MUM-T 情境（§9.3）、四項介紹重點（§9.3）。英文名 `[待提供]` |
| MUM-T | §9.4 的說明（不寫通訊協定、資料流方向或控制權限） |
| Counter-UAS | §9.2 的說明（UAV 與 SUT 的跨產品整合訓練） |
| 解決方案 | §6 四個領域的一句說明 |

UAV、USV 的「關聯解決方案」設為 Military，依據是 §6「Military：…無人載具及其他國防訓練應用」。
能力和情境的分組是我依需求文件整理的，請在審查時確認。

---

## 3. 三語路由與 hreflang

| 項目 | 做法 |
|---|---|
| 路由 | `src/pages/[lang]/products/...`，`getStaticPaths` 產生 `en` / `tw` / `jp`。`trailingSlash: "always"`、`build.format: "directory"` → `/tw/products/sut/` |
| 根目錄 | `astro.config` 的 `redirects: { "/": "/en/" }`。靜態輸出會產生 meta refresh 頁；第二階段在 Cloudflare `_redirects` 改成真正的 301 |
| `<html lang>` | `en` / `zh-Hant-TW` / `ja-JP`（requirements §4） |
| hreflang | `en` / `zh-Hant-TW` / `ja`（任務書第 3 節）＋ `x-default` 指向 `/en/` 的同一頁。只列出該頁實際存在的語言版本 |
| canonical | 絕對網址 `https://www.bigxreality.com/{lang}/...`（`site` 設在 astro.config） |
| 語言切換 | 連到同一 slug 的另一語言；那個語言沒有這頁時，改連到該語言的產品總覽。連結加 `hreflang` 和 `lang` 屬性 |
| 三語檢查 | 自訂 integration 在 build 開始時掃描 `src/content/*/{en,tw,jp}/`，列出「某 slug 缺少哪個語言」和「哪些檔案還是 `pending`」，用 `logger.warn` 輸出，不中斷 build |
| 不做的事 | 不依 IP 或瀏覽器語言自動跳轉、不建語言選擇頁 |

---

## 4. 圖片與影片

### 4.1 圖片流程

- 圖片放 `src/assets/images/`，由 Astro `<Picture>`（sharp）在 build 時輸出 **AVIF＋WebP＋JPG 備援**，多種寬度＋`sizes`。
- 寬度（設計系統 P.17）：Hero `640 / 1280 / 1920 / 2560`、卡片 `400 / 640 / 960 / 1280`；超過原圖寬度的尺寸不輸出（不放大）。
- 比例：Hero 16:9（手機另出 4:5）、卡片 16:9、產品 3:2（設計系統標「提案」）。裁切用 `fit: cover`。
- 一律寫 `width` / `height`，避免版面跳動。首屏圖片 `fetchpriority="high"`，其他 `loading="lazy" decoding="async"`。
- 影像上的文字：同側 Command Black 0–60% 漸層壓暗，文字底下亮度 ≤ 30%（設計系統 P.17）。
- CIS 主視覺是**合成示意圖**（CIS README：正式對外前要換成實拍或 RD 渲染）。如果使用，會在圖上標「合成示意」，和設計系統 P.16 的做法一樣。

### 4.2 Logo 與 Favicon

- Header 淺色：`BXR_Logo_H_Color.svg`；深色：`BXR_Logo_H_Reverse.svg`；高 32px（手機 28px）。
- `alt="Big x Reality"`，Logo 連結加 `aria-label="Big x Reality 首頁"`（依語言）。
- Favicon：`BXR_Symbol_Red.svg` 原檔＋由它點陣化的 16/32/48/180/192/512 PNG。舊 repo 的 favicon 不知道來源，不沿用。

### 4.3 首頁影片壓縮規格（首頁階段才實作，這裡先定規格）

| 項目 | 規格 |
|---|---|
| 音軌 | 移除（`-an`），靜音播放 |
| 主要格式 | WebM（VP9，CRF 33–36，`-b:v 0`）＋ MP4（H.264 High，yuv420p，CRF 23–26，`-movflags +faststart`） |
| 解析度 | 桌機 1920×1080；手機 1280×720。**video-1 原檔只有 720p，不放大**，建議提供更高解析度的原檔 |
| 檔案大小 | 每支 ≤ 1.5 MB，全部合計 ≤ 4 MB（設計系統 P.16） |
| 封面圖 | 取第一幀輸出 AVIF/WebP，`fetchpriority="high"`，影片不擋首屏 |
| 播放方式 | 1 → 2 → 1 依序播放（不各自無限循環），交接用 400–800ms 淡入淡出；第二支在第一支開始播放後才載入 |
| 減少動態 | `prefers-reduced-motion` 或省流量模式：只顯示封面圖，不自動播放 |
| 無障礙 | 自動播放超過 5 秒要有暫停按鈕（WCAG 2.2.2） |

---

## 5. 第二階段待辦

| 項目 | 規劃 |
|---|---|
| **Decap CMS**（5 位編輯） | `/admin/`，`i18n.structure: multiple_folders`、`locales: [tw, en, jp]`、`default_locale: tw`；結構欄位 `i18n: duplicate`；關聯用 relation widget；開啟 editorial workflow（草稿→審核→發布）。**登入方式要選定**，見 §6 第 9 題 |
| **排程發布** | 每小時自動建置一次。建議用 Cloudflare Worker 的 Cron Trigger 呼叫 Pages Deploy Hook（GitHub Actions 排程可能延遲，公開 repo 60 天沒活動還會自動停用）。build 只輸出 `publishDate` 已到的內容 |
| **Cloudflare Pages** | build `npm run build`、輸出 `dist`、Node 22；`_redirects`（301）；`_headers`（安全標頭、`/_astro/*` 長期快取）；分支預覽用 Cloudflare Access 保護。**正式網域 DNS 切換不在範圍內**，要另外同意 |
| **Pagefind** | build 後執行 `pagefind --site dist`；依 `<html lang>` 自動分語言索引；`/[lang]/search/` 頁面延遲載入搜尋介面；草稿和 noindex 頁不建索引 |
| **Cookie 同意＋GA** | Google Consent Mode v2 預設拒絕；自製輕量橫幅（接受／拒絕／設定），使用者同意後才載入 `gtag.js`（`G-CSKFKPZTTE`）；可隨時從頁尾修改；連到隱私權政策 |
| **301 轉址** | 依 `docs/legacy-urls.md` 寫 `_redirects`，加自動測試逐條驗證 |
| **每月備份到地端 Linux** | Linux 主機上的 systemd timer（每月）：`git clone --mirror` / `git remote update --prune` 取得**所有分支**（Decap 草稿存在 `cms/*` 分支和對應 PR）→ `git bundle --all` 打包 → 另用 GitHub API 匯出開啟中的 PR 與標籤（草稿狀態存在這裡）→ 保留 12 份、產生 checksum。用唯讀 deploy key。每季做一次還原測試 |
| **Lighthouse / axe 自動檢查** | GitHub Actions 在每個 PR 執行：build → preview → axe（serious/critical 為 0 才通過）→ Lighthouse CI（四項 ≥ 90）→ 內部連結檢查 → 結果留言在 PR |
| 表單後端（建議） | 見 §6 第 8 題 |

---

## 6. 風險與需要你決定的事

每題都附上我的建議。**粗體**是會影響第一階段實作的題目，其他可以晚點決定。

1. **領域色在白底的對比不足。** 任務書列的軍事 `#718352`、警勤 `#527CE0`、消防 `#E1452D` 是 tokens 裡的 *Light* 值，
   在白底只有 4.14 / 3.95 / 4.13:1（未達 4.5:1），在 Command Black 底才有 4.64 / 4.87 / 4.66:1。
   設計系統 P.08 的規則是「白底用 Deep、黑底用 Light」。智慧城市 `#C5CCD3`（Mist）在白底只有 1.62:1，
   而且設計系統 P.07 說智慧城市是企業通用，不使用領域色。
   **建議：** 淺色底用 Deep（`#596B42` / `#2E5C9A` / `#C8311E`），深色底用任務書的 Light 值；
   智慧城市的文字用 Slate（淺底）／Mist（深底）。Graphite 底上不放領域色文字（對比只有 3.7）。
2. **畫面上會有兩個紅色按鈕。** 任務書要 Header 放紅色「聯絡我們」，產品頁 Hero 又有紅色主按鈕，
   第一屏會同時出現兩個紅色焦點，和「一個紅色焦點」原則衝突。設計系統 P.12 的 Header CTA 是「預約展示」。
   **建議：** 照任務書做（Header 紅色「聯絡我們」＋Hero 紅色型錄按鈕），請你看截圖後決定要不要把其中一個改成外框按鈕。
3. **導覽和語言標示以任務書為準**：選單「解決方案、產品、技術、資源、公司」、語言「EN / TW / JP」。
   設計系統 P.12 的範例（產品系統、案例、最新消息、關於我們；中文 / EN / 日本語）是舊導覽，不採用。
4. **按鈕文字。** 設計系統要求雙語按鈕「預約展示 Book a demo」。需求文件只有英文「Request Brochure」，沒有中文。
   **建議：** 「預約展示 Book a demo」「型錄申請 Request brochure」，放在 `ui` 檔可隨時改。
5. **日文字型。** CIS 只有 Noto Sans TC＋B612 Mono。`/jp/` 頁面的漢字會是繁中字形，日本讀者看得出來。
   **建議：** `/jp/` 加 Noto Sans JP（需求文件 §3 曾提過），需要品牌窗口同意。第一階段先只用 Noto Sans TC。
6. **翻譯未完成的頁面要不要 noindex。** 需求文件要求避免未完成翻譯被當正式內容發布。
   **建議：** `translationStatus: pending` 的頁面加 `noindex`、不列入 sitemap，頁面上方顯示「[待翻譯]」提示。
   第一階段只在本機跑，影響不大；上線前要確定。
7. **解決方案的 slug 和名稱。** 建議 `military`、`police`、`fire-rescue`、`smart-city`（`fire-rescue` 和 CIS 的「Fire & Rescue」、舊 repo 一致）。
   中文用任務書的「軍事、警勤、消防與防救災、智慧城市」。卡片上的領域代號建議用 `MILITARY`、`POLICE`、`FIRE & RESCUE`、`SMART CITY`。Anti-Fraud 待確認，先不建。
8. **Google 表單做不到需求文件 §18–20 的要求。** 表單預填的產品可以被使用者改掉（需求要求鎖定），
   也沒辦法做後端驗證、電話 E.164、MX 檢查、Turnstile、頻率限制、人工審核流程。
   第一階段照任務書用 Google 表單連結。**需要你提供：型錄、Demo 兩張表單的網址，以及產品欄位的 `entry.xxxx` 代號。**
   長期建議：Cloudflare Pages Functions＋D1＋Turnstile 的最小後端（要另外估）。
9. **Decap 登入方式**（第二階段）。Decap 的 git-gateway 只能配 Netlify Identity，Cloudflare 上不能用。
   **建議：** GitHub 後端＋部署在 Cloudflare Worker 的 OAuth 代理；5 位編輯各需一個 GitHub 帳號並加入 repo 寫入權限；
   可再加 Cloudflare Access（50 人內免費）保護 `/admin/`。
10. **舊站網址不完整。** 開發環境連不到 `www.bigxreality.com`。**請提供舊站 sitemap.xml 或 Search Console「網頁」報表匯出**，
    或在環境的網路設定把 `www.bigxreality.com` 加入允許清單，我再自己抓。
11. **素材缺口。** UAV、USV 沒有產品照片；SUT 照片 1686×1080，低於設計系統 Hero 規格 2560×1440；沒有 OG 分享圖（1200×630）；
    產品總覽 Hero 沒有正式照片（建議先用 CIS 企業主視覺 `BXR_KV_CORP_TRAINING_SPACE_v3.2.jpg`，標「合成示意」）。
    **請確認 `SUT軍事.jpeg` 是 SUT 的照片。**
12. **UAV、USV 的英文正式名稱**需求文件沒有，先填 `[待提供]`。
13. **產品總覽的搜尋框。** 任務書說先只做外觀。一個能輸入但沒反應的框是假功能，所以我會把它設成停用，並標示「搜尋將於第二階段啟用」。
    另一個選擇：直接做成「在產品卡片中即時篩選文字」（只要幾行 JS，可以真的運作），Pagefind 留給全站搜尋。我比較推薦後者，請選一個。
14. **Astro 版本。** 最新穩定版是 7.4.0（2026-10-15 發布，4 天前）。我會鎖定 7.4.0 的精確版本；如果遇到新版問題再退回 7.3.8。
15. **工作分支。** 任務書建議 `phase-1`，這個工作環境指定的分支是 `claude/inspiring-johnson-6sqxqu`。我會在這個分支開發，完成後開 PR 到 `main`。
16. **字型效能。** Noto Sans TC 三個字重的中文字檔很大。會用 @fontsource 的 unicode-range 分割檔（只下載頁面用到的字），只預載拉丁字元子集，`font-display: swap`。Lighthouse 效能分數可能主要受這點影響，會在報告說明。
17. **Product 結構化資料。** 沒有價格（offers）的 Product JSON-LD 在 Search Console 可能出現「缺少欄位」的非嚴重警告。B2B 產品不適合放價格，可以接受。JSON-LD 不會輸出任何 `[待提供]` 的值。

---

## 7. 第一階段實作順序（審核通過後）

1. 建 Astro 專案、字型、tokens 引入、BaseLayout、favicon。
2. i18n 工具、`site.json`、`ui` 字串、三語檢查 integration。
3. `content.config.ts` 與範例內容（sut / uav / usv、4 個解決方案、2 個整合情境、產品總覽文案）。
4. 元件：Header → Footer → SeoHead → PageHero → SectionHead → CtaBand → 卡片 → FilterBar。
5. 產品總覽頁、產品頁。
6. QA：`npm run build` 零錯誤 → 連結檢查 → axe（serious/critical 為 0）→ Lighthouse（`/tw/products/sut/`）→ Playwright 截圖 1440 / 390。
7. 開 PR，附截圖、QA 結果、`[待提供]` 清單、待決定事項。

### 7.1 預計會出現的 404（尚未建立的頁面，會在報告列出）

`/[lang]/`（首頁，麵包屑和 Logo 會連到這裡）、`/[lang]/solutions/…`、`/[lang]/technologies/`、
`/[lang]/insights/`、`/[lang]/news/`、`/[lang]/case-studies/`、`/[lang]/company/`、`/[lang]/contact/`、
`/[lang]/privacy/`、`/[lang]/search/`。
