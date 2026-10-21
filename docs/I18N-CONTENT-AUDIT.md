# BXR 官網｜繁中、英文、日文全站內容完整性稽核報告

> 稽核日期：2026-10-21
> 稽核版本：`main` @ `33a2693`（PR #18 合併後）
> 比對原則：以繁中 `/tw/` 為唯一內容標準（Source of Truth），逐頁比對 `/en/`、`/jp/` 的實際頁面內容。
> 本次只做盤點、比對與報告：**沒有修改任何網站程式碼或內容檔，也沒有翻譯、補寫或刪除內容。**

---

## 0. 結論摘要

| # | 發現 | 嚴重度 |
|---|---|---|
| 1 | 三語頁面數量一致，各 31 頁，沒有「中文有、英日沒有」的頁面。但**內容層級的落差很大**。 | — |
| 2 | **12 個產品頁的英文、日文都是精簡版。** 繁中每頁有 26–30 個小標（兵棋圖台為 15）、50–69 段文字（兵棋圖台為 33）、9–16 個圖片位置；英日只有 8–9 個小標、12–14 段、2–4 個圖片位置。日文字數只有繁中的 24%–48%。「訓練流程」在英日全部缺漏；「訓練挑戰」「解決方式」「應用情境」「導入價值」都被壓縮成一句話。 | P1 |
| 3 | **日文是從英文稿翻譯的，不是從繁中翻譯。** 18 個產品／解決方案檔案中，日文的區塊結構與英文完全相同（逐檔驗證）。所以英文的缺漏與新增內容，日文全部繼承。 | P1 |
| 4 | **6 個解決方案頁與解決方案總覽頁：英日另寫了不同的結構。** 繁中的部分區塊在英日沒有對應，例如警勤「訓練流程」5 步驟、消防「適用訓練需求」與其免責說明、NOVA「應用情境」4 項，以及各頁「導入價值」卡片。 | P1 |
| 5 | **英日有繁中沒有的功能或應用宣稱**（違反原則 9），例如兵棋圖台的「觸控操作」「VR 視覺化」、BOX 的「附輪箱體」、滅火訓練的「選擇滅火器」練習、機槍的「射控」「目標接戰」。完整清單見 §7。 | P0 |
| 6 | **12 個頁面的英日仍是「[待翻譯]＋中文」佔位**：產品總覽、關於我們、聯絡我們，以及列表頁和公司子頁。頁面上直接顯示中文，而且全部設為 `noindex`。 | P0 |
| 7 | **介面文字（`src/content/ui/*.json`）**：296 個字串中，英文有 200 個、日文有 149 個仍是「[待翻譯] 中文」。 | P0／P1 |
| 8 | **聯絡頁（Email 洽詢）在英日完全沒有翻譯**：說明文字、洽詢項目，連寄出的 Email 主旨與內文格式都是中文加上「[待翻譯]」。 | P0 |
| 9 | **CTA 語意不一致**：繁中按鈕是「洽詢 ○○」（前往聯絡頁），英文是「Explore …」，日文是「…の詳細を見る」（查看詳細），但按鈕實際連到的是聯絡頁。英日結尾 CTA 一律是「Contact Our Team／担当者に相談する」，沒有說明文字；繁中每頁都有專屬標題與說明。 | P1 |
| 10 | **SEO**：英日的公司法定名稱是「[待提供]」（頁尾版權與 JSON-LD `legalName` 都缺）；英日的產品總覽、關於我們、聯絡我們被設成 `noindex`，也不在 sitemap 裡；SUT 圖片的 Alt 在英日 11 個頁面上是中文。 | P1 |
| 11 | **首頁、核心技術、隱私權政策**：繁中母版還沒建立，三語都是 404，無法比對。另外 `/` 會 301 轉到 `/en/`，這頁同樣不存在。 | 參考 |

**一句話總結：** 英日版的「頁面」都在，但「內容」沒有完整在地化。產品與解決方案頁使用的是另一份精簡的英文定稿（檔案註解寫著 *English copy approved by the owner (2026-10-21), used exactly as supplied*），日文再從英文翻譯；其餘 12 頁仍是中文佔位。

> **需要業主決定**：英日產品與解決方案檔案的開頭註解都寫明是「業主核准的定稿，逐字使用」。依照本次訂下的原則（繁中為母版、英日不得精簡），這份定稿不符合標準。要改用繁中全文重新在地化，需要業主同意取代這份已核准的定稿。
> 技術上不需要改程式：產品頁與解決方案頁的版型完全依照該語言檔案的 `landing` 欄位顯示，英日檔案只要比照繁中填入相同欄位（挑戰卡、支柱、能力、流程、情境、價值、圖片位置與 Alt），就會呈現和繁中相同的完整區塊。

---

## 1. 稽核方法

1. **實際建置網站**：用 `npm run build`（`BXR_CONTENT_SOURCE=markdown`，與 GitHub Pages 預覽站同一份來源）產生三語共 93 個頁面。
2. **比對實際輸出的 HTML**，不只比對翻譯檔：逐頁抽出 `<title>`、meta description、canonical、hreflang、Open Graph、Twitter、JSON-LD、Header／下拉選單／手機選單、Footer、Breadcrumb、每個 `<section>` 的小標、段落、清單、圖片 Alt、圖片位置、CTA 文字與連結、頁面上可見的「[待翻譯]」「[待提供]」標記。
3. **對照原始資料**：`src/content/{products,solutions,pages,scenarios}/{tw,en,jp}/*.md`、`src/content/ui/{tw,en,jp}.json`、`src/data/site.json`，以及實際使用這些資料的元件（`ProductLanding`、`SolutionLanding`、`Header`、`Footer`、`SeoHead`、`ContactPage`）。
4. **逐項閱讀語意**：12 個產品與 6 個解決方案的繁中全文，逐段對照英文；日文先驗證結構與英文相同，再抽查用語。

