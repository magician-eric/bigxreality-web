# 核心技術三語內容完整性驗收

實測建置目錄：`dist/client`（Markdown 正式備份模式，非 fixture／bootstrap）。共 352 項檢查，失敗 0 項。區塊數不含 Hero、關聯、FAQ 與結尾 CTA。段落數含 Hero、內容 items、備註與結尾 CTA。

| 頁面 | TW 區塊 | EN 區塊 | JP 區塊 | TW/EN/JP 段落 | TW/EN/JP FAQ | TW/EN/JP 圖片與 Alt | CTA | SEO | 翻譯完整性 | 新增宣稱 |
|---|---:|---:|---:|---|---|---|---|---|---|---|
| overview | 7 | 7 | 7 | 10 / 10 / 10 | 0 / 0 / 0 | 0 張內容圖；Alt N/A；圖位 aria-label 已驗證；0 張內容圖；Alt N/A；圖位 aria-label 已驗證；0 張內容圖；Alt N/A；圖位 aria-label 已驗證 | 三語 CTA 目的已逐一檢查 | 三語已檢查 | 完整；無缺稿標記 | 人工對照未見；不替代業主術語確認 |
| xr | 3 | 3 | 3 | 17 / 17 / 17 | 5 / 5 / 5 | 0 張內容圖；Alt N/A；圖位 aria-label 已驗證；0 張內容圖；Alt N/A；圖位 aria-label 已驗證；0 張內容圖；Alt N/A；圖位 aria-label 已驗證 | 三語 CTA 目的已逐一檢查 | 三語已檢查 | 完整；無缺稿標記 | 人工對照未見；不替代業主術語確認 |
| training-design | 4 | 4 | 4 | 24 / 24 / 24 | 5 / 5 / 5 | 0 張內容圖；Alt N/A；圖位 aria-label 已驗證；0 張內容圖；Alt N/A；圖位 aria-label 已驗證；0 張內容圖；Alt N/A；圖位 aria-label 已驗證 | 三語 CTA 目的已逐一檢查 | 三語已檢查 | 完整；無缺稿標記 | 人工對照未見；不替代業主術語確認 |
| domain-expertise | 4 | 4 | 4 | 23 / 23 / 23 | 5 / 5 / 5 | 0 張內容圖；Alt N/A；圖位 aria-label 已驗證；0 張內容圖；Alt N/A；圖位 aria-label 已驗證；0 張內容圖；Alt N/A；圖位 aria-label 已驗證 | 三語 CTA 目的已逐一檢查 | 三語已檢查 | 完整；無缺稿標記 | 人工對照未見；不替代業主術語確認 |

## CTA 明細

- tw/overview: /tw/technologies/xr/; /tw/technologies/training-design/; /tw/technologies/domain-expertise/
- tw/xr: 探索 XR 模擬訓練產品 → /tw/products/; 洽詢應用需求 → /tw/contact/; 洽詢 XR 訓練應用 → /tw/contact/
- tw/training-design: 探索模擬訓練產品 → /tw/products/; 洽詢訓練設計需求 → /tw/contact/; 洽詢模擬訓練規劃 → /tw/contact/
- tw/domain-expertise: 探索專業訓練解決方案 → /tw/solutions/; 洽詢訓練應用需求 → /tw/contact/; 洽詢專業訓練需求 → /tw/contact/
- en/overview: /en/technologies/xr/; /en/technologies/training-design/; /en/technologies/domain-expertise/
- en/xr: Explore XR simulation training products → /en/products/; Discuss your application requirements → /en/contact/; Discuss XR training applications → /en/contact/
- en/training-design: Explore simulation training products → /en/products/; Discuss your training design requirements → /en/contact/; Discuss simulation training planning → /en/contact/
- en/domain-expertise: Explore professional training solutions → /en/solutions/; Discuss your training application requirements → /en/contact/; Discuss your professional training requirements → /en/contact/
- jp/overview: /jp/technologies/xr/; /jp/technologies/training-design/; /jp/technologies/domain-expertise/
- jp/xr: XR シミュレーション訓練製品を見る → /jp/products/; 活用要件について相談する → /jp/contact/; XR 訓練の活用について相談する → /jp/contact/
- jp/training-design: シミュレーション訓練製品を見る → /jp/products/; 訓練設計の要件について相談する → /jp/contact/; シミュレーション訓練の計画について相談する → /jp/contact/
- jp/domain-expertise: 専門訓練ソリューションを見る → /jp/solutions/; 訓練の活用要件について相談する → /jp/contact/; 専門訓練の要件について相談する → /jp/contact/

