# 01｜頁面總清單、稽核方法與文件索引

> 稽核日期：2026-10-21
> 稽核版本：commit `5917f20`（＝ `main` @ `36f211d` 加上本稽核文件；網站程式碼與內容和 `main` 完全相同）。`36f211d` 已包含 PR #19「繁中產品頁常見問題（FAQ）＋FAQPage JSON-LD」。
> 母版：繁體中文 `/tw/`。比對對象：英文 `/en/`、日文 `/jp/`。
> 本次只稽核、不修改：沒有修改網站原始碼或內容、沒有翻譯、沒有補寫文案、沒有建立頁面、沒有部署。

本系列共 10 份報告。三語內容稽核與 SEO／AI 稽核**同步進行**，兩條工作線共用同一份頁面清單（本文件 §3）、同一次 Astro 建置，以及同一份原始碼分析。

---

## 1. 文件索引

| # | 文件 | 內容 | 問題編號 |
|---|---|---|---|
| 01 | 本文件 | 頁面總清單、方法、驗證層級、編號規則 | — |
| 02 | [02-shared-ui-and-site-data.md](02-shared-ui-and-site-data.md) | Header、選單、Footer、Breadcrumb、CTA、聯絡頁、介面文字、站點資料（含未翻譯字串的繁中原文） | C-05、C-06、C-09、C-10 |
| 03 | [03-product-pages-content.md](03-product-pages-content.md) | 12 個產品頁三語逐區比對（含每頁完整繁中原文） | C-01、C-02、C-07、C-11、C-12 |
| 04 | [04-solutions-and-other-pages-content.md](04-solutions-and-other-pages-content.md) | 解決方案總覽、6 個解決方案頁、公司與列表頁（含完整繁中原文） | C-03、C-04 |
| 05 | [05-content-gap-summary.md](05-content-gap-summary.md) | 三語缺漏統計、英日新增內容（原則 9）、繁中母版本身的缺口 | C-08、C-13、C-14 |
| 06 | [06-technical-seo-audit.md](06-technical-seo-audit.md) | HTTP、索引、robots、Sitemap、Canonical、hreflang、標題層級、圖片、連結、效能 | T-01～T-16 |
| 07 | [07-ai-search-readiness.md](07-ai-search-readiness.md) | AI 搜尋可讀性、FAQ、嚴肅遊戲概念、宣稱一致性、AI 爬蟲存取 | A-01～A-12 |
| 08 | [08-structured-data-audit.md](08-structured-data-audit.md) | Schema.org／JSON-LD 驗證與錯誤清單 | S-01～S-08 |
| 09 | [09-seo-content-gaps.md](09-seo-content-gaps.md) | 每個產品與解決方案頁的搜尋意圖、缺少的問題、三語優化方向 | K-01～K-21 |
| 10 | [10-seo-ai-priority-roadmap.md](10-seo-ai-priority-roadmap.md) | **總結報告**：整合優先修復清單（依頁面合併）、交由 ChatGPT 的工作清單 | 全部 |

本報告取代先前的 `docs/I18N-CONTENT-AUDIT.md`（第一階段單一報告）。該報告的內容已依新版 `main` 更新後拆入 01–05。主要更新是新增的繁中 FAQ：英日完全沒有對應內容（C-07）；另外，原本列為「英日新增」的部分宣稱，在繁中 FAQ 中找到了依據，§C-08 已重新判定。

---

## 2. 方法與驗證層級

每個發現都標示它是在哪一層驗證的：