**限制**
- 正式站的內容來源是 EmDash CMS（Cloudflare D1），本次無法存取。本報告比對的是 repo 內的 Markdown（預覽站的來源，也是匯入 CMS 的原始檔）。如果之後在 CMS 後台修改過內容，需要再比對一次。
- 「字數」是 `<main>` 內所有可見文字，包含三語共用的相關卡片，所以英日的實際落差比表中數字更大。中、日文字數相近時，日文通常是繁中的 1.0–1.4 倍；完整英譯的字元數通常是繁中的 2.5–3.5 倍。
- 你的需求說明在「產品頁面 → 訓練挑戰與需求」之後中斷了。後續項目我依照繁中版實際有的區塊補齊：解決方式、核心能力、訓練流程、應用情境、導入價值、延伸應用、結尾 CTA、圖片、SEO，再加上解決方案、公司與其他頁面。

**嚴重度定義**
- **P0**：頁面上直接出現中文佔位或未翻譯文字、功能錯誤，或英日新增了中文沒有的產品功能宣稱。
- **P1**：繁中的重要資訊、區塊或清單在英日缺漏或被精簡。
- **P2**：名稱、用語、標籤、次要 SEO 不一致。

---

## 2. 頁面盤點（三語各 31 頁）

| 頁面 | TW | EN | JP | 說明 |
|---|---|---|---|---|
| `/{lang}/`（首頁） | ❌ 未建立 | ❌ | ❌ | 繁中母版未建立，無法比對。Logo 與麵包屑「首頁」都連到這頁（404）。 |
| `/technologies/`（核心技術） | ❌ 未建立 | ❌ | ❌ | 主選單、頁尾都有連結（404）。 |
| `/privacy/`（隱私權政策） | ❌ 未建立 | ❌ | ❌ | 頁尾有連結（404）。 |
| `/products/` 產品總覽 | ✅ | ⛔ 佔位 | ⛔ 佔位 | 英日的標題、H1、整合訓練情境、篩選介面都是「[待翻譯] 中文」，`noindex`。 |
| `/products/{12 項}/` | ✅ | ⚠️ 精簡版 | ⚠️ 精簡版 | 見 §5。 |
| `/solutions/` 解決方案總覽 | ✅ | ⚠️ 改寫 | ⚠️ 改寫 | 見 §6.1。 |
| `/solutions/{6 項}/` | ✅ | ⚠️ 改寫 | ⚠️ 改寫 | 見 §6。 |
| `/company/` 關於我們 | ✅ | ⛔ 佔位 | ⛔ 佔位 | 繁中 3 段公司介紹，英日只有「[待翻譯] 公司介紹」一行，`noindex`。 |
| `/company/history/` `team/` `partners/` `investors/` | ✅（無資料時的空狀態） | ⛔ 佔位 | ⛔ 佔位 | 英日標題、SEO、空狀態文字都是「[待翻譯] 中文」。 |
| `/contact/` 聯絡我們 | ✅ | ⛔ 佔位 | ⛔ 佔位 | 見 §4.6。 |
| `/cases/` 成功案例 | ✅ | ⛔ 佔位 | ⛔ 佔位 | 繁中有副標與 2 段說明；英日只有「[待提供]」，空狀態文字是「[待翻譯] 中文」。 |
| `/news/` `/insights/` `/search/` `/tags/` | ✅（說明是「[待提供]」） | ⛔ 佔位 | ⛔ 佔位 | 英日標題是「[待翻譯] 中文」，搜尋頁的提示訊息也是。 |

圖例：✅ 完整　⚠️ 有頁面但內容不完整　⛔ 中文佔位（[待翻譯]）　❌ 頁面不存在

---

## 3. 量化比對（實際輸出的 `<main>`）

| 頁面 | TW 小標／段落／字數 | EN 小標／段落／字數 | JP 小標／段落／字數 | JP 字數 ÷ TW | 圖片位置 TW/EN/JP |
|---|---|---|---|---|---|
| `/products/sut/` | 27/68/3201 | 9/13/2047 | 9/13/817 | 26% | 13/4/4 |
| `/products/uav/` | 28/69/2984 | 9/13/1957 | 9/13/813 | 27% | 13/3/3 |
| `/products/usv/` | 26/66/2926 | 9/14/1922 | 9/14/808 | 28% | 11/3/3 |
| `/products/wargaming-table/` | 15/33/1462 | 8/12/1650 | 8/12/707 | 48% | 9/2/2 |
| `/products/mortar-observation/` | 26/65/2464 | 8/12/1551 | 8/12/654 | 27% | 12/3/3 |
| `/products/sniper-simulator/` | 27/66/2507 | 9/13/1763 | 9/13/680 | 27% | 12/3/3 |
| `/products/machine-gun-simulator/` | 27/51/1863 | 9/13/1715 | 9/13/674 | 36% | 12/3/3 |
| `/products/hmmwv-simulator/` | 27/51/1826 | 9/13/1843 | 9/13/737 | 40% | 12/3/3 |
| `/products/tactical-boat-simulator/` | 27/50/1853 | 9/13/1771 | 9/13/733 | 40% | 13/4/4 |
| `/products/full-scale-police-training/` | 27/51/2138 | 9/13/1906 | 9/13/779 | 36% | 13/3/3 |
| `/products/police-box/` | 27/51/1931 | 9/13/1887 | 9/13/817 | 42% | 13/3/3 |
| `/products/fire-extinguisher-simulator/` | 30/57/2710 | 8/12/1565 | 8/12/638 | 24% | 16/2/2 |
| `/solutions/` | 8/25/884 | 8/24/2247 | 8/24/1013 | 115% | 4/4/4 |
| `/solutions/military/` | 25/44/2259 | 22/25/4596 | 22/26/1912 | 85% | 12/9/9 |
| `/solutions/police/` | 23/47/1733 | 15/22/3507 | 15/22/1389 | 80% | 10/3/3 |
| `/solutions/fire-rescue/` | 32/58/2376 | 13/19/2709 | 13/19/1012 | 43% | 15/2/2 |
| `/solutions/smart-city/` | 20/44/1720 | 12/24/3060 | 12/24/1319 | 77% | 9/2/2 |
| `/solutions/mum-t/` | 17/34/1459 | 8/21/2647 | 8/21/1099 | 75% | 8/4/4 |
| `/solutions/nova/` | 18/31/1378 | 5/17/2101 | 5/17/910 | 66% | 8/2/2 |

