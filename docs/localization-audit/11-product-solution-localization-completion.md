# 11 產品與解決方案三語同步：完成紀錄

日期：2026-10-21
範圍：12 個產品頁、/solutions/ 總覽＋6 個解決方案頁、/products/ 總覽，EN（/en/）與 JP（/jp/）
母版：TW（/tw/）內容檔 `src/content/{products,solutions,pages}/tw/`
授權：業主授權以 TW 母版完整取代原有 EN/JP 已核准文案
JP 直接由 TW 翻譯，未經 EN 轉譯
本文件給 ChatGPT 讀取用，不追求排版

## A. 驗收總結

| 項目 | 結果 |
|---|---|
| production build（`npm run build`） | PASS（exit 0） |
| 產品頁 12×3 語 = 36 頁生成 | PASS |
| 解決方案頁 7×3 語 = 21 頁生成（總覽＋6） | PASS |
| EN 產品 FAQ 題數 | 60（12×5） |
| JP 產品 FAQ 題數 | 60（12×5） |
| EN/JP FAQPage JSON-LD | 每個產品頁 1 個，mainEntity 5 題，inLanguage = en / ja-JP |
| 區塊數、項目數與 TW 一致 | PASS（內容檔 YAML 結構比對＋建置頁 section/h3/h4/li/img 逐區比對） |
| 無 `[待翻譯]`、無殘留中文 | PASS（EN 無任何 CJK；JP 無繁體專用字形；`[待提供]` 僅在 TW 本身就是 `[待提供]` 的 /products/ 欄位保留） |
| 範圍限定聲明保留 | PASS（SUT、UAV、USV、兵棋圖台、迫擊砲、全配式警勤、滅火器，EN/JP 逐句檢查） |
| 未延伸 USV→SUT 整合宣稱、未新增功能 | PASS（人工逐檔比對） |
| 連結與 CTA | PASS（`qa:links` 0 broken；hero 按鈕文字＝內容檔 ctaLabel） |
| /products/ 無整合訓練區塊 | PASS（EN/JP/TW 皆無 `#integrated`；12 張產品卡） |
| FAQ 單開手風琴 | PASS（開啟第 3 題時第 1 題關閉） |
| 手機 390px / 平板 820px 無水平捲動 | PASS |
| TW 未受影響 | PASS（`qa:faq`、`qa:solutions`、`qa:behaviour` 等 TW 檢查全過；TW 內容檔未修改） |
| `npm test` | 26 pass |
| `astro check` | 0 errors |
| `check:sitemap` | PASS（62 URLs） |
| `qa:english` / `qa:japanese` / `qa:faq` / `qa:behaviour` / `qa:solutions` / `qa:header` / `qa:company` / `qa:search` / `qa:phase2` / a11y | 全部 PASS（a11y 0 serious/critical） |

## B. 逐頁對照

欄位說明：
- 內容區塊 = landing 內 challenge/approach/capabilities/flow/scenarios/audience/featured/values/related/closing 存在的數量（hero 與 FAQ 另計）
- 卡片項目 = 上述區塊內 cards/pillars/items/steps 的總數
- 簡介段落 = landing.intro 段落數
- 圖片位置 = 帶 `need`（圖片需求／Alt 說明）的位置數
- 建置頁 小標 = 建置後 HTML `main` 內 h3+h4 數（含 FAQ 題目）

| 頁面 | 內容區塊 TW/EN/JP | 卡片項目 TW/EN/JP | 簡介段落 TW/EN/JP | 圖片位置 TW/EN/JP | FAQ TW/EN/JP | 建置頁 小標 TW/EN/JP | 驗收 |
|---|---|---|---|---|---|---|---|
| `/products/sut/` | 8/8/8 | 24/24/24 | 1/1/1 | 10/10/10 | 5/5/5 | 32/32/32 | ✅ |
| `/products/uav/` | 8/8/8 | 25/25/25 | 2/2/2 | 11/11/11 | 5/5/5 | 33/33/33 | ✅ |
| `/products/usv/` | 8/8/8 | 23/23/23 | 2/2/2 | 9/9/9 | 5/5/5 | 31/31/31 | ✅ |
| `/products/wargaming-table/` | 5/5/5 | 13/13/13 | 2/2/2 | 8/8/8 | 5/5/5 | 20/20/20 | ✅ |
| `/products/mortar-observation/` | 8/8/8 | 24/24/24 | 2/2/2 | 10/10/10 | 5/5/5 | 31/31/31 | ✅ |
| `/products/sniper-simulator/` | 8/8/8 | 24/24/24 | 2/2/2 | 10/10/10 | 5/5/5 | 32/32/32 | ✅ |
| `/products/machine-gun-simulator/` | 8/8/8 | 24/24/24 | 2/2/2 | 10/10/10 | 5/5/5 | 32/32/32 | ✅ |
| `/products/hmmwv-simulator/` | 8/8/8 | 24/24/24 | 2/2/2 | 10/10/10 | 5/5/5 | 32/32/32 | ✅ |
| `/products/tactical-boat-simulator/` | 8/8/8 | 24/24/24 | 2/2/2 | 10/10/10 | 5/5/5 | 32/32/32 | ✅ |
| `/products/full-scale-police-training/` | 8/8/8 | 24/24/24 | 3/3/3 | 11/11/11 | 5/5/5 | 32/32/32 | ✅ |
| `/products/police-box/` | 8/8/8 | 24/24/24 | 3/3/3 | 11/11/11 | 5/5/5 | 32/32/32 | ✅ |
| `/products/fire-extinguisher-simulator/` | 8/8/8 | 29/29/29 | 4/4/4 | 15/15/15 | 5/5/5 | 35/35/35 | ✅ |
| `/solutions/military/` | 6/6/6 | 16/16/16 | 3/3/3 | 4/4/4 | 0/0/0 | 25/25/25 | ✅ |
| `/solutions/police/` | 6/6/6 | 21/21/21 | 3/3/3 | 8/8/8 | 0/0/0 | 23/23/23 | ✅ |
| `/solutions/fire-rescue/` | 9/9/9 | 31/31/31 | 4/4/4 | 14/14/14 | 0/0/0 | 32/32/32 | ✅ |
| `/solutions/smart-city/` | 6/6/6 | 19/19/19 | 3/3/3 | 8/8/8 | 0/0/0 | 20/20/20 | ✅ |
| `/solutions/mum-t/` | 6/6/6 | 13/13/13 | 4/4/4 | 5/5/5 | 0/0/0 | 17/17/17 | ✅ |
| `/solutions/nova/` | 6/6/6 | 17/17/17 | 3/3/3 | 7/7/7 | 0/0/0 | 18/18/18 | ✅ |
| `/solutions/`（總覽） | hero＋理念 4 項 | 4/4/4 | 2/2/2 | — | 0/0/0 | 8/8/8 | ✅ |

