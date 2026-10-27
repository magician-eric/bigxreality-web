# 客戶 Logo 維護

共用資料：`src/data/client-logos.json`；資產匯入：`src/lib/client-logos.ts`；共用元件：`src/components/ClientLogos.astro`（marquee / grid）。

首頁位置為四大解決方案之後、實績案例之前；關於 BXR 使用靜態 5 / 3 / 2 欄網格。兩者讀取同一份設定，無額外分類或路由。

最新 main 實際有 26 張 PNG。空軍重複檔已由上游刪除，交通部及新創品牌檔名已由上游修正；本次沒有修改、移動、刪除或轉檔任何原圖。現有 26 張設定 enabled=true 用於 PR 畫面驗收，公開授權仍為 pending-company-confirmation，並非宣稱公司已取得授權。正式公開前由公司確認；不核准的檔案設 enabled=false，兩處同步隱藏。

TW Alt 直接取原檔名（不含副檔名）。尚無經確認的正式 EN / JP 名稱來源，因此暫用「Client or collaborating organization logo」及「導入先・協力機関のロゴ」；全部列在 `CLIENT-LOGO-REVIEW.csv`，確認後只需更新 alt.en / alt.jp 並清除 translationReview。Alt 不作為可見文字。

新增 Logo：上傳原始 PNG 至 `src/assets/images/clients/`，並於同一 JSON 增加 file、enabled、publicationReview、三語 alt、translationReview。未列入設定的圖片不自動公開。無核准網址時不提供連結。

動畫為 CSS 線性平移，按原圖比例預先計算行寬與時間；桌面約 30px/s、手機約 27px/s。兩個完全相同的群組避免接縫跳動；第二群組 aria-hidden=true 且圖片 alt 空白。Hover、焦點、手動暫停均停止；減少動態時改為可手動水平捲動的單組清單。無第三方套件，圖片寬高預先保留。