（小標＝h3/h4，含相關卡片；圖片位置＝真實圖片＋待補圖片的佔位。）

---

## 4. 全站共用區塊

### 4.1 Header 與下拉選單 — ✅ 結構一致，⚠️ 連結目標
- 三語結構完全相同：解決方案、產品介紹、核心技術、資源中心（最新消息、技術專欄、成功案例）、關於 BXR（關於我們、發展歷程、經營團隊、合作夥伴、投資人專區、聯絡我們）、搜尋、語言切換、聯絡我們按鈕。所有標籤都已翻譯。
- 三語共同問題（繁中也有）：「核心技術」與 Logo（首頁）連到不存在的頁面。

| 鍵 | TW | EN | JP |
|---|---|---|---|
| nav.products | 產品介紹 | Products | 製品情報 |
| nav.technologies | 核心技術 | Core Technology | コア技術 |
| nav.resources | 資源中心 | Resources | リソース |
| nav.company | 關於 BXR | About BXR | BXRについて |
| nav.aboutUs | 關於我們 | About Us | 会社概要 |
| nav.team | 經營團隊 | Management Team | 経営陣 |
| nav.investors | 投資人專區 | Investor Relations | 投資家情報 |

### 4.2 手機版選單 — ✅
手機版與桌機版共用同一份選單（`#site-menu`），三語項目一致。「開啟選單／關閉選單」都已翻譯。

### 4.3 Footer — ⚠️
| 項目 | TW | EN | JP |
|---|---|---|---|
| 版權列 | © 2026 全球動力科技股份有限公司 版權所有 | © 2026 **[待提供]** All rights reserved | © 2026 **[待提供]** All rights reserved |
| 人才招募、地址、電話、社群 | [待提供] | [待提供] | [待提供] |
| Email | service@gptt.com.tw | 同 | 同 |

- **P1**：`src/data/site.json` 的 `companyName.en`、`companyName.jp` 是「[待提供]」，所以英日頁尾和 JSON-LD 都缺少公司法定名稱。
- P2：日文版權用語是英文「All rights reserved」（`ui/jp.json` `footer.rights`）。

### 4.4 Breadcrumb — ✅ 一致
三語都是「首頁 > 產品介紹 > 產品名」的結構，JSON-LD 的 BreadcrumbList 也已翻譯。第一層「首頁」連到不存在的頁面（三語皆同）。

### 4.5 CTA
| 位置 | TW | EN | JP | 問題 |
|---|---|---|---|---|
| 產品 Hero 主按鈕（連到聯絡頁並帶入產品名） | 洽詢 ○○ 訓練系統 | Explore ○○ Training | ○○の詳細を見る | **P1** 語意不符：英日寫「探索／查看詳細」，實際是前往洽詢 |
| 產品結尾 CTA 標題 | 每個產品專屬一句（例：讓小隊在每一次訓練中，建立更一致的行動能力） | Contact Our Team（12 頁相同） | 担当者に相談する（12 頁相同） | **P1** 繁中專屬標題與說明在英日缺漏 |
| 產品結尾 CTA 說明 | 有（12 頁） | 無 | 無 | **P1** |
| 解決方案 Hero 按鈕 | 洽詢○○解決方案 | Discuss…／Explore Fire Training Solutions／Contact BXR／Contact Our Team | 相談する／見る／お問い合わせ | P2 用語不一；消防的「Explore／見る」語意不符 |
| 解決方案總覽頁結尾 CTA | **無** | Let's Build a Solution Around Your Mission.＋說明＋Contact BXR | 有 | **➕ 英日新增**（繁中沒有這個區塊） |
| 「回到產品／解決方案列表」連結 | **無**（`backToProducts` 是空字串） | Back to Products／Solutions | 製品一覧へ戻る／ソリューション一覧へ戻る | ➕ 英日新增 |
| `buttons.demo` | 預約展示 Book a demo | Book a Live Demo | **担当者に相談する** | P2 日文語意變成「與負責人洽談」 |

### 4.6 聯絡頁與提示文字 — ⛔ 英日未翻譯（P0）
- 頁首標題、說明、洽詢項目（7 種）、三步驟說明、「寄送 Email」按鈕、「或直接寄信至」：英日全部是「[待翻譯] 中文」（`ui/*.json` `contactPage.*`，共 32 個字串）。
- **英日按下「寄送 Email」後，郵件主旨和內文格式是中文加上「[待翻譯]」**（例如內文是 `[待翻譯] 姓名：`、`[待翻譯] 公司／單位：`）。這會直接寄給客戶使用。
- 型錄申請、Demo 預約的表單網址在三語都是「[待提供]」（`site.json` `forms`），按鈕在三語都沒有連結。

