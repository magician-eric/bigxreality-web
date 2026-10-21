# 07｜AI 搜尋可讀性、常見問題、嚴肅遊戲概念、AI 爬蟲

版本／方法：見 01。本文件只判斷「被 AI 搜尋讀取與引用所需的條件是否具備」，不代表保證排名、引用或推薦。AI 引用與推薦數據：**尚無數據，無法驗證**。

## 1. AI 爬蟲存取

### 1.1 repo 內的設定〔原始碼／建置〕
- `robots.txt`（`src/pages/robots.txt.ts`）在正式 build 輸出 `User-agent: *` `Allow: /`＋Sitemap，**沒有針對任何特定爬蟲的規則**。
- 只有 preview、fixtures、bootstrap build 會輸出 `Disallow: /`，並讓全站 noindex（`src/lib/content-source.ts` `isNoIndexBuild`）。
- 頁面上沒有 nosnippet、max-snippet、noai 這類限制。

### 1.2 各爬蟲（只依 repo 設定判斷；實際狀態待線上驗證）
| 爬蟲 | 用途類型 | repo robots.txt | 實際狀態 |
|---|---|---|---|
| Googlebot | 搜尋索引（Google 搜尋；AI Overviews、AI Mode 也使用搜尋索引） | 允許 | 待線上驗證 |
| Googlebot-Image | 圖片搜尋 | 允許 | 待線上驗證 |
| Google-Extended | 控制內容是否用於 Gemini 模型與 grounding；不影響 Google 搜尋 | 未設定（＝允許） | 待線上驗證 |
| Bingbot | Bing 索引（Microsoft Copilot 等也使用） | 允許 | 待線上驗證 |
| OAI-SearchBot | ChatGPT 搜尋結果的索引 | 允許 | 待線上驗證 |
| GPTBot | OpenAI 模型訓練 | 允許 | 待線上驗證 |
| ChatGPT-User | 使用者在 ChatGPT 中觸發的即時讀取（robots.txt 是否適用，以 OpenAI 最新文件為準） | 允許 | 待線上驗證 |
| PerplexityBot | Perplexity 搜尋索引 | 允許 | 待線上驗證 |
| Perplexity-User | 使用者觸發的讀取 | 允許 | 待線上驗證 |
| ClaudeBot／Claude-SearchBot／Claude-User | Anthropic：訓練／搜尋／使用者觸發 | 允許 | 待線上驗證 |
| Applebot／Applebot-Extended | Apple 搜尋／模型訓練用途控制 | 允許 | 待線上驗證 |
| CCBot | Common Crawl（常被用於模型訓練） | 允許 | 待線上驗證 |

搜尋索引、AI 搜尋、使用者觸發、模型訓練是不同用途。是否允許「訓練用」爬蟲（GPTBot、Google-Extended、ClaudeBot、CCBot、Applebot-Extended）是業主的政策決定；封鎖它們不會影響搜尋索引類爬蟲。

### A-01｜P0（驗證）｜Cloudflare 可能在 repo 之外封鎖或改寫
- Cloudflare 提供 AI 爬蟲封鎖（Block AI bots／AI Crawl Control）、代管 robots.txt（會在網站的 robots.txt 前面加上規則）、Bot Fight Mode、WAF 規則。這些都在 Cloudflare 後台設定，repo 看不到；部分設定可能在網域加入時就預設開啟。
- 本次無法連線到正式網域 → **待線上驗證**。上線前在 Cloudflare 後台確認上述設定，並實際讀取 `https://www.bigxreality.com/robots.txt`，確認內容與 repo 輸出一致。可以用 Search Console 網址檢查，或以不同 User-Agent 實測。
- ChatGPT：否。

