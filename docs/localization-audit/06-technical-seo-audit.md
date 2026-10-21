# 06｜技術 SEO 與 Googlebot

版本／方法／驗證層級標記：見 01（〔原始碼〕〔建置〕〔本機 Worker〕〔Lab〕〔線上〕）。
〔線上〕全部未完成：本環境的網路政策拒絕連線到 www.bigxreality.com、bigxreality.com、magician-eric.github.io（proxy 403；WebFetch 也無法解析網域）。凡標「待線上驗證」的項目，都不得視為已通過。

## 0. 已通過的項目（證據）
| 項目 | 結果 | 層級 |
|---|---|---|
| 存在的頁面回應 200 | 93 頁 | 本機 Worker |
| HTML lang | tw=zh-Hant-TW、en=en、jp=ja-JP，與語言相符 | 建置 |
| Canonical | 93/93 指向自己，絕對網址、https、www、結尾斜線 | 建置 |
| 每頁 H1 數量 | 93/93 剛好 1 個 | 建置 |
| viewport meta | 93/93 | 建置 |
| 重複的 title／description（可索引頁、同語言內） | 0 | 建置 |
| Sitemap | 60 個網址；全部存在、可索引、無 noindex 頁；有 xhtml:link hreflang | 建置 |
| robots.txt（正式 build） | `User-agent: *` `Allow: /` `Sitemap: https://www.bigxreality.com/sitemap.xml` | 建置 |
| 重要文字在初始 HTML | 是（靜態輸出；FAQ 用 `<details>`，答案在 HTML 中；下拉選單在 HTML 中） | 建置 |
| 圖片 | 真實照片 36 張都有 alt、width、height；首屏 3 張 eager＋fetchpriority=high；其餘 lazy；裝飾性 SVG 為 alt="" | 建置 |
| Lighthouse SEO／無障礙／最佳做法 | 100／100／100（5 頁） | Lab |
| X-Robots-Tag | 沒有任何回應帶此標頭（沒有意外的 noindex） | 本機 Worker；正式環境待線上驗證 |
| nosnippet／max-snippet／data-nosnippet | 沒有使用 | 建置 |
| 搜尋頁 | 三語 noindex（正確） | 建置 |

## 1. 問題清單

### T-01｜P0｜網站根目錄與首頁 404
- 頁面：`/`、`/tw/`、`/en/`、`/jp/`；語言：全部。
- 證據：〔本機 Worker〕`/` → 301 `Location: /en/` → `/en/` 404；`/tw/`、`/jp/` 也是 404。來源：`astro.config.mjs` `redirects: { "/": "/en/" }`、`dist/client/_redirects`；`src/pages/[lang]/` 下沒有 `index.astro`。
- 連帶影響：93 頁的 Logo、Breadcrumb 第一層（`/{lang}/`）、Organization.url（`https://www.bigxreality.com/` → 404）、x-default 的入口。
- 影響：Googlebot 與 AI 爬蟲從網域根目錄進站時得到 404；品牌搜尋缺少首頁；Google 的網站名稱（site name）通常取自首頁的 WebSite 結構化資料，目前無法提供；每頁的首頁連結都是壞連結。
- 建議：先建立繁中首頁，再建英日首頁；在首頁建立之前，請業主決定 `/` 暫時轉到哪個存在的頁面。
- ChatGPT：是（先寫繁中首頁文案）。交叉：C-14、S-01、S-02。

### T-02｜P0（上線前）｜舊網址沒有 301 轉址
- 證據：`docs/legacy-urls.md` 列出需要 301 的舊網址：`/tw/home`、`/tw/packages`、`/en/home`、`/jp/home`、`news_content?param=…／?uuid=…／?id=…`。〔本機 Worker〕這些全部是 404；`_redirects` 只有 `/`。清單本身也標示「不完整」，需要舊站 sitemap 或 Search Console 匯出。
- 影響：換站後，舊網址累積的索引與外部連結會失效。
- 建議：取得舊站完整網址清單，實作 301（參數型網址需要用 Worker 處理）。
- ChatGPT：否。

### T-03｜P1｜每頁都有兩個壞連結：核心技術、隱私權政策
- 證據：〔建置〕三語共 93 頁都連到 `/{lang}/technologies/`（Header＋Footer）與 `/{lang}/privacy/`（Footer），〔本機 Worker〕都是 404。（`src/components/Header.astro:52`、`src/components/Footer.astro:16,59`）
- 影響：浪費爬取資源、品質訊號差；缺少隱私權政策會影響信任（E-E-A-T）。
- 建議：建立這兩頁（先繁中）。
- ChatGPT：是（先寫繁中）。交叉：C-14。

