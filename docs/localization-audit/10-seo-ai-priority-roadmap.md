# 10｜總結：整合優先修復清單

版本：commit `5917f20`（網站內容＝main `36f211d`）。方法與驗證層級：見 01。本次只稽核，沒有任何修改。
排名、流量、AI 引用數據：尚無數據，無法驗證。線上狀態：本環境無法連線，全部待線上驗證。

## 1. 數量總覽
- 頁面：三語各 31 頁；英日與繁中完整對應 0 頁；精簡版 12；改寫且缺區塊 7；[待翻譯] 佔位 12；三語都不存在 3（首頁、核心技術、隱私權）。
- 產品內容：TW 282 個項目／60 題 FAQ／125 個圖片位置；EN 與 JP 73 個項目／0 題／0 個。
- 介面字串：297 個中，EN 201、JP 150 個未翻譯。
- 技術：每頁 2 個壞連結（93 頁）；hreflang 問題 57 筆；根目錄 404；舊網址沒有 301。
- 問題數（以表列計，K 系列合併）：P0 5、P1 11、P2 15、P3 10、P4 7。

## 2. 全部問題（依優先級）
欄位：ID｜頁面｜語言｜問題｜證據（檔案）｜SEO／AI 影響｜修復建議｜ChatGPT

### P0
| ID | 頁面 | 語言 | 問題 | 證據 | 影響 | 修復 | ChatGPT |
|---|---|---|---|---|---|---|---|
| T-01 | / 與 /{lang}/ | 全部 | 根目錄 301→/en/→404；沒有首頁 | astro.config.mjs redirects；src/pages/[lang]/ 沒有 index | 從根目錄進站失敗；品牌搜尋與網站名稱；每頁的首頁連結失效 | 建立首頁（先 TW）；在此之前決定 / 的暫時轉址目標 | 是（先寫繁中） |
| T-02 | 舊網址 | 全部 | 舊網址沒有 301 | docs/legacy-urls.md；_redirects | 換站後失去舊索引與外部連結 | 取得舊站網址清單並實作 301 | 否 |
| T-16 | 全站 | 全部 | 線上狀態未驗證（DNS、robots、sitemap、狀態碼、X-Robots-Tag、WAF、build 模式） | 本環境 403 | 可能整站無法被抓取而不自知 | 上線前逐項驗證；提交 Search Console | 否 |
| A-01 | robots.txt | 全部 | Cloudflare AI 爬蟲封鎖或代管 robots.txt 的狀態未知 | 只有 repo 輸出的 Allow:/ | AI 搜尋爬蟲可能被擋 | 檢查 Cloudflare 後台並讀取線上 robots.txt | 否 |
| — | 正式 build | 全部 | 必須使用 BXR_CONTENT_SOURCE=emdash；bootstrap 會讓全站 noindex＋Disallow | src/lib/content-source.ts | 全站不被索引 | 部署後檢查 robots 與 meta robots | 否 |

