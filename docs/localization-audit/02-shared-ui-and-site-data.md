# 02｜全站共用區塊、介面文字與站點資料

> 版本與方法見 [01](01-page-inventory-and-method.md)。相關問題：C-05、C-06、C-09、C-10（SEO 影響見 T-01、T-03、S-01～S-03）。

## 1. Header 與下拉選單 —— ✅ 三語結構一致
〔建置〕三語 93 頁的 Header 只有一種版本（各語言內完全相同）。

| 項目 | TW | EN | JP |
|---|---|---|---|
| 主選單 | 解決方案／產品介紹／核心技術／資源中心／關於 BXR | Solutions／Products／Core Technology／Resources／About BXR | ソリューション／製品情報／コア技術／リソース／BXRについて |
| 資源中心下拉 | 最新消息、技術專欄、成功案例 | News、Insights、Case Studies | ニュース、技術コラム、導入事例 |
| 關於 BXR 下拉 | 關於我們、發展歷程、經營團隊、合作夥伴、投資人專區、聯絡我們 | About Us、History、Management Team、Partners、Investor Relations、Contact Us | 会社概要、沿革、経営陣、パートナー、投資家情報、お問い合わせ |
| 搜尋／語言切換／聯絡按鈕 | ✅ | ✅ | ✅ |

三語共同問題（繁中也有）：「核心技術」連到 `/{lang}/technologies/`，Logo 連到 `/{lang}/`，兩者都是 404 → 見 **T-01、T-03**。

## 2. 手機版選單 —— ✅
〔原始碼／建置〕手機版與桌機版共用同一份選單標記（`#site-menu`，`src/components/Header.astro`），三語項目一致；「開啟選單／關閉選單」都已翻譯。

## 3. Footer —— ⚠️（C-10）
| 項目 | TW | EN | JP |
|---|---|---|---|
| 版權列 | © 2026 全球動力科技股份有限公司 版權所有 | © 2026 **[待提供]** All rights reserved | © 2026 **[待提供]** All rights reserved |
| 人才招募、地址、電話、社群 | [待提供] | [待提供] | [待提供] |
| Email | service@gptt.com.tw | 同 | 同 |
| 隱私權政策連結 | `/tw/privacy/`（404） | `/en/privacy/`（404） | `/jp/privacy/`（404） |

- **C-10（P2）**：`src/data/site.json` 的 `companyName.en`、`companyName.jp` 是「[待提供]」，所以英日頁尾和 JSON-LD 的 `legalName` 都缺 → 見 **S-03**。需要業主提供正式英文、日文公司名稱（屬於事實資料，不是翻譯）。
- 日文版權用語是英文「All rights reserved」（`ui/jp.json` `footer.rights`），屬於 P4。

## 4. Breadcrumb —— ✅ 已翻譯，⚠️ 第一層 404
三語都是「首頁 > 產品介紹 > 產品名」的結構，JSON-LD 的 BreadcrumbList 名稱也都已翻譯。第一層「首頁」連到 `/{lang}/`，三語都是 404 → 見 **T-01、S-02**。

## 5. CTA（C-09，P2）
| 位置 | TW | EN | JP | 問題 |
|---|---|---|---|---|
| 產品 Hero 主按鈕（連到聯絡頁並帶入產品） | 洽詢 ○○ | Explore ○○ Training | ○○の詳細を見る | 英日寫「探索／查看詳細」，實際是前往洽詢 |
| 產品結尾 CTA | 每頁專屬標題＋說明 | 「Contact Our Team」，無說明（12 頁相同） | 「担当者に相談する」，無說明 | 繁中的專屬標題與說明在英日缺漏 → C-01 |
| 解決方案 Hero 按鈕 | 洽詢○○解決方案 | Discuss…／Explore Fire Training Solutions／Contact BXR／Contact Our Team | 相談する／見る／お問い合わせ | 用語不一致；消防用「Explore／見る」語意不符 |
| 解決方案總覽結尾 CTA | 無 | 有（Let's Build a Solution Around Your Mission.） | 有 | 英日新增 → C-08 |
| 回到列表連結 | 無（`backToProducts`、`backToSolutions` 是空字串） | Back to Products／Solutions | 製品一覧へ戻る／ソリューション一覧へ戻る | 英日新增 → C-08 |
| `buttons.demo` | 預約展示 Book a demo | Book a Live Demo | 担当者に相談する | 日文變成「與負責人洽談」 |