### T-04｜P2｜hreflang 指向 noindex 頁，HTML 與 sitemap 不一致
- 證據〔建置〕：`/tw/products/`、`/tw/company/`、`/tw/contact/`（可索引）的 HTML hreflang 列出 en、ja、x-default（→ `/en/...`），但這些英日頁都是 noindex；同一頁在 sitemap 的 hreflang 只有 zh-Hant-TW。全部 57 筆問題：hreflang 指向 noindex 頁 54 筆、HTML 與 sitemap 不一致 3 筆（明細在 `scripts` 外的稽核資料，可重跑）。原因：`SeoHead.astro` 用 `alternates`（頁面存在的語言）輸出 hreflang，`sitemap.xml.ts` 用「可索引的語言」。noindex 列表頁（news、insights、tags、search）互相引用 hreflang，影響小。
- 影響：Google 會忽略指向 noindex 頁的 hreflang 組合；x-default 指向不可索引的英文頁。三語對應訊號互相矛盾。
- 建議：HTML hreflang 改用與 sitemap 相同的規則（只列出可索引的語言；x-default 只在英文可索引時輸出）。翻譯完成後問題就會消失。
- ChatGPT：否（程式）。交叉：T-05、C-04。

### T-05｜P1｜英日產品總覽、公司介紹、聯絡頁 noindex，也不在 sitemap
- 證據：`pages/{en,jp}/{products,company,contact}.md` 的 `translationStatus: pending` → 建置 HTML 為 noindex；sitemap TW 22、EN 19、JP 19 個網址。
- 影響：英日搜尋沒有產品中心頁、公司介紹與聯絡頁可以排名；12 個英日產品頁失去最重要的上層頁。
- 建議：依繁中翻譯後，狀態改為 translated（索引會自動恢復）。
- ChatGPT：是（翻譯）。交叉：C-04、C-06。

### T-06｜P1｜繁中產品總覽可被索引，但 meta description 與可見內容是「[待提供]」
- 證據：`/tw/products/` 的 `<meta name="description" content="[待提供]">`，可見文字有 4 處 [待提供]（hero 說明、CTA 標題與說明）；來源 `src/content/pages/tw/products.md`。
- 影響：搜尋結果摘要可能顯示「[待提供]」；重要的分類頁缺少主題說明。
- 建議：先撰寫繁中說明與 CTA，再翻譯英日。
- ChatGPT：是（先寫繁中）。交叉：C-14、K-20。

### T-07｜P2｜產品與解決方案頁的 H1 是口號，不是產品名
- 證據：例如 `/tw/products/sut/` 的 H1 是「真正的戰術默契，來自每一次協同行動」；產品名只出現在 H1 上方的 `<p class="kicker">`；EN H1 是「Train as a Team. Respond with Confidence.」。18 頁三語都一樣（`ProductLanding.astro`、`SolutionLanding.astro` → `PageHero` 的 title＝headline）。`<title>` 有包含產品名。
- 影響：H1 是頁面主題的重要訊號；口號式 H1 會讓搜尋引擎與 AI 較難把頁面對應到產品名稱與用途。
- 建議：讓 H1 包含產品名（例如名稱放進 H1、口號改為副標），或在 H1 中同時呈現兩者。屬於版型調整。
- ChatGPT：否（版型）；如需調整文案，屬於 P3。

### T-08｜P2｜可索引頁面出現內部製作備註「素材需求｜…」
- 證據：繁中 12 個產品頁與 6 個解決方案頁，每頁有 4–15 個圖片佔位，`role="img"`，可見文字與 aria-label 都是「素材需求｜SUT 實際訓練照片（16:9）」這類內部備註；英日顯示「Product image」。
- 影響：搜尋引擎與 AI 會把這些備註當作頁面內容（可能出現在摘要或 AI 回答中）；也是 C-12 的另一面。
- 建議：正式上線前補上照片，或在正式 build 中不輸出備註文字（保留版面即可）。
- ChatGPT：否（業主提供素材）。交叉：A-09、C-12。

### T-09｜P2｜英日 SUT 圖片 Alt 是中文
- 見 C-11（03 文件）。影響：英日的圖片搜尋與無障礙。ChatGPT：是。

### T-10｜P4｜標題跳級 H1→H3
- 證據：`/{tw,en,jp}/solutions/` 的四張領域卡片是 H3，前面沒有 H2（`src/pages/[lang]/solutions/index.astro`）。
- 建議：加上區塊 H2，或把卡片標題改為 H2。ChatGPT：否。

### T-11｜P4｜沒有斜線的網址用 307（暫時）轉址
- 證據〔本機 Worker〕：`/tw/products` → 307 → `/tw/products/`；`/tw/products/sut/index.html` → 307。這是 Cloudflare 靜態資源的預設行為（`html_handling`），canonical 一律指向有斜線的版本。
- 影響：輕微。307 是暫時轉址，但 canonical 一致。
- 建議：線上確認狀態碼；如果需要，設定為永久轉址。待線上驗證。ChatGPT：否。