| 標記 | 驗證層級 | 本次做法 | 結果 |
|---|---|---|---|
| 〔原始碼〕 | 閱讀 repo 原始碼與內容檔 | `src/**`、`astro.config.mjs`、`wrangler.jsonc`、`src/content/**`、`src/data/site.json` | 已完成 |
| 〔建置〕 | Astro 建置產物 | `npm run build`（`BXR_CONTENT_SOURCE=markdown`）→ `dist/client/`，三語 93 個 HTML、`sitemap.xml`、`robots.txt`、`_redirects`、`_headers` 全部解析 | 已完成 |
| 〔本機 Worker〕 | 以建置產物啟動 Cloudflare Worker | `wrangler dev -c dist/server/wrangler.json --local`，用 curl 取得實際 HTTP 狀態碼、轉址與標頭 | 已完成（本機模擬，不等於正式網路環境） |
| 〔Lab〕 | Lighthouse 13.5（行動裝置預設節流） | `scripts/qa-lighthouse.mjs`，5 頁 | 已完成（實驗室數據，不是真實使用者數據） |
| 〔線上〕 | 正式網域 `www.bigxreality.com`、GitHub Pages 預覽站 | curl 與 WebFetch 都無法連線：本雲端環境的網路政策拒絕這些主機（proxy 回應 403），WebFetch 也無法解析網域 | **未完成，列為「待線上驗證」** |
| 〔數據〕 | Google Search Console、排名、關鍵字流量、AI 引用 | 未取得 | **尚無數據，無法驗證** |

**資料來源限制**：正式站的內容來源是 EmDash CMS（Cloudflare D1），本次無法存取。本次稽核的是 repo 內的 Markdown，它是預覽站的來源，也是匯入 CMS 的原始檔。正式 build（`BXR_CONTENT_SOURCE=emdash`）使用相同的版型與 SEO 元件；只要 CMS 內容和 Markdown 相同，輸出的 HTML 就會相同。如果之後在後台修改過內容，需要重新比對。

**數字怎麼算**：「小標」是 `<main>` 內的 h3／h4（含相關卡片）；「字數」是 `<main>` 內所有可見文字的字元數，包含三語共用的相關卡片，所以英日的實際落差比表中數字更大。

---

## 3. 頁面總清單（兩條稽核線共用）

圖例：⛔ 英日仍是「[待翻譯]＋中文」佔位　⚠️ 有頁面但內容不完整　❌ 頁面不存在

繁中母版共 31 個已建立的頁面；英日都有相同的 31 個網址，沒有「繁中有、英日沒有」的頁面。