## 6. 聯絡頁與提示文字（C-06，P1）
〔建置〕`/en/contact/`、`/jp/contact/`：
- 頁首標題、說明、洽詢項目（7 種）、三步驟說明、「寄送 Email」按鈕、「或直接寄信至」，全部是「[待翻譯] 中文」（`ui/*.json` `contactPage.*`，32 個字串）。
- **按下「寄送 Email」後，郵件主旨與內文格式是中文加上「[待翻譯]」**：建置 HTML 的 `data-body` 是 `[待翻譯] 姓名：…`，`data-topics` 是 `{"general":{"title":"[待翻譯] 一般洽詢",…}}`。這份內容會直接寄給客戶使用。
- 頁面是 `noindex`，也不在 sitemap 裡（因為 `pages/{en,jp}/contact.md` 的 `translationStatus: pending`）→ SEO 影響見 **T-05**。
- 三語共同問題：型錄申請與 Demo 預約的表單網址是「[待提供]」（`site.json` `forms`），按鈕沒有連結。
- 聯絡方式是 Email，不是表單；頁面沒有表單欄位驗證或送出提示可以比對。

## 7. 介面文字（C-05，P1）
〔原始碼〕`src/content/ui/{tw,en,jp}.json` 共 297 個字串，三語的鍵完全相同（沒有缺鍵）。

| 群組 | EN 未翻譯 | JP 未翻譯 | 出現位置 |
|---|---|---|---|
| contactPage | 32 | 32 | 聯絡頁（包含 Email 內容） |
| cases | 32 | 31 | 成功案例頁 |
| article | 26 | 26 | 新聞與文章內頁（目前沒有文章） |
| companyPages | 24 | 24 | 歷程、團隊、夥伴、投資人頁 |
| product | 20 | 14 | 舊版產品版型；產品總覽的整合情境「參與產品」 |
| searchPage | 15 | 0 | 搜尋頁 |
| cta | 12 | 0 | 共用 CTA |
| listing | 11 | 11 | 列表頁、分頁 |
| solution | 8 | 4 | 舊版解決方案版型 |
| filter | 7 | 0 | 產品總覽篩選列 |
| productLanding | 4 | 1 | 產品頁標籤（訓練挑戰、訓練價值、訓練重點、素材需求） |
| **faq（新增）** | 1 | 1 | **產品頁 FAQ 區塊標題「常見問題」** |
| tags、articleTypes、其他 | 9 | 6 | 標籤頁、卡片類型 |
| **合計** | **201** | **150** | |

- 英日 12 個佔位頁上方的提示「[待翻譯] 本頁尚未完成翻譯。」本身是中文。
- 日文用語與繁中語意不一致（P4）：`productLanding.eyebrows.flow`（繁中 Training Flow → 日文「システムの特長」，意思是系統特色）、`focusLabel`（訓練重點 → 「主な機能」，意思是主要功能）、`eyebrows.audience` 和 `scenarios` 都用「活用分野」。

## 8. 站點資料（`src/data/site.json`）
| 欄位 | TW | EN | JP | 備註 |
|---|---|---|---|---|
| companyName | 全球動力科技股份有限公司 | [待提供] | [待提供] | C-10／S-03 |
| contact.address | [待提供] | [待提供] | [待提供] | 繁中母版也缺，業主提供 |
| contact.phone | [待提供] | 共用 | 共用 | 業主提供 |
| social、careersUrl | [待提供] | 共用 | 共用 | 會影響 Organization `sameAs` → S-03 |
| forms.brochure／demo | [待提供] | 共用 | 共用 | 業主提供 |

---

## 附錄 A：未翻譯介面字串的繁中原文（共 201 個，交由 ChatGPT 翻譯）
「❌」表示該語言仍是「[待翻譯]」。來源檔：`src/content/ui/tw.json`。`{n}`、`{q}`、`{total}` 是程式會替換的變數，翻譯時必須保留。