全部 19 組頁面 TW = EN = JP。

## C. 命名對照（EN 用名；JP 用名）

產品：
| TW | EN | JP |
|---|---|---|
| SUT 小部隊戰術訓練系統 | SUT Small Unit Tactical Training System | SUT 小部隊戦術訓練システム |
| 無人機戰術與反制無人機訓練系統 | Drone Tactics and Counter-Drone Training System | ドローン戦術・対ドローン訓練システム |
| USV 無人船 VR 訓練系統 | USV Unmanned Surface Vessel VR Training System | USV 無人艇 VR 訓練システム |
| 全配式警勤訓練系統（On-sited） | Full-Configuration Police Training System (On-sited) | フル構成型警察訓練システム（On-sited） |
| 攜帶式警勤訓練器（BOX） | Portable Police Training Unit (BOX) | 可搬型警察訓練装置（BOX） |
| VR 虛擬滅火訓練系統 | VR Fire Extinguisher Training System | VR 消火訓練システム |

其餘 6 個產品名稱見各內容檔 hero.name。「On-sited」照抄，見 D-1。

解決方案：
- 四大領域：軍事／警務／消防／智慧城市（EN domains: Military, Police Simulation, Fire & Disaster Prevention, Smart City）
- MUM-T、NOVA 為軍事子方案（military 頁 featured 區塊只連這兩個）
- 反無人機（Counter-UAS）內容維持在 UAV 產品內，未獨立成頁
- EN 的 englishName = name（EN 站卡片不再重複英文名，見 E-1）；JP 的 englishName 沿用 TW 的英文名

UI 標籤（`src/content/ui/{en,jp}.json`）：
- productDomains EN: Military Training / Police Training / Fire & Disaster Prevention
- faq.title EN: Frequently Asked Questions；JP: よくあるご質問
- productLanding.valueLabel JP: 訓練価値；focusLabel JP: 訓練の重点
- mediaNeed EN: "Image needed | "；JP: "画像素材｜"
- 區塊 eyebrow（英文小標）EN/JP 與 TW 相同，皆為英文
- backToProducts / backToSolutions = ""（TW 沒有返回連結，EN/JP 同步移除）

## D. 尚待業主確認（翻譯已依 TW 字面處理，未自行修正）

D-1 「On-sited」
- TW：`全配式警勤訓練系統（On-sited）`
- 英文應為 on-site / on-premises，"On-sited" 非標準英文。EN/JP 目前照抄 "On-sited"。待確認是否改為 "On-site"。

D-2 「滅火器」與「消火器」混用
- TW 正文用「滅火器」（27 處），FAQ 用「消火器」（5 處），例：`訓練內容包含二氧化碳、乾粉及泡沫等模擬消火器`
- EN 統一為 fire extinguisher；JP 統一為 消火器（日文正確用語）。TW 本身是否統一為「滅火器」待確認。

D-3 滅火器「體驗模式」正文與 FAQ 描述不一致
- 正文：`體驗模式｜建立基礎認知：提供四種火災類型及三種滅火器種類介紹，協助學員理解火災特性、滅火器基本知識與相關使用觀念`
- FAQ：`體驗模式協助熟悉情境，教學模式引導操作程序，測驗模式則用於情境練習與結果檢視。`
- 正文是「知識介紹」，FAQ 是「熟悉情境」。EN/JP 各自照譯。待確認哪個為準。
- 另：正文「四種火災類型及三種滅火器種類」vs FAQ「二氧化碳、乾粉及泡沫等」（三種相符，但 FAQ 用「等」）。