### 4.7 SEO Title／Meta Description
| 頁面 | TW | EN | JP |
|---|---|---|---|
| 12 個產品頁 | 產品名＋副標 | 已翻譯（內容對應精簡後的英文副標） | 已翻譯 |
| 6 個解決方案頁 | ✅ | ✅（語意改寫，見 §6） | ✅ |
| 產品總覽 | 產品／[待提供] | **[待翻譯] 產品**／[待提供] | **[待翻譯] 產品**／[待提供] |
| 關於我們 | 關於我們／公司簡介句 | **[待翻譯] 公司介紹** | **[待翻譯] 公司介紹** |
| 聯絡我們 | ✅ | **[待翻譯] 聯絡我們** | **[待翻譯] 聯絡我們** |
| 成功案例 | ✅ 有說明 | Case Studies／**[待提供]** | 導入事例／**[待提供]** |
| 歷程、團隊、夥伴、投資人、消息、文章、搜尋、標籤 | ✅（部分說明是 [待提供]） | **[待翻譯] 中文** | **[待翻譯] 中文** |

### 4.8 Open Graph／索引
- `og:locale`（zh_TW／en_US／ja_JP）、`og:url`、hreflang：三語正確。
- `og:image`：除了產品總覽之外都是網站圖示 `icon-512.png`（三語相同）。
- 產品總覽的 `og:image:alt` 和頁面圖片 Alt：英日是「[待翻譯] 以點雲呈現的室內訓練場域數位模型」。
- **P1**：英日的產品總覽、關於我們、聯絡我們是 `noindex`（繁中可索引），所以 sitemap 裡繁中有 22 個網址，英日只有 19 個。

### 4.9 圖片 Alt Text — ⚠️
- **P1**：英日產品檔沒有 `hero.image.alt`，所以會套用繁中的 Alt。SUT 照片在英日的 **11 個頁面**上 Alt 是中文「四名學員頭戴 VR 頭盔、身穿戰術裝備並手持訓練用槍械，站在載具模擬器前」：產品總覽、8 個產品頁的相關卡片、軍事模擬、MUM-T。
- **P1**：繁中產品頁有 9–16 個圖片位置，每個都有素材說明（例如「CQB 近距離戰鬥訓練畫面」），英日只有 2–4 個。英日的圖片位置是寫在各語言自己的檔案裡，所以之後補上真實照片時，英日不會出現這些圖，也不會有對應的 Alt 與圖說。

### 4.10 結構化資料（JSON-LD）
| 類型 | TW | EN | JP |
|---|---|---|---|
| Organization | 有 `legalName`（全球動力科技股份有限公司） | **缺 `legalName`** | **缺 `legalName`** |
| BreadcrumbList | ✅ | ✅ 已翻譯 | ✅ 已翻譯 |
| Product（12 個產品頁） | name、sku（SUT/UAV/USV）、description | ✅ 已翻譯，description 是精簡版副標 | ✅ |
| CollectionPage（解決方案總覽） | ✅ | ✅ | ✅ |

### 4.11 常見問題（FAQ）
全站三語都沒有 FAQ 內容或區塊（繁中母版也沒有），不適用。

### 4.12 介面文字（`src/content/ui/*.json`，共 296 個字串）
三語的鍵完全相同（沒有缺鍵）。但值的狀態如下：

| 群組 | EN 未翻譯 | JP 未翻譯 | 會出現在哪裡 |
|---|---|---|---|
| contactPage | 32 | 32 | 聯絡頁（含 Email 內容） |
| cases | 32 | 31 | 成功案例頁 |
| companyPages | 24 | 24 | 歷程、團隊、夥伴、投資人頁（投資人 7 個模組說明） |
| article | 26 | 26 | 新聞與文章內頁（目前沒有文章） |
| product | 20 | 14 | 舊版產品版型、整合訓練情境「參與產品」 |
| searchPage | 15 | 0 | 搜尋頁 |
| cta | 12 | 0 | 共用 CTA |
| listing | 11 | 11 | 列表頁、分頁 |
| solution | 8 | 4 | 舊版解決方案版型 |
| filter | 7 | 0 | 產品總覽篩選列 |
| productLanding | 4 | 1 | 產品頁「訓練挑戰」「訓練價值」「訓練重點」「素材需求」標籤 |
| tags、articleTypes、其他 | 9 | 6 | 標籤頁、卡片類型 |
| **合計** | **200** | **149** | |

- 頁面上方的「本頁尚未完成翻譯」提示本身是中文「[待翻譯] 本頁尚未完成翻譯。」，會出現在英日 12 個頁面。
- P2 日文用語與繁中語意不一致：`productLanding.eyebrows.flow`（繁中 Training Flow，日文「システムの特長」＝系統特色）、`focusLabel`（訓練重點 → 「主な機能」＝主要功能）、`eyebrows.audience` 與 `scenarios` 都用「活用分野」。

---

## 5. 12 項產品逐項比對

### 5.1 共通模式（12 頁相同）

繁中產品頁依序是：Hero（標題＋副標＋產品簡介）→ 訓練挑戰（標題＋引言＋4 張卡＋結語）→ 解決方式（標題＋引言＋3 個支柱＋圖片）→ 核心能力（5–6 項，每項有說明與圖片；SUT、UAV、USV、迫擊砲、狙擊槍另有「訓練價值」）→ 訓練流程（4 步驟＋註記）→ 應用情境（3–6 項，每項有說明與圖片；部分產品另有「訓練重點」）→ 導入價值（4–6 張卡＋結語）→ 延伸應用（標題＋說明＋相關卡片）→ 結尾 CTA（標題＋說明＋按鈕）。兵棋圖台的繁中沒有訓練挑戰、解決方式、訓練流程三區。