| # | 路徑 | 繁中 H1 | EN／JP 內容狀態 | 索引 TW/EN/JP | Sitemap TW/EN/JP | 本機 HTTP | 相關問題 |
|---|---|---|---|---|---|---|---|
| 1 | `/{lang}/products/` | 產品 | ⛔ | index/noindex/noindex | ✅/—/— | 200 | C-04 |
| 2 | `/{lang}/products/sut/` | 真正的戰術默契，來自每一次協同行動 | ⚠️ 精簡版，無 FAQ | index/index/index | ✅/✅/✅ | 200 | C-01, C-02, C-07 |
| 3 | `/{lang}/products/uav/` | 從掌握空中任務，到應對低空威脅 | ⚠️ 精簡版，無 FAQ | index/index/index | ✅/✅/✅ | 200 | C-01, C-02, C-07 |
| 4 | `/{lang}/products/usv/` | 讓無人船任務訓練，從虛擬海域開始 | ⚠️ 精簡版，無 FAQ | index/index/index | ✅/✅/✅ | 200 | C-01, C-02, C-07 |
| 5 | `/{lang}/products/wargaming-table/` | 整合多元訓練資訊，建構更完整的指揮決策視野 | ⚠️ 精簡版，無 FAQ | index/index/index | ✅/✅/✅ | 200 | C-01, C-02, C-07 |
| 6 | `/{lang}/products/mortar-observation/` | 讓砲兵觀測訓練，不再受限於單一戰場情境 | ⚠️ 精簡版，無 FAQ | index/index/index | ✅/✅/✅ | 200 | C-01, C-02, C-07 |
| 7 | `/{lang}/products/sniper-simulator/` | 精準射擊的訓練，從理解每一項環境變因開始 | ⚠️ 精簡版，無 FAQ | index/index/index | ✅/✅/✅ | 200 | C-01, C-02, C-07 |
| 8 | `/{lang}/products/machine-gun-simulator/` | 讓射擊訓練，從操作熟悉延伸至任務判斷 | ⚠️ 精簡版，無 FAQ | index/index/index | ✅/✅/✅ | 200 | C-01, C-02, C-07 |
| 9 | `/{lang}/products/hmmwv-simulator/` | 讓軍用車輛駕駛訓練，延伸至更多任務情境 | ⚠️ 精簡版，無 FAQ | index/index/index | ✅/✅/✅ | 200 | C-01, C-02, C-07 |
| 10 | `/{lang}/products/tactical-boat-simulator/` | 讓海上操艇訓練，從可控的模擬環境開始 | ⚠️ 精簡版，無 FAQ | index/index/index | ✅/✅/✅ | 200 | C-01, C-02, C-07 |
| 11 | `/{lang}/products/full-scale-police-training/` | 讓警勤訓練走進更接近真實的勤務現場 | ⚠️ 精簡版，無 FAQ | index/index/index | ✅/✅/✅ | 200 | C-01, C-02, C-07 |
| 12 | `/{lang}/products/police-box/` | 讓警勤模擬訓練，不再受限於固定場域 | ⚠️ 精簡版，無 FAQ | index/index/index | ✅/✅/✅ | 200 | C-01, C-02, C-07 |
| 13 | `/{lang}/products/fire-extinguisher-simulator/` | 從認識火災到實際操作，讓滅火訓練更接近真實應變 | ⚠️ 精簡版，無 FAQ | index/index/index | ✅/✅/✅ | 200 | C-01, C-02, C-07 |
| 14 | `/{lang}/solutions/` | 從專業訓練到智慧應用，打造虛實整合的全方位解決方案 | ⚠️ 改寫，區塊缺漏 | index/index/index | ✅/✅/✅ | 200 | C-03 |
| 15 | `/{lang}/solutions/military/` | 從單兵戰技到聯合作戰，建立多層級軍事模擬訓練體系 | ⚠️ 改寫，區塊缺漏 | index/index/index | ✅/✅/✅ | 200 | C-03 |
| 16 | `/{lang}/solutions/police/` | 讓警勤訓練更貼近真實勤務，從操作熟練走向情境應變 | ⚠️ 改寫，區塊缺漏 | index/index/index | ✅/✅/✅ | 200 | C-03 |
| 17 | `/{lang}/solutions/fire-rescue/` | 讓消防與防災教育，從知識學習走向實際操作 | ⚠️ 改寫，區塊缺漏 | index/index/index | ✅/✅/✅ | 200 | C-03 |
| 18 | `/{lang}/solutions/smart-city/` | 讓城市資訊更直觀，讓數位模擬延伸更多智慧應用 | ⚠️ 改寫，區塊缺漏 | index/index/index | ✅/✅/✅ | 200 | C-03 |
| 19 | `/{lang}/solutions/mum-t/` | 讓小隊成員掌握共同任務，建立更緊密的戰術協同 | ⚠️ 改寫，區塊缺漏 | index/index/index | ✅/✅/✅ | 200 | C-03 |
| 20 | `/{lang}/solutions/nova/` | 整合不同訓練系統，延伸更大規模的聯戰模擬能力 | ⚠️ 改寫，區塊缺漏 | index/index/index | ✅/✅/✅ | 200 | C-03 |
| 21 | `/{lang}/company/` | 虛擬訓練．真實應變．守護未來 | ⛔ | index/noindex/noindex | ✅/—/— | 200 | C-04 |
| 22 | `/{lang}/company/history/` | 發展歷程 | ⛔ | noindex/noindex/noindex | —/—/— | 200 | C-04 |
| 23 | `/{lang}/company/team/` | 經營團隊 | ⛔ | noindex/noindex/noindex | —/—/— | 200 | C-04 |
| 24 | `/{lang}/company/partners/` | 合作夥伴 | ⛔ | noindex/noindex/noindex | —/—/— | 200 | C-04 |
| 25 | `/{lang}/company/investors/` | 投資人專區 | ⛔ | noindex/noindex/noindex | —/—/— | 200 | C-04 |
| 26 | `/{lang}/contact/` | 聯絡我們 | ⛔ | index/noindex/noindex | ✅/—/— | 200 | C-04, C-06 |
| 27 | `/{lang}/cases/` | 成功案例 | ⛔ | noindex/noindex/noindex | —/—/— | 200 | C-04 |
| 28 | `/{lang}/news/` | 消息 | ⛔ | noindex/noindex/noindex | —/—/— | 200 | C-04 |
| 29 | `/{lang}/insights/` | 技術文章 | ⛔ | noindex/noindex/noindex | —/—/— | 200 | C-04 |
| 30 | `/{lang}/search/` | 搜尋 | ⛔ | noindex/noindex/noindex | —/—/— | 200 | C-04 |
| 31 | `/{lang}/tags/` | 標籤 | ⛔ | noindex/noindex/noindex | —/—/— | 200 | C-04 |
| 32 | `/{lang}/` | （首頁） 未建立 | ❌ 三語皆無 | — | — | 404 | T-01, T-03, C-14 |
| 33 | `/{lang}/technologies/` | （核心技術） 未建立 | ❌ 三語皆無 | — | — | 404 | T-01, T-03, C-14 |
| 34 | `/{lang}/privacy/` | （隱私權政策） 未建立 | ❌ 三語皆無 | — | — | 404 | T-01, T-03, C-14 |

