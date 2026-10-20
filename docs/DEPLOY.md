# 部署與 Cloudflare 設定說明

架構：GitHub 只放程式；內容在 Cloudflare D1，圖片在 Cloudflare R2。
同一個 Worker（`bigxreality-web`）提供公開網站（build 時產生的靜態頁面）和 EmDash 後台（`/_emdash/admin`）。
編輯在後台按「發布」後，外掛 `bxr-cms` 會在約 2 分鐘後呼叫 Workers Builds 重新 build 網站。連續編輯只會觸發一次重建，最多延後 10 分鐘。

> ⚠️ 正式部署、DNS 修改、付費方案啟用，都要先經過你同意。以下步驟由你在 Cloudflare 後台操作，**不需要提供帳號密碼給任何人**。

## 1. 需要你準備的東西

| 項目 | 費用 | 說明 |
|---|---|---|
| Cloudflare 帳號（免費方案即可） | $0 | Workers、D1、Workers Builds、Access（≤50 人）都在免費額度內 |
| 啟用 R2 | 10 GB 內 $0，**但必須綁定付款方式** | Cloudflare 規定啟用 R2 前要有信用卡；超過免費額度才會收費 |
| GitHub 授權 Cloudflare 讀取 `magician-eric/bigxreality-web` | $0 | Workers Builds 用 |

## 2. 第一次建立（約 30 分鐘，依序操作）

### 2.1 啟用 R2（需綁定付款方式）
Cloudflare 後台 → **R2 Object Storage** → **Purchase R2 / Enable** → 依畫面綁定付款方式 → 建立 bucket，名稱填 `bxr-media`。

### 2.2 建立 D1 資料庫
**Storage & Databases → D1 → Create database**，名稱填 `bxr-cms`。建立後複製畫面上的 **Database ID**，告訴我（這不是密碼），我會填進 `wrangler.jsonc` 的 `database_id`。

### 2.3 建立 Worker 並連接 GitHub（Workers Builds）
**Workers & Pages → Create → Import a repository** → 選 `magician-eric/bigxreality-web`，分支 `main`。
- Build command：`npm run build`
- Deploy command：`npx wrangler deploy`
- Worker 名稱：`bigxreality-web`（必須和 `wrangler.jsonc` 的 `name` 相同，否則 Workers Builds 會拒絕部署）

**Settings → Build → Variables and secrets**（build 時用的環境變數）：

| 名稱 | 值 | 類型 |
|---|---|---|
| `BXR_CONTENT_SOURCE` | 第一次部署用 `bootstrap`，匯入內容後改成 `emdash`（見 2.4） | 文字 |
| `EMDASH_URL` | 後台網址，例如 `https://www.bigxreality.com`（綁網域前先用 `https://bigxreality-web.<你的子網域>.workers.dev`；bootstrap 也需要這個值） | 文字 |
| `EMDASH_TOKEN` | 見 2.5（`emdash` 才需要） | **Secret** |
| `CF_ACCESS_CLIENT_ID`、`CF_ACCESS_CLIENT_SECRET` | 見 2.6（有開 Access 才需要） | **Secret** |

**Settings → Variables and secrets**（Worker 執行時用）：

| 名稱 | 值 |
|---|---|
| `EMDASH_ENCRYPTION_KEY` | 在自己電腦執行 `npx emdash secrets generate`，把產生的值設成 **Secret**（外掛設定等加密用，要妥善保存，遺失後已加密的設定需重填） |

### 2.4 第一次部署與匯入內容
第一次 build 時 CMS 還是空的，所以先用 **bootstrap 模式**部署一次，讓 Worker 和 EmDash 後台上線：

1. Build 變數設 `BXR_CONTENT_SOURCE=bootstrap`、`EMDASH_URL=https://bigxreality-web.<你的子網域>.workers.dev`，部署。**這需要你同意，因為這是正式部署。**
   - 網站內容來自 `src/content` 的 Markdown（不會用到測試資料）。
   - 所有頁面 `noindex`，`robots.txt` 禁止所有爬蟲，sitemap 是空的。這是暫時的網站，不適合綁正式網域。
   - build 前會先查詢 `<EMDASH_URL>/_emdash/api/setup/status`。**後台一旦建立了管理員帳號，bootstrap 就會被拒絕**，build 失敗並提示改用 `emdash`。所以 bootstrap 只能用在初始化，之後不可能誤用。
   - 正式 build 仍然拒絕 `markdown` 與 `fixtures`。