英日版全部改成固定的 5–6 段「標題＋一句話」：

| 繁中區塊 | 英日對應 | 狀態 |
|---|---|---|
| Hero 標題 | 改寫的口號 | ⚠️ 意思不同 |
| Hero 副標 | 另寫的一句產品定義 | ⚠️ |
| **產品簡介**（1–4 段） | 無 | ❌ 12/12 缺 |
| **訓練挑戰**（引言＋4 張卡＋結語） | 「Training Challenges／訓練課題」1 句 | ⚠️ 11/11 壓縮成一句，4 張卡全缺 |
| **解決方式**（引言＋3 支柱＋圖片） | 「How It Works／システムによる対応」1 句 | ⚠️ 11/11 支柱全缺 |
| **核心能力**（說明＋訓練價值＋圖片） | 6–7 個只有標題的勾選項目 | ⚠️ 12/12 說明與「訓練價值」全缺 |
| **訓練流程**（4 步驟） | 無 | ❌ 11/11 缺（滅火只有一個項目提到三種模式） |
| **應用情境**（說明＋訓練重點＋圖片） | 「Applications」1 句列舉 | ⚠️ 12/12 說明與訓練重點全缺 |
| **導入價值**（4–6 張卡＋結語） | 「Training Benefits」1 句 | ⚠️ 卡片與結語全缺 |
| **延伸應用**標題＋說明 | 「Related Products／Solutions」，無說明 | ⚠️ 說明全缺；相關卡片三語一致 ✅ |
| **結尾 CTA**標題＋說明 | 「Contact Our Team」，無說明 | ⚠️ |
| 圖片位置 | 只剩 Hero 與相關卡片 | ❌ |

### 5.2 產品矩陣（英日相同）

| 產品 | Hero | 簡介 | 挑戰 | 解決方式 | 能力 | 流程 | 情境 | 價值 | 延伸 | 結尾 CTA | 圖片／Alt | 新增或語意不符 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| SUT | ⚠️ | ❌ | ⚠️ | ⚠️ | ⚠️ | ❌ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ❌ | ➕ |
| UAV | ⚠️ | ❌ | ⚠️ | ⚠️ | ⚠️ | ❌ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ❌ | ➕／需確認 |
| USV | ⚠️ | ❌ | ⚠️ | ⚠️ | ⚠️ | ❌ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ❌ | 輕微 |
| 兵棋圖台 | ⚠️ | ❌ | ➕（繁中無此區） | ➕（繁中無此區） | ⚠️ | — | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ❌ | ➕ 多項 |
| 迫擊砲觀測 | ⚠️ | ❌ | ⚠️ | ⚠️ | ⚠️ | ❌ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ❌ | 需確認 |
| 狙擊槍 | ⚠️ | ❌ | ⚠️ | ⚠️ | ⚠️ | ❌ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ❌ | 輕微 |
| 機槍 | ⚠️ | ❌ | ⚠️ | ⚠️ | ⚠️ | ❌ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ❌ | 需確認 |
| 悍馬車 | ⚠️ | ❌ | ⚠️ | ⚠️ | ⚠️ | ❌ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ❌ | ➕ |
| 快艇 | ⚠️ | ❌ | ⚠️ | ⚠️ | ⚠️ | ❌ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ❌ | ➕ |
| 全配式警勤 | ⚠️ | ❌ | ⚠️ | ⚠️ | ⚠️ | ❌ | ⚠️ | ⚠️ | — | ⚠️ | ❌ | ➕ |
| BOX | ⚠️ | ❌ | ⚠️ | ⚠️ | ⚠️ | ❌ | ⚠️ | ⚠️ | — | ⚠️ | ❌ | ➕ |
| VR 滅火 | ⚠️ | ❌ | ⚠️ | ⚠️ | ⚠️ | ❌ | ⚠️ | ⚠️ | — | ⚠️ | ❌ | ➕／語意不符 |

（— ＝繁中本身沒有這一區或沒有說明。全配式、BOX、滅火的繁中延伸區只有標題，沒有說明。）

### 5.3 各產品重點缺漏與差異

#### 1. SUT 小部隊戰術訓練系統（`/products/sut/`）
- **缺漏**：「1 至 4 人戰術編組」在英日完全沒有出現；繁中三大技術「VR 沉浸式環境、XR 任務資訊、AI 行為模擬」在英日只剩 VR，**XR 與 AI 行為模擬都沒有**。訓練挑戰 4 張卡（場地與安全限制、團隊協同、固定情境、成果檢核）、3 個支柱、5 項能力的說明與「訓練價值」、4 步驟流程、4 個情境（CQB、小部隊協同、基地防護、要地防衛）的說明與訓練重點、4 張價值卡、定位聲明「SUT 的目的不是取代實體戰術訓練」、延伸說明（可獨立運作，也可與 UAV、USV 搭配），都缺漏。
- **英日新增**：應用情境寫了「tactical law enforcement preparation／警察の戦術訓練」，繁中 SUT 只屬於軍事領域。
- **名稱**：繁中「延伸應用」區塊同時列出產品與解決方案，英文標題卻是「Related Solutions」。