## 2. 逐頁可讀性（是什麼／適合誰／解決什麼問題）
| 頁面類型 | TW | EN | JP |
|---|---|---|---|
| 12 個產品頁 | 是什麼：Hero＋簡介 ✅；解決什麼：訓練挑戰 4 張卡 ✅；適合誰：情境＋FAQ「適合哪些單位」✅；限制與範圍：FAQ「能否取代實彈」「不等同實際反制設備」✅ | 是什麼：1 句；解決什麼：1 句；適合誰：Applications 1 句；限制與範圍：❌ | 同 EN |
| 6 個解決方案頁 | 是什麼、解決什麼 ✅；適合誰：只有消防有「適用訓練需求」；FAQ：❌ | 是什麼 ✅（較短）；其他部分缺漏（C-03） | 同 EN |
| 產品總覽 | 說明是 [待提供] ❌ | [待翻譯] 佔位、noindex | 同 EN |
| 公司介紹 | 3 段 ✅ | [待翻譯] 佔位、noindex | 同 EN |
| 首頁、核心技術 | 不存在 ❌ | ❌ | ❌ |

產品頁的內容是各產品專屬的，沒有大量套用相同的空泛文字。例外是 EN／JP 結尾 CTA 一律是「Contact Our Team」，以及英日句型高度相似（「selected …」這類限定語出現在 9 個英文產品檔）。

## 3. 問題清單

### A-02｜P1｜英日沒有任何常見問題
- 證據：繁中 12 個產品頁 × 5 題＝60 題（`src/content/products/tw/*.md` `faq`），有可見的 `<details>` 與 FAQPage JSON-LD（〔建置〕60 題全部與可見文字一致）。英日 0 題；`ui/{en,jp}.json` 的 `faq.title` 也是「[待翻譯] 常見問題」。
- 影響：繁中 FAQ 正是 AI 搜尋最容易直接引用的「問題＋答案」，也包含「不是遊戲」「不能取代實彈」「不是實際反制設備」等關鍵的範圍聲明。英日完全缺少這些內容。
- 建議：英日依繁中 FAQ 翻譯，填入 `src/content/products/{en,jp}/*.md` 的 `faq`。翻譯後會自動顯示並輸出 FAQPage。
- ChatGPT：是（翻譯；繁中原文在 03）。交叉：C-07。

### A-03｜P1｜「嚴肅遊戲（Serious Games）」概念只出現在繁中產品 FAQ
- 證據〔建置〕：「嚴肅遊戲」只出現在 11 個繁中產品頁的 FAQ 第一題（SUT 有附英文「Serious Games」；兵棋圖台寫「與嚴肅遊戲具有相近的互動學習概念」）。解決方案頁、公司介紹、英日全站都沒有；也沒有說明這個理念的頁面（核心技術頁不存在）。
- 誤判風險：英日產品名與文案中有「Wargaming／ウォーゲーミング」，也有「simulated firing」「Explore … Training」等字眼，但沒有任何一處說明「不是娛樂遊戲」。繁中則有明確的「不是遊戲」問答。
- 建議：英日翻譯繁中 FAQ 第一題；在公司介紹或核心技術頁，用一段繁中母版文字定義 BXR 的嚴肅遊戲設計理念（目的、和娛樂遊戲的差異、與訓練評估的關係），再翻譯英日。
- ChatGPT：是（先寫繁中定義段落，再翻譯）。

### A-04｜P2｜整合能力的說法前後不一致
- 證據：
  - 產品總覽的 MUM-T 整合情境：「SUT 人員的胸掛顯示板可觀看 UAV、USV 的整合影像」。
  - SUT FAQ：「目前已確認的整合應用之一，是 USV 系統的影像資訊可傳送至 SUT…其他無人機、無人船或外部系統的連接方式，需依實際介面與專案條件確認」。
  - MUM-T 方案頁（TW）：「依據已完成的整合功能」；（EN）「must be assessed and confirmed」。
  - Counter-UAS 情境：「SUT 地面士兵持槍對空中無人機目標進行模擬接戰」。