2. 打開 `<網址>/_emdash/admin`，建立第一個管理員帳號（用 passkey 或 email 登入）。
3. 後台 API Tokens 頁面（管理員） 建一個「匯入用」token，權限勾選 `content:read`、`content:write`、`media:read`、`media:write`。在自己電腦執行：
   ```bash
   EMDASH_URL=<網址> EMDASH_TOKEN=<匯入用 token> npm run cms:import
   ```
   這會把 `src/content` 的 Markdown（產品、解決方案、情境、頁面文案、網站資訊）和圖片匯入 CMS 並發布。可以重複執行，已存在的內容不會被覆蓋。
4. 匯入完成、檢查無誤後，刪掉匯入用 token。建立 build 用的唯讀 token（2.5），把 Build 變數改成 `BXR_CONTENT_SOURCE=emdash` 並加上 `EMDASH_TOKEN`，然後重新部署（Deployments → Retry，或推一個 commit）。
   - 從此網站內容只來自 EmDash。如果 CMS 裡沒有任何已發布的產品，build 會失敗，不會部署空白網站。
5. 原本的 Markdown 留在 git 中當備份，不刪除。

### 2.5 build 用的唯讀 token
後台 API Tokens 頁面（管理員） → 新增，名稱 `workers-build`，只勾 `content:read`、`media:read` → 複製 token，貼到 2.3 的 `EMDASH_TOKEN`（Secret）。

### 2.6 保護後台（Cloudflare Access，免費 ≤50 人，建議）
**Zero Trust → Access → Applications → Add → Self-hosted**：
- Domain：`www.bigxreality.com`，Path：`_emdash`
- Policy：Allow → Emails → 填 5 位編輯的 email

Workers Builds 抓內容時也要通過 Access：**Access → Service Auth → Create Service Token**，把 Client ID／Secret 填進 2.3 的 `CF_ACCESS_CLIENT_ID`、`CF_ACCESS_CLIENT_SECRET`，並在上面的 Application 加一條 **Service Auth** policy 允許這個 token。

### 2.7 發布後自動重建（Deploy Hook）
Worker → **Settings → Build → Deploy Hooks → Create**（分支 `main`）→ 複製網址。
後台 **Plugins → Big x Reality (bxr-cms) → Settings** → 貼到「Workers Builds Deploy Hook URL」。這個網址會加密儲存，不會出現在 GitHub。

### 2.8 網域（DNS）
**需要你同意後才做。** Worker → **Settings → Domains & Routes → Add → Custom domain** → `www.bigxreality.com`。

## 3. 費用與額度（免費方案）

| 服務 | 免費額度 | 本站預估 |
|---|---|---|
| Workers 請求 | 每天 100,000 次 | 公開頁面是靜態檔，**不計入**；只有後台與 API 會計入 |
| Workers Builds | 每月 3,000 分鐘 | 一次 build 約 3–5 分鐘 |
| D1 | 每個資料庫 500 MB、每天 500 萬次讀取、10 萬次寫入 | 遠低於額度 |
| R2 | 10 GB、每月 100 萬次寫入、1,000 萬次讀取 | 圖片在 build 時下載並最佳化，公開網站不直接讀 R2 |
| Access | 50 人 | 5 位編輯 |

不要啟用 Workers 的 Cache 功能（會讓靜態頁面也計費）。

## 4. 備份
- D1 自帶 Time Travel（免費方案可還原 7 天內任一時間點）：`npx wrangler d1 time-travel restore bxr-cms --timestamp=<時間>`。
- EmDash 內建整站匯出（transfer export，見 PHASE-2-PLAN §14），可下載全部內容。建議每月一次。
- `src/content` 的 Markdown 是遷移前的備份；`npm run build`（不設 `BXR_CONTENT_SOURCE`）就能用它產生網站。

## 5. 本機開發
```bash
npm ci
npx emdash secrets generate --write .env
npm run dev                         # http://127.0.0.1:4321，D1/R2 用本機模擬（.wrangler/state）
# 第一次：瀏覽 /_emdash/api/setup/dev-bypass 建立本機管理員
npm run cms:import                  # 匯入 Markdown 到本機 CMS
npm run build                       # Markdown 版
npm run build:fixtures              # TEST FIXTURE 版 → dist-fixtures/（永遠不部署）
```
注意事項：
- 正式 build（`WORKERS_CI=1`）只接受 `BXR_CONTENT_SOURCE=emdash`，以及 CMS 尚未初始化時的 `bootstrap`。
- build 後的搜尋索引步驟發現 `TEST FIXTURE` 文字時，會讓 build 失敗。
- 已知情況：EmDash 後台的 Google 字型在無法連外的環境會顯示 `emdash-noto` 警告，不影響網站。