#### 2. 無人機戰術與反制無人機訓練系統（`/products/uav/`）
- **缺漏**：XR 任務資訊、AI 動態變化；4 張挑戰卡；3 個支柱；5 項能力的說明與訓練價值；4 步驟流程；5 個情境；4 張價值卡＋結語；延伸說明（可作為獨立課程，也可與其他產品整合）；結尾說明。
- **英日新增／需確認**：「Simulated response and **engagement** procedures」。繁中 UAV 頁只寫到威脅確認、資訊溝通、應變決策，沒有「接戰」；「模擬接戰」只出現在繁中的 Counter-UAS 整合情境，而且是由 SUT 士兵執行。應用情境的「base protection, critical infrastructure security」繁中 UAV 頁也沒有。

#### 3. USV 無人船 VR 訓練系統（`/products/usv/`）
- **缺漏**：4 張挑戰卡（海況、載具資源、資訊理解、跨系統協同）；3 個支柱（包含「不必依附 SUT 才能使用」的定位）；5 項能力的說明與訓練價值；4 步驟流程；3 個情境；4 張價值卡；延伸說明；結尾說明。
- 英文有保留與 SUT 影像串流整合的說明（Confirmed Integration）✅。
- 輕微：「Maritime situational awareness」在繁中沒有明確寫到。

#### 4. 兵棋圖台系統（`/products/wargaming-table/`）
- **缺漏**：「三維戰場環境」（英文改成 digital terrain）、「多元訓練系統協同」、「跨領域（陸域、空域、海域）任務整合」、「彈性擴充架構」；4 個情境（聯合任務規劃、**有人與無人系統協同**、跨領域協同推演、指揮所與決策訓練）；4 張價值卡；延伸說明（兵棋圖台與 SUT 的分工）；結尾說明。
- **英日新增（P0）**：「touch-based interaction／タッチ操作」、「VR-supported visualization／VR による可視化」、「Force positioning and movement simulation」，繁中都沒有。
- **英日新增區塊**：繁中沒有「訓練挑戰」「解決方式」兩區，英日卻有「Training Challenges」「How It Works」。
- 名稱：繁中「兵棋圖台系統」，英文「BXR Wargaming Table」。

#### 5. 迫擊砲觀測模擬系統（`/products/mortar-observation/`）
- **缺漏**：XR 技術；4 張挑戰卡；3 個支柱（沉浸式觀測環境、射擊結果判讀、觀測與射擊支援協同）；5 項能力的說明與訓練價值；4 步驟流程；4 個情境（包含不同地形、射擊支援協同）；4 張價值卡；延伸說明；結尾說明。
- **需確認**：英文標題與能力寫「**Fire Adjustment**（修正射擊）」，繁中只寫到「射擊結果觀察／判讀」與「觀測資訊溝通」，沒有宣稱修正射擊。

#### 6. 狙擊槍模擬系統（`/products/sniper-simulator/`）
- **缺漏**：「風向」（英文只寫 environmental）；4 張挑戰卡；3 個支柱；5 項能力的說明與訓練價值；4 步驟流程；4 個情境（基礎瞄準、不同距離、環境變因、綜合射擊）；4 張價值卡＋結語；延伸說明；結尾說明。
- 輕微新增：「stability」「sight alignment」「specialized precision shooting training」。

#### 7. 機槍模擬系統（`/products/machine-gun-simulator/`）
- **缺漏**：4 張挑戰卡；3 個支柱；5 項能力的說明（射擊紀律、任務情境判斷、團隊協同）；4 步驟流程；4 個情境；4 張價值卡；延伸說明；結尾說明。
- **需確認**：「Fire control exercises（射控）」「Target engagement practice（目標接戰）」，繁中沒有這兩項。

#### 8. 悍馬車載具訓練系統（`/products/hmmwv-simulator/`）
- **缺漏（P1，產品重點）**：**AR 技術**與**動態平台**，在英日完全沒有出現（繁中在簡介、支柱、能力、價值都有提到）；4 張挑戰卡；道路與地形情境；4 步驟流程；4 個情境；4 張價值卡；延伸說明；結尾說明。
- 新增：「restricted visibility」「tactical mobility preparation」。
- 名稱：繁中「悍馬車載具訓練系統」，英文「Humvee **Driving Simulator**」。

#### 9. 快艇載具訓練系統（`/products/tactical-boat-simulator/`）
- **缺漏（P1）**：**XR／AR 技術**與**動態平台**完全沒有出現；「航行安全觀念」；延伸說明中的重要定位聲明「快艇屬於有人船艇；USV 是獨立的無人載具訓練，兩者定位不同」；4 步驟流程；4 個情境；4 張價值卡；結尾說明。
- 新增：「Naval training … maritime security training」。
- 名稱：繁中沒有「軍用」，英文是「**Military** Speedboat Simulator」，日文是「軍用高速艇」。

#### 10. 全配式警勤訓練系統（On-sited）（`/products/full-scale-police-training/`）
- **缺漏**：3 段產品簡介；4 張挑戰卡；3 個支柱（包含「完整場域配置」）；5 項能力；4 步驟流程；4 個情境（包含突發狀況應變）；4 張價值卡；結尾說明。
- **英日新增**：「Compatible simulated police equipment」「Individual and **team-based** exercises」「Police academies, law enforcement training centers」。
- 名稱：繁中寫「On-sited」，英文寫「On-site」（繁中可能是筆誤，需要確認統一）。

#### 11. 攜帶式警勤訓練器（BOX）（`/products/police-box/`）
- **缺漏**：3 段產品簡介；4 張挑戰卡（包含勤務與課程時間的彈性）；3 個支柱；5 項能力；4 步驟流程（設備部署 → 課程說明 → 情境演練 → 教學檢討）；4 個情境；4 張價值卡；結尾說明。
- **英日新增（P0）**：「Portable **wheeled**-case design／**キャスター付き**可搬型ケース」，繁中只寫「可攜式箱體」，沒有提到輪子。另外還有「Individual or group training arrangements」「mobile instructional teams」「Configurable training content」。

