# 08｜結構化資料（Schema.org／JSON-LD）

版本／方法：見 01。來源：`src/components/SeoHead.astro`（Organization、BreadcrumbList、Product）、`src/lib/faq.ts`（FAQPage）、`src/pages/[lang]/solutions/index.astro`（CollectionPage）。〔建置〕解析了 93 頁的全部 JSON-LD。
Google Rich Results Test 與 Search Console：**待線上驗證**。

## 1. 現況
| 頁面類型 | TW | EN | JP |
|---|---|---|---|
| 全部 93 頁 | Organization＋BreadcrumbList | 同 | 同 |
| 12 個產品頁 | ＋Product＋**FAQPage（5 題）** | ＋Product（無 FAQPage） | ＋Product（無 FAQPage） |
| 解決方案總覽 | ＋CollectionPage（ItemList，4 個領域方案） | 同 | 同 |
| 6 個解決方案頁、公司、聯絡、列表頁 | 只有 Organization＋BreadcrumbList | 同 | 同 |
| WebSite、WebPage、Article | 無（沒有首頁；沒有文章） | 同 | 同 |

## 2. 檢查結果
| 檢查 | 結果 |
|---|---|
| 1. JSON 語法 | ✅ 93/93 可解析；以單一 `@graph` 輸出；`<` 已跳脫 |
| 2. 與可見內容一致 | ✅ Product.name＝頁面產品名；Product.description＝可見的副標；FAQPage 60 題的問題與答案逐字出現在可見的 `<details>` 中；Breadcrumb 名稱＝可見的麵包屑 |
| 3. 不存在的價格、評分、評論、規格 | ✅ 沒有 offers、aggregateRating、review；沒有編造規格 |
| 4. 公司名稱、地址、電話、網址 | ⚠️ 沒有編造地址或電話（[待提供] 時不輸出，正確）；但 url 與 breadcrumb 首項指向 404（S-01、S-02）；英日缺 legalName（S-03） |
| 5. 三語對應各自語言 | ✅ 名稱與描述都使用該頁語言；FAQPage 的 inLanguage＝zh-Hant-TW；其他節點沒有 inLanguage（非必要） |
| 6. FAQ 與可見內容一致 | ✅ 繁中 60/60；英日沒有 FAQ（S-05） |
| 7. 重複、矛盾或無效的 Schema | ✅ 沒有重複；Organization 在每頁使用相同 `@id`；Product.brand 參照同一個 `@id` |
| `[待…]` 標記外洩 | ✅ 程式會排除含「[待」的描述（`SeoHead.astro`） |

## 3. 問題清單

### S-01｜P2｜Organization.url 指向會變成 404 的網址
- 證據：`"url":"https://www.bigxreality.com/"`（93 頁）→ 301 `/en/` → 404（T-01）。
- 建議：首頁建立後自然就會修正；或指向一個存在的頁面。ChatGPT：否。

### S-02｜P2｜BreadcrumbList 第一項指向 404
- 證據：`{"position":1,"name":"首頁","item":"https://www.bigxreality.com/tw/"}`，三語都相同（T-01）。
- 建議：建立首頁；或在首頁建立前，從 BreadcrumbList 省略首頁這一項。ChatGPT：否。

### S-03｜P2｜英日 Organization 缺 legalName；三語都沒有 sameAs、address、telephone
- 證據：`legalName` 只有在 tw 輸出（`site.json` `companyName.en／jp` 是 [待提供]）；社群、地址、電話是 [待提供]。
- 建議：業主提供正式資料後補上。不得推測。ChatGPT：否（事實資料）。交叉：C-10、A-05、A-07。

### S-04｜P2｜沒有 WebSite 節點
- Google 通常從首頁的 WebSite 結構化資料取得網站名稱；目前沒有首頁（T-01）。
- 建議：與首頁一起加入 WebSite（name、alternateName、url）。不需要 SearchAction（Google 已不再顯示 sitelinks 搜尋框）。ChatGPT：否。

### S-05｜P1｜英日沒有 FAQPage
- 原因：英日沒有 FAQ 內容（C-07、A-02）。翻譯完成並填入 `faq` 後會自動輸出，不需要改程式。
- 備註：Google 自 2023 年 8 月起，只對少數權威的政府與醫療網站顯示 FAQ 複合式搜尋結果；所以 FAQPage 的主要價值是語意理解，不是保證顯示複合式結果。
- ChatGPT：是（翻譯 FAQ）。

### S-06｜P3｜Product 缺 image；不符合 Google 產品複合式結果的資格
- 證據：12 頁 Product 都沒有 image（SUT 有實際照片 `sut-hero.jpg`，但產品頁使用的 landing 版型沒有把圖片傳給 Product）。Google 產品摘要需要 offers、review 或 aggregateRating 之一，目前都沒有。
- 建議：有核准的照片後加入 image。**不要為了取得複合式結果而加入價格或評分**；B2B 國防與警用產品可以不提供 offers。ChatGPT：否。

### S-07｜P3｜英日 Product.description 是精簡版副標
- 證據：EN／JP 的 Product.description＝英日副標（與繁中意思不同，C-01）。翻譯完成後會自動一致。ChatGPT：是（翻譯）。

### S-08｜P3（可選）｜解決方案頁沒有頁面層級的類型
- 6 個解決方案頁只有 Organization＋Breadcrumb。可以考慮加入 WebPage（含 about 與 mentions 指向相關 Product），但不是必要項目；不建議為了增加數量而加入 Service 等類型，除非內容確實是可訂購的服務。ChatGPT：否。

## 4. 不建議的做法
- 不要在沒有真實數據時加入 AggregateRating、Review、Offer、price。
- 在沒有可見問答的頁面，不要加入 FAQPage（例如解決方案頁目前沒有 FAQ）。
- 在沒有步驟式教學的頁面，不要加入 HowTo（Google 已停止顯示 HowTo 複合式結果）。