| 鍵 | 繁中原文 | EN | JP |
|---|---|---|---|
| `syntheticImage` | 合成示意 | ❌ | ✅ |
| `buttons.formPending` | 表單網址待提供 | ❌ | ✅ |
| `filter.groupLabel` | 依領域篩選 | ❌ | ✅ |
| `filter.all` | 全部 | ❌ | ✅ |
| `filter.searchLabel` | 搜尋產品 | ❌ | ✅ |
| `filter.searchPlaceholder` | 輸入產品名稱或關鍵字 | ❌ | ✅ |
| `filter.results` | 共 {n} 項產品 | ❌ | ✅ |
| `filter.empty` | 沒有符合條件的產品。 | ❌ | ✅ |
| `filter.reset` | 清除篩選 | ❌ | ✅ |
| `domains.other` | 其他 | ❌ | ✅ |
| `product.onThisPage` | 頁內導覽 | ❌ | ✅ |
| `product.sections.overview.title` | 產品概述 | ❌ | ✅ |
| `product.sections.capabilities.title` | 核心能力 | ❌ | ✅ |
| `product.sections.howItWorks.title` | 運作方式 | ❌ | ✅ |
| `product.sections.scenarios.title` | 訓練情境 | ❌ | ✅ |
| `product.sections.components.title` | 系統組成 | ❌ | ❌ |
| `product.sections.deployment.title` | 部署方式 | ❌ | ❌ |
| `product.sections.integratedOps.title` | 整合作戰 | ❌ | ❌ |
| `product.sections.relatedSolutions.title` | 關聯解決方案 | ❌ | ✅ |
| `product.sections.relatedArticles.title` | 相關文章 | ❌ | ❌ |
| `product.deployment.personnel` | 人數 | ❌ | ❌ |
| `product.deployment.area` | 空間 | ❌ | ❌ |
| `product.deployment.setupTime` | 時間 | ❌ | ❌ |
| `product.deployment.notes` | 說明 | ❌ | ❌ |
| `product.deployment.personUnit` | 人 | ❌ | ❌ |
| `product.deployment.minuteUnit` | 分鐘 | ❌ | ❌ |
| `product.deployment.approx` | 約 | ❌ | ❌ |
| `product.integratedScenario` | 整合訓練情境 | ❌ | ❌ |
| `product.integratesWith` | 可整合的產品 | ❌ | ❌ |
| `product.participants` | 參與產品 | ❌ | ❌ |
| `articleTypes.insights` | 技術文章 | ❌ | ❌ |
| `articleTypes.news` | 消息 | ❌ | ❌ |
| `articleTypes.case-studies` | 成功案例 | ❌ | ❌ |
| `solution.sections.overview.title` | 方案概述 | ❌ | ✅ |
| `solution.sections.challenges.title` | 面臨的挑戰 | ❌ | ❌ |
| `solution.sections.capabilities.title` | 方案能力 | ❌ | ❌ |
| `solution.sections.relatedProducts.title` | 相關產品 | ❌ | ✅ |
| `solution.sections.caseStudies.title` | 實際應用案例 | ❌ | ✅ |
| `solution.sections.insights.title` | 相關技術文章 | ❌ | ❌ |
| `solution.sections.news.title` | 相關消息 | ❌ | ❌ |
| `solution.explore` | 了解方案 | ❌ | ✅ |
| `article.published` | 發布 | ❌ | ❌ |
| `article.updated` | 更新 | ❌ | ❌ |
| `article.author` | 作者 | ❌ | ❌ |
| `article.readingTime` | 閱讀時間約 {n} 分鐘 | ❌ | ❌ |
| `article.tags` | 標籤 | ❌ | ❌ |
| `article.related.title` | 延伸閱讀 | ❌ | ❌ |
| `article.relatedProducts.title` | 相關產品 | ❌ | ❌ |
| `article.relatedSolutions.title` | 相關解決方案 | ❌ | ❌ |
| `article.categories.company` | 公司消息 | ❌ | ❌ |
| `article.categories.exhibition` | 展覽活動 | ❌ | ❌ |
| `article.categories.award` | 獲獎 | ❌ | ❌ |
| `article.categories.product-launch` | 產品發表 | ❌ | ❌ |
| `article.categories.partnership` | 合作夥伴 | ❌ | ❌ |
| `article.categories.media` | 媒體報導 | ❌ | ❌ |
| `article.event` | 活動 | ❌ | ❌ |
| `article.location` | 地點 | ❌ | ❌ |
| `article.date` | 日期 | ❌ | ❌ |
| `article.source` | 報導來源 | ❌ | ❌ |
| `article.sourceLink` | 閱讀原文 | ❌ | ❌ |
| `article.client` | 客戶 | ❌ | ❌ |
| `article.anonymized` | （匿名） | ❌ | ❌ |
| `article.domains` | 領域 | ❌ | ❌ |
| `article.products` | 使用產品 | ❌ | ❌ |
| `article.challenge` | 挑戰 | ❌ | ❌ |
| `article.solution` | 導入方案 | ❌ | ❌ |
| `article.outcomes` | 成果 | ❌ | ❌ |
| `listing.empty` | 目前還沒有內容。 | ❌ | ❌ |
| `listing.count` | 共 {n} 篇 | ❌ | ❌ |
| `listing.pagination` | 分頁 | ❌ | ❌ |
| `listing.previous` | 上一頁 | ❌ | ❌ |
| `listing.next` | 下一頁 | ❌ | ❌ |
| `listing.page` | 第 {n} 頁 | ❌ | ❌ |
| `listing.pageOf` | 第 {n} 頁，共 {total} 頁 | ❌ | ❌ |
| `listing.filterEmpty` | 沒有符合條件的案例。 | ❌ | ❌ |
| `listing.filterResults` | 共 {n} 個案例 | ❌ | ❌ |
| `listing.filterSearchLabel` | 搜尋案例 | ❌ | ❌ |
| `listing.filterSearchPlaceholder` | 輸入客戶、產品或關鍵字 | ❌ | ❌ |
| `tags.title` | 標籤 | ❌ | ❌ |
| `tags.count` | {n} 篇 | ❌ | ❌ |
| `tags.allTags` | 所有標籤 | ❌ | ❌ |
| `searchPage.label` | 搜尋關鍵字 | ❌ | ✅ |
| `searchPage.placeholder` | 輸入產品、解決方案或文章關鍵字 | ❌ | ✅ |
| `searchPage.submit` | 搜尋 | ❌ | ✅ |
| `searchPage.typesLabel` | 內容類型 | ❌ | ✅ |
| `searchPage.types.all` | 全部 | ❌ | ✅ |
| `searchPage.types.products` | 產品 | ❌ | ✅ |
| `searchPage.types.solutions` | 解決方案 | ❌ | ✅ |
| `searchPage.types.news` | 消息 | ❌ | ✅ |
| `searchPage.types.insights` | 技術文章 | ❌ | ✅ |
| `searchPage.types.case-studies` | 成功案例 | ❌ | ✅ |
| `searchPage.results` | 找到 {n} 筆結果 | ❌ | ✅ |
| `searchPage.empty` | 找不到符合「{q}」的結果。 | ❌ | ✅ |
| `searchPage.hint` | 請輸入至少兩個字。 | ❌ | ✅ |
| `searchPage.noscript` | 搜尋功能需要啟用 JavaScript。 | ❌ | ✅ |
| `searchPage.error` | 搜尋暫時無法使用，請稍後再試。 | ❌ | ✅ |
| `cta.exploreProducts` | 探索產品 | ❌ | ✅ |
| `cta.findSolutions` | 尋找解決方案 | ❌ | ✅ |
| `cta.viewProducts` | 查看產品 | ❌ | ✅ |
| `cta.viewSolutions` | 查看解決方案 | ❌ | ✅ |
| `cta.viewIntegrated` | 了解整合訓練 | ❌ | ✅ |
| `cta.bookDemo` | 預約產品展示 | ❌ | ✅ |
| `cta.requestInfo` | 索取產品資料 | ❌ | ✅ |
| `cta.productInquiry` | 洽詢產品 | ❌ | ✅ |
| `cta.solutionInquiry` | 洽詢解決方案 | ❌ | ✅ |
| `cta.solutionDemo` | 預約展示 | ❌ | ✅ |
| `cta.discussNeeds` | 討論需求 | ❌ | ✅ |
| `cta.learnMore` | 了解更多 | ❌ | ✅ |
| `productLanding.sections.challenge.title` | 訓練挑戰 | ❌ | ✅ |
| `productLanding.valueLabel` | 訓練價值 | ❌ | ✅ |
| `productLanding.focusLabel` | 訓練重點 | ❌ | ✅ |
| `productLanding.mediaNeed` | 素材需求｜ | ❌ | ❌ |
| `contactPage.topicLabel` | 洽詢項目 | ❌ | ❌ |
| `contactPage.topics.general.title` | 一般洽詢 | ❌ | ❌ |
| `contactPage.topics.general.subject` | 一般洽詢 | ❌ | ❌ |
| `contactPage.topics.demo.title` | 預約產品展示 | ❌ | ❌ |
| `contactPage.topics.demo.subject` | 預約產品展示 | ❌ | ❌ |
| `contactPage.topics.info.title` | 索取產品資料 | ❌ | ❌ |
| `contactPage.topics.info.subject` | 索取產品資料 | ❌ | ❌ |
| `contactPage.topics.product.title` | 洽詢產品 | ❌ | ❌ |
| `contactPage.topics.product.subject` | 產品洽詢 | ❌ | ❌ |
| `contactPage.topics.solution.title` | 洽詢解決方案 | ❌ | ❌ |
| `contactPage.topics.solution.subject` | 解決方案洽詢 | ❌ | ❌ |
| `contactPage.topics.solution-demo.title` | 預約展示 | ❌ | ❌ |
| `contactPage.topics.solution-demo.subject` | 預約解決方案展示 | ❌ | ❌ |
| `contactPage.topics.needs.title` | 討論訓練需求 | ❌ | ❌ |
| `contactPage.topics.needs.subject` | 訓練需求討論 | ❌ | ❌ |
| `contactPage.about` | 關於 | ❌ | ❌ |
| `contactPage.steps.title` | 以 Email 與我們聯繫 | ❌ | ❌ |
| `contactPage.steps.items[0].title` | 按下「寄送 Email」 | ❌ | ❌ |
| `contactPage.steps.items[0].description` | 系統會開啟您的郵件軟體，主旨與信件格式已依洽詢項目填好。 | ❌ | ❌ |
| `contactPage.steps.items[1].title` | 補上聯絡資料與需求 | ❌ | ❌ |
| `contactPage.steps.items[1].description` | 請填寫姓名、單位、職稱、國家、電話，以及希望了解的內容。 | ❌ | ❌ |
| `contactPage.steps.items[2].title` | 寄出後由業務聯繫 | ❌ | ❌ |
| `contactPage.steps.items[2].description` | 我們收到來信後，將由業務人員與您聯繫，確認需求與後續安排。 | ❌ | ❌ |
| `contactPage.sendEmail` | 寄送 Email | ❌ | ❌ |
| `contactPage.orWrite` | 或直接寄信至 | ❌ | ❌ |
| `contactPage.bodyFields[0]` | 姓名： | ❌ | ❌ |
| `contactPage.bodyFields[1]` | 公司／單位： | ❌ | ❌ |
| `contactPage.bodyFields[2]` | 職稱： | ❌ | ❌ |
| `contactPage.bodyFields[3]` | 國家： | ❌ | ❌ |
| `contactPage.bodyFields[4]` | 電話： | ❌ | ❌ |
| `contactPage.bodyFields[5]` | 需求說明： | ❌ | ❌ |
| `contactPage.noEmail` | 聯絡信箱尚未設定。 | ❌ | ❌ |
| `cases.filterLabel` | 篩選成功案例 | ❌ | ❌ |
| `cases.domain` | 應用領域 | ❌ | ❌ |
| `cases.product` | 關聯產品 | ❌ | ❌ |
| `cases.solution` | 關聯解決方案 | ❌ | ❌ |
| `cases.all` | 全部 | ❌ | ❌ |
| `cases.learnMore` | 了解完整案例 | ❌ | ❌ |
| `cases.count` | 共 {n} 個案例 | ❌ | ❌ |
| `cases.filterResults` | 共 {n} 個案例 | ❌ | ❌ |
| `cases.filterEmpty` | 沒有符合條件的案例 | ❌ | ❌ |
| `cases.empty` | 成功案例整理中，目前尚無已發布的案例 | ❌ | ❌ |
| `cases.emptyHint` | 如需了解沉浸式模擬訓練如何配合您的任務需求，歡迎與我們聯絡 | ❌ | ❌ |
| `cases.emptyCta` | 聯絡我們 | ❌ | ❌ |
| `cases.client` | 導入單位 | ❌ | ❌ |
| `cases.domains` | 應用領域 | ❌ | ❌ |
| `cases.products` | 關聯產品 | ❌ | ❌ |
| `cases.solutions` | 關聯解決方案 | ❌ | ❌ |
| `cases.anonymized` | （單位資訊匿名） | ❌ | ❌ |
| `cases.section.background` | 專案背景 | ❌ | ❌ |
| `cases.section.challenge` | 面臨的訓練挑戰 | ❌ | ❌ |
| `cases.section.solution` | 導入解決方案 | ❌ | ❌ |
| `cases.section.application` | 實際應用方式 | ❌ | ❌ |
| `cases.section.results` | 專案成果與效益 | ❌ | ❌ |
| `cases.section.gallery` | 現場影像 | ❌ | ❌ |
| `cases.section.details` | 專案詳述 | ❌ | ❌ |
| `cases.section.relatedItems` | 相關產品與解決方案 | ❌ | ❌ |
| `cases.section.more` | 延伸閱讀 | ❌ | ❌ |
| `cases.viewProduct` | 前往產品頁 | ❌ | ❌ |
| `cases.viewSolution` | 前往解決方案頁 | ❌ | ❌ |
| `cases.block.learnMore` | 了解完整案例 | ❌ | ✅ |
| `cases.cta.title` | 與我們討論您的訓練需求 | ❌ | ❌ |
| `cases.cta.description` | 歡迎洽詢，了解 Big x Reality 如何依據實際任務需求規劃訓練應用 | ❌ | ❌ |
| `cases.cta.button` | 聯絡我們 | ❌ | ❌ |
| `companyPages.empty` | 資料整理中，目前尚無已公開的內容 | ❌ | ❌ |
| `companyPages.hint` | 如需進一步了解，歡迎與我們聯絡 | ❌ | ❌ |
| `companyPages.cta` | 聯絡我們 | ❌ | ❌ |
| `companyPages.download` | 下載 | ❌ | ❌ |
| `companyPages.date` | 日期 | ❌ | ❌ |
| `companyPages.category` | 分類 | ❌ | ❌ |
| `companyPages.modulesLabel` | 投資人專區模組 | ❌ | ❌ |
| `companyPages.partnerCategories.technology` | 技術合作 | ❌ | ❌ |
| `companyPages.partnerCategories.integration` | 系統整合 | ❌ | ❌ |
| `companyPages.partnerCategories.international` | 國際通路合作 | ❌ | ❌ |
| `companyPages.investorModules.profile.title` | 公司基本資料 | ❌ | ❌ |
| `companyPages.investorModules.profile.description` | 公司名稱、登記資訊、設立日期、實收資本額及其他正式公開的企業基本資訊 | ❌ | ❌ |
| `companyPages.investorModules.financials.title` | 財務資訊 | ❌ | ❌ |
| `companyPages.investorModules.financials.description` | 年度財務報告、營收資訊、財務相關文件及下載功能 | ❌ | ❌ |
| `companyPages.investorModules.governance.title` | 公司治理 | ❌ | ❌ |
| `companyPages.investorModules.governance.description` | 公司治理架構、董事會資訊、重要治理政策及相關公開文件 | ❌ | ❌ |
| `companyPages.investorModules.shareholders.title` | 股東資訊 | ❌ | ❌ |
| `companyPages.investorModules.shareholders.description` | 股東會資訊、股務公告、股利資訊及相關文件 | ❌ | ❌ |
| `companyPages.investorModules.announcements.title` | 重大訊息與公告 | ❌ | ❌ |
| `companyPages.investorModules.announcements.description` | 公司正式對外揭露的重要訊息、公告日期及附件 | ❌ | ❌ |
| `companyPages.investorModules.briefings.title` | 法人說明會 | ❌ | ❌ |
| `companyPages.investorModules.briefings.description` | 投資人簡報、法人說明會資料及相關影音或文件 | ❌ | ❌ |
| `companyPages.investorModules.contact.title` | 投資人聯絡窗口 | ❌ | ❌ |
| `companyPages.investorModules.contact.description` | 投資人關係聯絡資訊及正式洽詢管道 | ❌ | ❌ |
| `faq.title` | 常見問題 | ❌ | ❌ |
