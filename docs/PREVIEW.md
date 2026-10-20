# 預覽網站（GitHub Pages）

網址：**https://magician-eric.github.io/bigxreality-web/**

- 每次有變更合併（或直接推送）到 `main`，GitHub Actions 會自動重新 build 預覽網站，約 5–8 分鐘後更新。進度可在 repo 的 **Actions → Preview (GitHub Pages)** 查看。
- 內容來自本 repo 的 Markdown（`src/content`）與圖片，保留三語、產品、解決方案、新聞、案例、CIS 字型、SEO 標記與站內搜尋。
- **不會被搜尋引擎收錄**：每一頁都有 `noindex`，`robots.txt` 禁止所有爬蟲，sitemap 是空的。
- **不含測試資料**：只要出現 `TEST FIXTURE`，build 就會失敗，不會發布。
- 這不是正式網站，也和 Cloudflare 無關。EmDash 後台（`/_emdash`）只能在正式部署或本機開發時使用，預覽網站沒有後台。
- 首頁、技術、公司、聯絡、隱私權頁面尚未製作，連到這些頁面會顯示 404；打開預覽網址會直接進入繁中產品總覽。

## 第一次啟用（只需做一次）
Repo **Settings → Pages → Build and deployment → Source** 選 **GitHub Actions**。
之後到 **Actions → Preview (GitHub Pages) → Run workflow** 執行一次，或推送到 `main`。

## 修改內容並預覽
1. 在 GitHub 網頁上直接編輯 `src/content/...` 的 Markdown（或開 PR）。
2. 合併到 `main` 後等 Actions 完成，重新整理預覽網址。

## 本機預覽（同樣的檔案）
```bash
npm ci
npm run preview:build     # 產生 dist-preview/（放在 /bigxreality-web/ 之下）
npm run preview:check     # 連結、noindex、測試資料、搜尋檢查
npm run build && npm run qa:behaviour   # 一般本機 build 與測試
```