說明：
- 「索引」取自建置 HTML 的 `<meta name="robots">`；「Sitemap」取自建置後的 `sitemap.xml`（共 60 個網址，全部是存在且可索引的頁面）。
- 「本機 HTTP」取自〔本機 Worker〕。正式網域的狀態碼「待線上驗證」。
- 列表頁（消息、技術文章、案例、標籤）和公司子頁在三語都還沒有資料，所以三語都是 `noindex`。這是程式設計好的規則（沒有內容就不索引），不是錯誤。
- 投資人模組子頁（`/company/investors/{module}/`）沒有資料時不會產生頁面，三語相同。

---

## 4. 問題編號與優先級

### 4.1 編號規則
| 前綴 | 文件 | 範圍 |
|---|---|---|
| C-xx | 02–05 | 三語內容完整性 |
| T-xx | 06 | 技術 SEO、Googlebot |
| A-xx | 07 | AI 搜尋可讀性與 AI 爬蟲 |
| S-xx | 08 | 結構化資料 |
| K-xx | 09 | 搜尋意圖與 SEO 內容缺口 |

同一個問題只編一個主編號，其他報告用「→ 見 X-xx」交叉引用，不會重複計算。

### 4.2 優先級（採用最新指令；P4 沿用第一份指令的定義）
| 等級 | 定義 |
|---|---|
| **P0** | 阻礙爬蟲抓取或索引的重大問題（包含上線前必須完成的線上驗證） |
| **P1** | 缺少頁面、缺少重要內容區塊、三語版本不完整 |
| **P2** | Canonical、hreflang、結構化資料、內部連結與語意問題 |
| **P3** | 常見問題、搜尋意圖、內容深度與 AI 引用機會 |
| **P4** | 次要視覺、效能與維護改善 |

### 4.3 「是否需要 ChatGPT 提供正式文案」
- **是（翻譯）**：繁中母版已有原文，需要依母版撰寫正式英日文。繁中原文已完整保留在 02、03、04。
- **是（先寫繁中）**：繁中母版本身就缺文案（例如「[待提供]」），需要先撰寫繁中，再翻譯英日。
- **否**：屬於程式、設定或業主確認事項。