D-4 兵棋圖台：觸控地圖與 VR
- FAQ：`兵棋圖台可運用觸控地圖進行互動操作，並支援 VR 相關的空間視覺化應用。`
- 正文未提「觸控地圖」。是否為已確認規格待確認。EN/JP 照譯 FAQ，未加入正文。

D-5 迫擊砲：「射擊修正」只出現在 FAQ
- 正文用「射擊結果辨識／判讀」；FAQ 3 處用「射擊修正」，例：`目前產品定位以觀測及相關射擊修正程序為核心`
- 「判讀結果」與「修正射擊」在軍事訓練上範圍不同。待確認產品是否含射擊修正（fire correction / adjustment）程序。EN/JP 照譯各處原意，未統一。

D-6 MUM-T「已完成的整合功能」vs SUT FAQ
- MUM-T：`依據已完成的整合功能，將適用的無人系統模擬資訊帶入小隊訓練情境`
- SUT FAQ：`目前已確認的整合應用之一，是 USV 系統的影像資訊可傳送至 SUT 訓練環境。其他無人機、無人船或外部系統的連接方式，需依實際介面與專案條件確認。`
- MUM-T 措辭可被讀成「已有多項完成整合」。EN/JP 照譯「based on integration functions already completed / 完成済みの統合機能に基づき」，未擴大成 UAV→SUT 或其他整合。待確認 MUM-T 這句是否應改成只指 USV 影像。

D-7 /products/ 總覽頁 `[待提供]`
- `src/content/pages/tw/products.md` 的 seo.description、hero description、部分 title 為 `"[待提供]"`
- EN/JP 同欄位保留 `[待提供]`（母版無內容可譯）。頁面可見區只出現在 TW 也出現的位置。待業主提供 TW 文案後再譯。

D-8 產品編號
- 迫擊砲等部分產品 TW 註記「尚無確認的產品編號，因此不設 code」，EN/JP 同樣不設。

## E. 程式與 QA 變更（非內容）

E-1 `src/components/CardSolution.astro`：englishName 與 name 相同時不顯示英文副標（EN 站否則同一名稱出現兩次）。TW/JP 顯示不變。
E-2 `src/styles/global.css`：手機（<768px）`.btn` 允許換行。原因：EN/JP CTA 文字較長（例 "Inquire about the Mortar Observation Simulation System"），nowrap 造成手機水平捲動。桌機外觀不變。
E-3 `scripts/lib/qa-localized.mjs`（新增）：EN/JP 共用檢查（標題/CTA/名稱來自內容檔、與 TW 頁逐區比對、5 題 FAQ＋FAQPage、範圍聲明、無返回連結、可索引、sitemap、手機/平板）。
E-4 `scripts/qa-english.mjs`、`scripts/qa-japanese.mjs`：改用 E-3；斷言改為新文案。
E-5 `scripts/qa-faq.mjs`：EN/JP SUT 改為須有 5 題；無 FAQ 名單只剩 /tw/products/、/tw/solutions/military/、/tw/solutions/。
E-6 `scripts/qa-behaviour.mjs`：待翻譯頁檢查改用 /en/company/；sitemap 預期含 /en/products/；EN 篩選 chip 改新標籤。
E-7 `scripts/qa-search.mjs`：JP 測試只檢查 fixture 文章 URL（Pagefind 會以 "MUM-T" 的 "T" 命中 "TEST"，屬正常）。

## F. 連帶影響（未主動修改 SEO，但內容狀態改變造成）

- EN/JP 內容檔 `translationStatus` 由 pending 改為 translated → 既有機制自動：移除 noindex、移除翻譯中橫幅、加入 sitemap。sitemap 現為 62 URLs（含 /en/products/、/jp/products/）。
- EN/JP 產品頁有 `faq` 欄位 → 既有 `faqLd` 自動輸出 FAQPage JSON-LD（inLanguage en / ja-JP）。
- 未修改任何 Meta/Canonical/hreflang/Sitemap/robots/Schema 程式。

## G. 與 01–10 稽核報告的差異

- 報告要求移除 /products/ 的整合訓練區塊與情境：main 上已由 PR #21 移除，本次無需動作，只加驗收檢查。
- 報告 03 所列 EN/JP 舊文案（blocks、cardHeadline、EN 專屬段落）已全部由 TW 母版翻譯取代，舊欄位刪除。
- 報告所列 EN/JP 產品頁 FAQ 缺漏（0 題或 SUT 3 題）→ 現為每頁 5 題。
- 報告所列 EN/JP 解決方案頁區塊數少於 TW → 現與 TW 相同。

## H. 本次未處理（依指令排除）

- 首頁、技術頁、解決方案 FAQ、UI 改版、動畫
- 全站其他介面字串（公司頁、新聞、洞察、案例、頁尾等仍為原狀；/en/company/ 等仍為 pending）
- SEO/Meta/Canonical/hreflang/Sitemap/robots/Schema 程式修改