此自動驗收可確認段落／清單／初始 HTML 的完整性與結構，並非翻譯語意或新增宣稱的獨立人工認證。文字是否忠於繁中母版仍需配合原稿與翻譯審閱。

## 人工內容審閱

以繁中正式原稿為母版，對照三語內容、清單與 FAQ。人工審閱未見新增「全部產品 AI 評分」、「所有系統即時互通」、認證／實戰驗證、固定專家編制或未確認研究成果等宣稱。既有正式產品內容維持不變，技術頁讀取既有產品資料建立關聯。

審閱已修正日文 XR 概念為「エクステンデッド・リアリティ」，與 AR「拡張現実」區分；保留原稿「可涵蓋」的條件語氣為「含まれる場合があります」，載具使用「ビークル」。此審閱不取代業主對專業術語與正式發布的確認。日文依繁中母版逐段製作，未以英文縮寫或摘要替代。

## 其他實測證據

- Markdown Astro Build 與 postbuild Pagefind 搜尋索引完成；正式 Markdown 完整性 352 項全部通過。
- Fixture Astro Build 與搜尋索引完成；技術頁完整性與文章聯動 367 項全部通過。TW fixture-insight-1 同時連到 XR／訓練設計，技術頁可反向連回文章；日文 pending、缺少英文翻譯不出現在列表，無相關文章時整塊隱藏。Fixture 依規則 noindex 且不進正式 sitemap。
- Astro 型別檢查 145 檔：0 errors、0 warnings、8 個既有 hints。
- 28 個單元測試通過。
- Sitemap 72 個 URL 通過；內部連結／資源 5,722 筆檢查，壞連結為零。另列六個既有規劃頁（各語首頁及 privacy）尚未實作，不計為新技術頁完成內容。
- 三語代表技術頁在桌面 1440px 與手機 390px 共六次 axe 驗證，critical、serious、moderate、minor 全部為零；手機選單鍵盤行為通過。技術頁專用驗收另逐一測試全部 12 頁於 390／820／1440px 沒有水平溢位。
- 真實本機 CMS 驗證：發布 → 草稿改標籤不影響已發布版本 → 再發布更新 → 真正 EmDash HTTP loader → 共用查詢 → insights 發布事件更新既有 cron 重建任務。測試資料與 token 已清理。
- 依業主最新要求，只保留圖片位置，不插入或新增照片／圖片資產。總覽及三項詳細頁 Hero、相關產品／解決方案／文章卡片保留既有圖位元件；各語圖位提供可讀的 aria-label。三語所有技術頁內容照片數為零，照片 Alt 為 N/A；既有裝飾性 sector icon 保留空 alt。技術頁 Footer 不輸出缺少資料的欄位，完整頁面 HTML 無 `[待提供]` 或 `[待翻譯]`。Git 檢查沒有新增網站圖片資產，12 項產品與解決方案正式內容、design-source 與 lockfile 均未修改。
- 已檢視代表頁桌面與手機截圖；截圖保存在忽略追蹤的 `.qa/technologies/`。

正式遠端 CMS schema 套用、Deploy Hook HTTP 成功、Workers Builds 部署與正式網域發布尚未執行。Google FAQ 官方文件本次擷取回 HTTP 403；技術頁不新增 FAQPage JSON-LD，保留可檢索 FAQ HTML，不承諾 FAQ 複合式結果、搜尋排名或 AI 推薦。
