# 舊網址清單（301 轉址用）

> 第一階段只記錄，不實作轉址。第二階段寫成 Cloudflare Pages 的 `public/_redirects`。
> 狀態：**不完整**。正式站 `www.bigxreality.com` 從本開發環境連不到（網路政策擋下），
> 舊 repo `bigxreality/bigxreality-website` 也不是正式站的原始碼（見下方說明），
> 所以目前只能列出文件中明確提到的網址。

## A. 正式站 `www.bigxreality.com`（需要 301）

| 舊網址 | 新網址 | 依據 | 狀態 |
|---|---|---|---|
| `/` | `/en/` | requirements-2.0 §4 | 已確認 |
| `/tw/home` | `/tw/` | requirements-2.0 §4 明列 | 已確認 |
| `/tw/packages` | `/tw/products/` | requirements-2.0 §1 提到舊套裝方案頁 | 新網址是提案，待確認 |
| `/tw/solutions` | `/tw/solutions/` | 舊 repo docs/solutions-copy-source.md | 只差結尾斜線，第二階段確認 |
| `/en/solutions` | `/en/solutions/` | 同上 | 同上 |
| `/en/home`、`/jp/home` | `/en/`、`/jp/` | 比照 `/tw/home` 推測 | **待確認舊站是否存在** |
| 消息頁 `news_content?param=…`、`?uuid=…`、`?id=…` | 對應的 `/[lang]/news/[slug]/` | 業主告知（2026-10-19） | **參數型**，`_redirects` 無法處理，改用 Pages Functions（見 PLAN §5）；需要逐筆的參數值清單 |
| 其他所有舊頁面 | — | — | **待提供**：需要舊站 sitemap.xml 或 Google Search Console「網頁」報表匯出 |

## B. 舊 repo 的開發預覽網址（不需要 301）

舊 repo 是一個未上線的改版草稿，部署在 `bigxreality.github.io/bigxreality-website/`，
用的是 `/zh-tw/`、`/ja/`、`/jp/` 路徑。這些網址從來沒有出現在正式網域上，所以
`www.bigxreality.com` 不需要為它們做 301。列在這裡只是為了避免誤會：

- `/zh-tw/`、`/zh-tw/solutions/{military,police,fire-rescue,smart-city}/`
- `/en/solutions/{military,police,smart-city}/`
- `/jp/solutions/{military,police,smart-city}/`
- `/ja/*`（舊 repo 自己轉到 `/jp/*`）

舊 repo 的 `public/_redirects` 是把 `/tw/*` 轉到 `/zh-tw/*`，**方向和新站相反**，不能沿用。