### P1
| ID | 頁面 | 語言 | 問題 | 證據 | 影響 | 修復 | ChatGPT |
|---|---|---|---|---|---|---|---|
| C-01 | 12 個產品頁 | EN／JP | 精簡版，缺簡介、流程、各區說明 | 03；src/content/products/{en,jp} | 主題深度不足，AI 可引用的內容少 | 依 TW 全文重寫（需業主同意取代定稿） | 是（翻譯，原文在 03） |
| C-02 | 18 個產品與方案頁 | JP | 日文是從英文翻譯 | 03／04 | 繼承英文的缺漏與無依據內容 | 日文改為直接依 TW 翻譯 | 是 |
| C-07／A-02／S-05 | 12 個產品頁 | EN／JP | 沒有 FAQ（TW 60 題） | src/content/products/tw/*.md faq | 缺少問答、範圍聲明與 FAQPage | 翻譯並填入 faq 欄位 | 是（原文在 03） |
| C-03 | 解決方案總覽＋6 頁 | EN／JP | 改寫、缺區塊 | 04 | 同 C-01 | 依 TW 重寫 | 是（原文在 04） |
| C-04／T-05 | products、company、contact、cases、news、insights、search、tags、history、team、partners、investors；整合情境 | EN／JP | [待翻譯] 佔位；其中 products、company、contact 因此 noindex 且不在 sitemap | src/content/pages/{en,jp}/*.md | 英日沒有產品中心頁與公司頁可以被索引 | 翻譯，並把狀態改為 translated | 是（原文在 04） |
| C-05 | 全站 UI | EN 201／JP 150 | 介面字串未翻譯 | src/content/ui/*.json | 頁面上出現中文 | 翻譯 | 是（原文在 02） |
| C-06 | contact | EN／JP | 聯絡頁與 Email 範本是中文 | 02 §6 | 轉換流程失效 | 翻譯 contactPage.* | 是 |
| T-03 | 全部 93 頁 | 全部 | 核心技術、隱私權政策 404 | Header.astro、Footer.astro | 壞連結；信任訊號 | 建立兩頁（先 TW） | 是（先寫繁中） |
| T-06 | /tw/products/ | TW（可索引） | meta description 與可見文字是 [待提供] | pages/tw/products.md | 摘要可能顯示 [待提供] | 先寫繁中 | 是（先寫繁中） |
| A-03 | 全站 | EN／JP（TW 只在 FAQ） | 沒有嚴肅遊戲的定義；可能被誤認為娛樂遊戲 | 07 §A-03 | 被錯誤分類 | 翻譯 FAQ 第一題；在公司或技術頁加入定義段落 | 是（先寫繁中） |
| A-07 | company、Organization | EN／JP | 公司實體資訊不足 | 07 | AI 對品牌的理解 | 翻譯公司頁；業主提供事實資料 | 是 |

### P2
| ID | 頁面 | 語言 | 問題 | 證據 | 修復 | ChatGPT |
|---|---|---|---|---|---|---|
| T-04 | /tw/{products,company,contact}/ 等 | 全部 | hreflang 指向 noindex 頁；與 sitemap 不一致 | SeoHead.astro vs sitemap.xml.ts | 用同一規則輸出 hreflang | 否 |
| T-07 | 18 個 landing 頁 | 全部 | H1 是口號，不是產品名 | PageHero title＝headline | H1 包含產品名 | 否 |
| T-08／A-09 | 18 頁 | TW（英日是通用佔位） | 可見的「素材需求｜…」內部備註 | ProductLanding／ImagePlaceholder | 提供照片，或正式 build 不輸出備註 | 否 |
| T-09／C-11 | 11 頁 | EN／JP | SUT 圖片 Alt 是中文 | products/{en,jp} 沒有 hero.image.alt | 補 Alt | 是 |
| C-12 | 18 頁 | EN／JP | 沒有圖片位置、Alt 與圖說 | 03 | 英日檔案補上圖片位置 | 是（Alt） |
| C-08 | 多頁 | EN／JP | 繁中沒有的內容 | 05 §2 | 業主確認後刪除或補入 TW | 是 |
| C-09 | 產品與方案 CTA | EN／JP | 「洽詢」被寫成 Explore／詳細を見る | 02 §5 | 依 TW 語意 | 是 |
| C-10／S-03 | Footer、Organization | EN／JP | 缺法定公司名稱 | site.json | 業主提供 | 否 |
| C-13／A-05 | 多頁 | 全部 | 名稱不一致 | 05 §3 | 建立三語命名表 | 是（業主定案後） |
| A-04 | MUM-T、產品總覽、SUT、Counter-UAS | 全部 | 整合能力說法不一 | 07 | 業主確認後統一 | 是 |
| A-06 | 兵棋、迫擊砲、滅火、機槍 | TW | 主文與 FAQ 不一致 | 07 | 業主確認後統一 | 是 |
| S-01 | 全站 | 全部 | Organization.url 指向 404 | SeoHead.astro | 隨 T-01 修正 | 否 |
| S-02 | 全站 | 全部 | Breadcrumb 首項指向 404 | SeoHead.astro | 隨 T-01 修正 | 否 |
| S-04 | 首頁 | 全部 | 沒有 WebSite 節點 | — | 與首頁一起加入 | 否 |
| K-21 | 消防產品 vs 消防方案等 | 全部 | 主題重疊、自我競爭 | 09 | 頁面分工（業主決定） | 是 |

### P3
| ID | 頁面 | 問題 | ChatGPT |
|---|---|---|---|
| K-01～K-12 | 產品頁 | 採購與導入型問題缺少（部署、空間、設備規格），需要業主提供數據 | 是（數據提供後撰寫） |
| K-13～K-20 | 方案頁、總覽 | 沒有 FAQ 與定義型問答 | 是（先寫繁中） |
| A-08 | 方案頁 | 比較型內容只有產品 FAQ 有 | 是 |
| A-10 | 案例、新聞 | 沒有可引用的實證內容 | 是（業主提供素材） |
| A-11 | technologies | 沒有技術名詞的定義頁 | 是 |
| A-12 | 多頁 | 規格宣稱需要業主確認；英日沒有範圍聲明 | 是 |
| S-06 | 產品頁 | Product 沒有 image | 否 |
| S-07 | 產品頁 | EN／JP Product.description 是精簡版 | 是（隨 C-01） |
| S-08 | 方案頁 | 可選擇加入 WebPage | 否 |
| C-14 | TW 母版 | [待提供] 與未建立的頁面 | 是（先寫繁中） |

### P4
T-10 H1→H3 跳級（solutions 總覽）；T-11 307 轉址；T-12 404 頁；T-13 Lab LCP 3.5 s（tw SUT）與 render-blocking 字型 CSS；T-14 sitemap 沒有 lastmod；T-15 robots 沒有排除 /_emdash/；日文版權用語與 UI 標籤語意（02 §3、§7）。

## 3. 依頁面合併的修復清單（同一頁的所有工作一次處理）
| 頁面 | TW | EN／JP | 技術、SEO、Schema | 先決條件 |
|---|---|---|---|---|
| 首頁 | 建立（T-01、C-14） | 建立 | WebSite（S-04）；Breadcrumb、Org url（S-01、S-02） | 繁中首頁文案 |
| 核心技術、隱私權政策 | 建立（T-03、A-11、A-03 定義段落） | 建立 | — | 繁中文案 |
| 產品總覽 | 補 [待提供]（T-06） | 翻譯（C-04）、Alt（C-11） | 改為 translated 後 index（T-05、T-04） | 繁中說明 |
| 12 個產品頁 | 統一主文與 FAQ（A-06）；用詞（C-13）；補採購資訊（K-01～K-12）；照片（T-08） | 依 TW 重寫全部區塊＋FAQ（C-01、C-02、C-07）；刪除無依據內容（C-08）；CTA（C-09）；Alt 與圖片位置（C-11、C-12） | H1 含產品名（T-07）；FAQPage 自動輸出（S-05）；Product image（S-06） | 業主同意取代英日定稿；三語命名表 |
| 6 個解決方案頁＋總覽 | 統一 MUM-T 與整合說法（A-04）；可新增 FAQ（K-13～K-19）；與產品頁分工（K-21） | 依 TW 重寫（C-03） | H1（T-07）；總覽標題層級（T-10） | 同上 |
| company | — | 翻譯（C-04、A-07） | index | — |
| contact | — | 翻譯＋Email 範本（C-06） | index | — |
| 列表頁、公司子頁 | 補 [待提供] 說明 | 翻譯 | 有內容後自動 index | 有內容 |
| 全站 UI | — | 翻譯 201／150 個字串（C-05） | — | — |
| 全站設定 | site.json 事實資料（C-10、S-03） | 同 | 舊網址 301（T-02）；hreflang 規則（T-04）；404 頁（T-12）；線上驗證（T-16、A-01） | 業主提供 |

建議順序：
1. 業主決策：取代英日定稿、三語命名表、確認整合清單、確認無依據項目。
2. P0 線上驗證與 T-01、T-02。
3. ChatGPT 依 TW 產出英日（產品 → 方案 → 頁面 → UI），由 Claude Code 寫入內容檔。
4. P2 程式項目（T-04、T-07、T-08）。
5. P3／P4。

## 4. 交由 ChatGPT 的工作與繁中原文位置
| 工作 | 繁中原文位置 | 輸出到 |
|---|---|---|
| 12 個產品頁英日全文（含 5 題 FAQ、圖片 Alt 與圖說） | 03「繁中原文」各段（逐字） | src/content/products/{en,jp}/*.md 的 landing、faq、hero.image.alt |
| 6 個解決方案頁英日全文 | 04 §10 | src/content/solutions/{en,jp}/*.md |
| 頁面文案（products、company、contact、cases 等） | 04 §11 | src/content/pages/{en,jp}/*.md |
| 整合訓練情境（MUM-T、Counter-UAS） | 04 §11 | src/content/scenarios/{en,jp}/*.md |
| 介面字串 201 個 | 02 附錄 A | src/content/ui/{en,jp}.json |
| 需要先寫繁中的文案 | 不存在（C-14、T-01、T-03、T-06、A-03、K-13～K-20） | 先 TW，再英日 |

給 ChatGPT 的規則：
1. 只依繁中原文翻譯，不使用目前的英日定稿作為來源。
2. 不新增繁中沒有的功能、規格或應用（見 05 §2 的「無依據」清單）。
3. 保留所有範圍聲明（「依配置確認」「不能完全取代」「不等同實際設備」）。
4. 名稱依業主核定的三語命名表。
5. 保留介面字串中的 `{n}`、`{q}`、`{total}` 變數。