#### 12. VR 虛擬滅火訓練系統（`/products/fire-extinguisher-simulator/`）
- **缺漏（P1，規格）**：自主研發的擬真滅火器鋼瓶模組（依實際比例與重量分布設計）、**兩支 VIVE 控制器＋6DOF 追蹤**、**VR 一體機（不需外接電腦或教官控制設備）**、**專用攜行箱**、**A／B／C／D 四類火災**、**二氧化碳、乾粉、泡沫三種滅火器**、測驗後顯示「操作結果與完成時間」。另外還有 4 張挑戰卡、3 個支柱、6 項能力說明、4 步驟流程＋流程註記、6 個火場的說明、6 張價值卡、結尾說明。
- **語意不符**：「鐵皮屋」被寫成「industrial building／工場建屋」（工業建築），「科技廠房」被寫成「technology facility」。
- 新增：應用情境「workplace training, emergency preparedness programs」。

---

## 6. 解決方案頁

### 6.1 解決方案總覽（`/solutions/`）
| 區塊 | TW | EN／JP | 狀態 |
|---|---|---|---|
| Hero 標題 | 從專業訓練到智慧應用，打造虛實整合的全方位解決方案 | Integrated Solutions for Training, Safety, and Smart Applications | ⚠️ 改寫 |
| Hero 副標（lead） | 有 | **無** | ❌ |
| Hero 說明 | 2 段（XR、AI、系統整合；從單一設備到大型整合；技術轉化為實際工具） | 1 句（與 SEO 說明相同） | ⚠️ |
| 四領域卡片 | 名稱＋英文名＋摘要＋按鈕 | 名稱＋**另加的一句口號**（`cardHeadline`，繁中沒有）＋摘要＋按鈕 | ⚠️／➕ |
| 理念 4 項 | 情境導向設計、模組化系統配置、跨系統整合、數位化訓練與管理 | Immersive Experience、Repeatable Practice、Flexible Integration、Scalable Applications | ❌ **4 項中有 3 項內容不同** |
| 結尾 CTA | **無** | 有 | ➕ 英日新增 |

### 6.2 軍事模擬（`/solutions/military/`）
- **缺漏**：3 段簡介（包含「進一步規劃 MUM-T 與 NOVA 兩種不同規模的方案」）；4 張挑戰卡（英文合併成 2 段）；能力說明中具體的武器（步槍、機槍、狙擊槍、迫擊砲觀測）、SUT 名稱、**動感平台**、**三維戰場態勢**；MUM-T、NOVA 介紹各自的第二段「聚焦…」；4 張價值卡（英日改成 5 個內容不同的勾選項目）；結尾說明。
- 英日新增：卡片口號「Train for Complex Missions. Build Operational Readiness.」。

### 6.3 警勤模擬（`/solutions/police/`）
- **缺漏**：4 張挑戰卡；**5 步驟訓練流程**（認識裝備 → 基礎操作 → 進階情境 → 言語與行動判斷 → 成果檢討），英日完全沒有；5 張價值卡（改成 5 個內容不同的勾選項目）。
- **英日新增**：「Featured Products」區塊（全配式與 BOX 兩張卡），繁中警勤頁沒有這個區塊。情境訓練多了「safe-distance management, equipment selection」；進階訓練多了「changing threat conditions」；另外還有「Support individual and team-based exercises」。
- 名稱：繁中「警勤模擬」（英文名 Police Simulation），英文「Law Enforcement Training」，日文「警察訓練シミュレーション」。繁中總覽卡上顯示的英文名「Police Simulation」，和英文站上的名稱不一致。

### 6.4 消防防災（`/solutions/fire-rescue/`）
- **缺漏**：4 段簡介（包含「適合消防教育、義消訓練、單位內部防災教育」）；4 張挑戰卡；4 個支柱（包含**自主研發鋼瓶模組**、**兩支 VIVE 控制器**）；6 個火場的說明（英日併成一句）；**「適用訓練需求」4 張卡與免責說明「上述為適用方向，不代表所有類型的機關均已有實際導入案例」**，英日完全缺漏；5 張價值卡（包含「部署與收納便利：VR 一體機＋專用攜行箱」「成果可檢視：完成時間」）；結尾說明。
- **語意不符（P0）**：
  - 體驗模式：繁中是「介紹四類火災與三種滅火器」，英日是「Explore simulated fire scenarios and become familiar with the virtual training environment」（體驗火場、熟悉環境）。
  - 教學模式：英日加上「practice extinguisher **selection**（選擇滅火器）」，繁中只有分步驟操作。
  - 滅火器種類：繁中是「介紹」三種滅火器，英日寫成「Practice **selecting** from … extinguishers according to the training scenario」（依情境選擇滅火器的練習），這是**新增的功能宣稱**。
  - 鐵皮屋 → industrial buildings／工場建屋（同 §5.3 第 12 項）。
- 名稱：繁中英文名「Fire & Disaster **Prevention**」，英文站「Fire & Disaster **Preparedness**」。

### 6.5 智慧城市（`/solutions/smart-city/`）
- **缺漏**：4 張挑戰卡；各應用領域的**具體限制說明**（例如「AIS、貨物流向及即時設備監測等功能，需依實際專案介接條件確認」「即時號誌控制、交通預測及資料介接等功能需依專案條件評估」「依實際介接條件評估能源、溫濕度與設備狀態」），英日只在總覽寫了一段通用說明；智慧運動訓練中的「射擊運動」；「管理與決策輔助」支柱（改成 Operational Analysis）；4 張價值卡。
- 英日新增：卡片口號。