### T-12｜P4｜404 頁沒有品牌、語言與導覽
- 證據〔本機 Worker〕：任何不存在的網址都回傳 Astro 預設頁「404: Not Found」，`lang="en"`，沒有選單與連結；repo 沒有 `src/pages/404.astro`。
- 建議：建立三語 404 頁，附上主要導覽。ChatGPT：是（少量 UI 文案）。

### T-13｜P4｜效能（Lab，不是真實使用者數據）
| 頁面 | Perf | FCP | LCP | TBT | CLS |
|---|---|---|---|---|---|
| /tw/products/sut/ | 89 | 2.1 s | 3.5 s | 0 | 0.002 |
| /en/products/sut/ | 96 | 2.1 s | 2.4 s | 0 | 0.002 |
| /jp/products/sut/ | 92 | 2.6 s | 2.7 s | 0 | 0.001 |
| /tw/products/ | 95 | 2.1 s | 2.6 s | 0 | 0 |
| /tw/solutions/military/ | 96 | 2.1 s | 2.4 s | 0 | 0.002 |
- 風險：繁中 SUT 頁的 LCP 3.5 s 超過 2.5 s 的「良好」門檻（模擬行動網路）；render-blocking 約 600–750 ms；CJK 字型 CSS（noto-sans-tc.css 108 KB、noto-sans-jp.css 100 KB）有大量未使用的 CSS（105–212 KB）。快取標頭是本機的值，不代表正式環境（`_headers` 只對 `/_astro/*` 設定 immutable）。
- 真實使用者的 Core Web Vitals：**尚無數據，無法驗證**（需要 Search Console／CrUX）。
- ChatGPT：否。

### T-14｜P4｜Sitemap 沒有 lastmod
- 證據：`sitemap.xml` 只有 loc 和 xhtml:link。建議：加入 lastmod（取自 updatedAt）。ChatGPT：否。

### T-15｜P4｜robots.txt 沒有排除後台路徑
- 證據：`robots.txt` 只有 `Allow: /`；`/_emdash/admin` 302 到設定頁，`/_emdash/api/setup/status` 200 JSON（〔本機 Worker〕）。正式環境預計用 Cloudflare Access 保護（`docs/DEPLOY.md` §2.6）。
- 建議：考慮加上 `Disallow: /_emdash/`；線上確認 Access 已生效。ChatGPT：否。

### T-16｜P0（驗證）｜線上狀態全部待驗證
上線前必須在正式網域確認：DNS 與 HTTPS、`/robots.txt` 實際內容（是否被 Cloudflare 改寫，見 A-01）、`/sitemap.xml` 回應 200、實際狀態碼與轉址（T-01、T-02、T-11）、X-Robots-Tag、Cloudflare Bot Fight Mode／WAF 對 Googlebot 的影響、正式 build 是否用 `BXR_CONTENT_SOURCE=emdash`（bootstrap 模式會讓全站 noindex＋Disallow）、Search Console 的網址檢查與 sitemap 提交。目前全部：**待線上驗證**。

## 2. 連結結構與深度〔建置〕
- 每頁都有相同的 Header／Footer，導覽一層就能到所有主要分類（產品總覽、解決方案總覽、公司各頁、聯絡）。
- 從 `/tw/products/` 出發：12 個產品頁 1 次點擊；4 個領域方案 2 次；MUM-T、NOVA 3 次（只能從軍事模擬頁或相關卡片進入，各只有 3 個內部連結）。
- 繁中產品頁的站內反向連結數：SUT 13、USV 8、UAV 7、其他 4–5。智慧城市、MUM-T、NOVA 方案頁各 3。
- 從 `/` 出發：0 頁（根目錄 404，T-01）。
- `/tags/` 只能透過語言切換到達（三語 noindex，影響小）。
- 帶參數的連結：每個產品／方案的 CTA 連到 `/{lang}/contact/?topic=…&item=…`；產品篩選用 `?domain=`。兩者 canonical 都指向沒有參數的網址，不會造成重複內容。
- 重複內容：英日 [待翻譯] 佔位頁顯示中文，與繁中內容重複，但都是 noindex，風險已被控制；翻譯完成前不要改成 index。

## 3. JavaScript 依賴〔建置〕
- 不依賴 JS 的內容：所有正文、FAQ 答案（`<details>`）、下拉選單、相關卡片。
- 依賴 JS 的內容：搜尋結果（Pagefind，頁面 noindex）、產品篩選的結果數、聯絡頁依網址參數切換洽詢項目（預設的「一般洽詢」在 HTML 中）、FAQ「一次只展開一題」。都不影響可被索引的內容。
- 字型用 `rel=preload`＋onload 載入，`<noscript>` 有備援。