- 影響：AI 可能把「UAV 影像已整合到 SUT」當成事實引用，也可能引用彼此矛盾的說法。
- 建議：業主確認目前「已確認」的整合清單，統一繁中各頁說法，再翻譯。
- ChatGPT：是（業主確認後改寫繁中＋翻譯）。

### A-05｜P2｜品牌、產品、方案名稱不一致
- 詳表見 05 §3（C-13）。另外：公司在繁中寫作 Big x Reality、BXR、全球動力科技、全球動力科技股份有限公司；聯絡信箱網域是 gptt.com.tw，與品牌網域不同；英日沒有法定公司名稱（C-10）；沒有 sameAs（社群是 [待提供]）。
- 影響：AI 與知識圖譜較難把品牌、公司、產品對應成同一個實體。
- 建議：建立三語命名表與公司實體資料（法定名稱、品牌、網域、信箱網域的關係），套用到全站與 Organization。
- ChatGPT：是（業主提供事實後統一文案）。

### A-06｜P2｜繁中主文與繁中 FAQ 不一致（AI 可能引用到兩種說法）
- 兵棋圖台：主文沒有觸控與 VR；FAQ 寫「可運用觸控地圖…支援 VR 相關的空間視覺化」。
- 迫擊砲：主文是射擊結果「觀察／判讀」；FAQ 是「射擊修正」。
- VR 滅火：主文是「介紹」三種滅火器；FAQ 是「選擇與操作」；FAQ 用「消火器」，主文用「滅火器」。
- 機槍：FAQ 的「火力運用概念、目標應對」主文沒有。
- 建議：業主確認後統一繁中，再翻譯英日。
- ChatGPT：是。

### A-07｜P1｜公司實體資訊不足
- 證據：英日公司介紹是佔位頁（C-04）；地址、電話、社群是 [待提供]；首頁不存在；Organization 只有 name、url（404）、logo、slogan、email、legalName（只有繁中）。
- 影響：AI 回答「BXR 是什麼公司、在哪裡、做什麼」時，可取用的依據很少。
- 建議：翻譯公司介紹；補上可公開的地址與電話（業主提供，不可推測）。
- ChatGPT：是（翻譯）。交叉：C-04、S-03。

### A-08｜P3｜比較型內容只在繁中 FAQ
- 繁中 FAQ 已涵蓋：全配式 vs BOX、快艇 vs USV、兵棋圖台 vs NOVA、無人機訓練 vs 反制無人機訓練、模擬 vs 實彈／實車／實船。英日沒有（A-02）。解決方案頁沒有 FAQ（K-13～K-19）。

### A-09｜P2｜內部製作備註「素材需求」出現在可索引內容中
- 見 T-08。AI 可能把「素材需求｜…」當作頁面敘述。

### A-10｜P3｜沒有可引用的實證內容
- 案例、新聞、技術文章三語都是 0 篇（列表頁 noindex）。AI 引用通常需要可查證的來源（實際導入、展覽、獲獎等）。不得編造；只能在業主提供可公開的資料後建立。
- ChatGPT：是（業主提供素材後撰寫繁中）。

### A-11｜P3｜沒有技術說明頁
- `/technologies/` 不存在（T-03）。XR、VR、AR、AI 行為模擬、6DOF、動態平台、數位雙生等名詞，各自分散在產品頁中，沒有統一的定義頁。
- ChatGPT：是（先寫繁中）。

### A-12｜P3｜無法驗證的性能與規格宣稱（需要業主確認，不代表有誤）
以下內容只能由業主確認，AI 會直接引用：「自主研發擬真滅火器鋼瓶模組，依實際比例與重量分布設計」「兩支 VIVE 控制器、6DOF」「AI 行為模擬調整敵我行為」「USV 影像串流至 SUT（已確認）」「XR 任務資訊（威脅位置、隊友狀態）」「動態平台」。繁中 FAQ 已經附上不少範圍聲明（「依配置確認」「不代表…」），這是正確做法；英日目前沒有任何範圍聲明。