### 6.6 MUM-T 小隊戰術協同訓練（`/solutions/mum-t/`）
- **缺漏**：3 張挑戰卡；3 個支柱（包含「依實際系統配置，結合 SUT 及適用的無人系統模擬資訊」）；能力「無人系統資訊輔助」；3 張價值卡。
- **語意不符**：繁中寫「依據**已完成**的整合功能，將適用的無人系統模擬資訊帶入」，英日寫「Integration with other BXR simulation products **must be assessed and confirmed**」（必須另行評估確認），立場不同。
- 名稱：繁中英文名「MUM-T Squad Tactical **Teaming**」，英文站「MUM-T Small-Unit Tactical **Coordination**」。

### 6.7 NOVA 聯戰模擬整合（`/solutions/nova/`）
- **缺漏**：4 張挑戰卡；5 個支柱中的「三維戰場態勢」「跨領域任務整合（陸、海、空）」「指揮與任務推演（兵棋）」；**4 個應用情境**（跨單位、跨領域、指揮與態勢、整合型訓練場域），英日完全缺漏；4 張價值卡。
- **英日新增**：「Important Scope」區塊（NOVA 不代表所有 BXR 產品都已互通），繁中沒有這段聲明。

---

## 7. 英日有、但繁中沒有的內容（原則 9 檢查清單）

以下內容在繁中母版找不到依據，請業主確認這些描述是否屬實，或從英日版移除：

| 頁面 | 英文（日文相同） | 繁中實際寫法 |
|---|---|---|
| 兵棋圖台 | touch-based interaction、touch-based map interaction | 沒有提到觸控 |
| 兵棋圖台 | VR-supported visualization／spatial visualization | 沒有提到 VR |
| 兵棋圖台 | Force positioning and movement simulation | 三維呈現兵力部署（沒有「移動模擬」） |
| BOX | Portable **wheeled**-case design（キャスター付き） | 可攜式箱體 |
| BOX | Individual or group training arrangements | 沒有提到 |
| 全配式警勤 | Compatible simulated police equipment、team-based exercises | 實體互動設備；沒有提到團隊訓練 |
| 警勤解決方案 | safe-distance management、equipment selection、team-based exercises、Featured Products 區塊 | 沒有提到 |
| 滅火產品／消防方案 | practice extinguisher **selection** | 只有「介紹」三種滅火器 |
| UAV | Simulated response and **engagement** procedures | 威脅確認、資訊溝通、應變決策 |
| UAV | base protection, critical infrastructure security | 沒有提到 |
| 機槍 | Fire control exercises、Target engagement practice | 射擊紀律、模擬射擊 |
| 迫擊砲觀測 | Fire adjustment practice | 射擊結果觀察與判讀 |
| SUT | tactical law enforcement preparation | 只屬於軍事領域 |
| 悍馬車 | restricted visibility | 沒有提到 |
| 快艇 | Naval training, maritime security；名稱加上「Military」 | 沒有提到 |
| 解決方案總覽 | 結尾 CTA 區塊、四領域卡片口號 | 沒有這些區塊 |
| NOVA | Important Scope 聲明 | 沒有 |
| 產品／解決方案頁 | Back to Products／Solutions 連結 | 沒有 |

---

## 8. 其他觀察（繁中母版本身，供參考）

- **首頁、核心技術、隱私權政策**還沒建立，三語都是 404。網站根目錄 `/` 會 301 轉到 `/en/`，這頁同樣是 404。
- 繁中的整合訓練情境叫「MUM-T **人機協同**訓練（Manned-Unmanned Teaming）」，解決方案頁叫「MUM-T **小隊戰術協同**訓練（Squad Tactical Teaming）」。同一個 MUM-T 有兩種中文名與英文名，翻譯時會不知道該用哪一個。
- 繁中產品總覽頁的說明與 CTA、消息、技術文章、搜尋、標籤頁的說明，目前都是「[待提供]」，英日無從翻譯。
- `src/content/pages/tw/contact.md` 的註解提到 `docs/COPY-REVIEW.md`，但這個檔案不在 repo 裡。

---

## 9. 建議處理順序（本次未執行）

1. **先由業主決定**：是否以繁中全文取代目前「業主核准」的精簡英日定稿（見 §0）。
2. **P0**：
   - 翻譯 `ui/en.json` 200 個、`ui/jp.json` 149 個「[待翻譯]」字串（優先處理 `contactPage`，它會影響寄出的 Email）。
   - 翻譯 12 個佔位頁（`src/content/pages/{en,jp}/*.md` 與 `scenarios/{en,jp}/*.md`）。
   - 補上 `site.json` 的 `companyName.en`、`companyName.jp`。
   - 請業主逐項確認 §7 的新增宣稱。
3. **P1**：依繁中 `landing` 結構逐產品完成英文全文，再**從繁中**（或已比對過的完整英文）翻譯日文。版型不用改：只要在英日檔案填入挑戰卡、支柱、能力（說明＋價值）、流程、情境（說明＋重點）、價值、延伸說明、結尾說明，以及各圖片位置的素材說明與 Alt，頁面就會呈現完整區塊。解決方案頁同樣處理。另外，英日的 `hero.image.alt` 也要補上。
4. **P2**：統一名稱（產品英文名、解決方案英文名、MUM-T 名稱、On-site／On-sited），修正 CTA 用語（「洽詢」不要寫成 Explore／詳細を見る），以及日文介面標籤的語意。
