# BXR Sveltia CMS 使用與設定

目前為**整合測試階段，尚未正式驗收登入與 GitHub 發布**。程式碼僅在 `feature/sveltia-cms`。main 的合併與部署由管理者執行。

## 後台入口

合併本 PR 且 GitHub Pages 部署成功後：

https://magician-eric.github.io/bigxreality-web/admin/

在整合分支本機預覽：Node 22.12 以上，`npm ci`、`npm run dev`，開啟終端顯示的網址加 `/admin/`。這是 Astro 開發預覽，不是需要長期運作的 CMS 伺服器。正式後台是靜態 HTML/JS，使用固定版本 Sveltia 0.253.1（主程式有 SRI 校驗）；網路需能載入 jsDelivr 與 Sveltia 使用的 npm CDN 相依程式。不新增 CMS 後端、付費套件或站內導覽入口。管理 UI 語言由 Sveltia 使用者偏好控制，未使用其不支援的 `locale` 設定。

## 三語與可編輯範圍

- 每個內容類別有清楚標示的「繁體中文（TW）／English（EN）／日本語（JP）」集合。
- 保留 `src/content/<集合>/<tw|en|jp>/<原 slug>.md`。這些 URL 目錄代碼不是 Sveltia 的標準語言代碼（`tw` 會被顯示為 Akan，`jp` 也不是標準日文代碼），因此不用錯誤的原生語言標籤，也不改名整個網站。
- 新聞、技術文章、產品、解決方案、案例、固定頁、標籤、投資人資訊共用同一套 schema 產生器；不是新建一套內容系統。固定頁只能編輯已存在的檔案，不可任意新增、刪除。
- 三語文章靠**相同檔名 slug**配對，不靠翻譯後標題。新文章建檔時，在 CMS 的 slug／路徑輸入英小寫與連字號，三語必須完全相同；ARTICLE_ID 也使用此固定識別碼，發布檢查會拒絕缺漏或重複 ID；不要更名既有檔案。
- 新內容 `draft` 預設 true；TW 的 `draft`、日期、排序、關聯決定前台行為。先保持 TW 草稿，完成 EN/JP 並把它們的 translationStatus 設為 translated，再取消 TW 草稿。`npm run cms:sveltia:check` 會阻擋公開內容缺少翻譯／同名檔案。
- 中文初始 translationStatus=source；EN/JP 新增預設 pending，不會自動翻譯或偽裝翻譯完成。
- 未知發布日期留空；不會預設為今天，也不會把 null 轉成 1970。日期欄位以 UTC 的 YYYY-MM-DD 儲存。
- 所有 landing 深層欄位、FAQ、SEO、關聯清單均保留。少數 `number | "[待提供]"`、`personnel object | "[待提供]"` 欄位使用有型別驗證的 JSON 編輯器；數字填 `20`，待提供填 `"[待提供]"`，人數可填 `{"min":1,"max":3,"approx":false}`。
- 已移除的發展歷程不重新開放。舊的個人 team、milestones 與舊 partners collection 並非目前正式頁面來源，因此不建立誤導的編輯入口；其 schema／資料都保留。經營團隊仍編輯既有固定頁 team，Logo 名單仍沿用既有程式資料，不在此階段重建。
- 首頁主要敘事與核心技術獨立頁文案位於 TS 資料模組，這次不假裝它們是 Markdown；不擅自搬動內容。固定頁集合只編輯既有 templates 實際使用的欄位。

## 管理者登入與權限

### 無額外服務的已設定方式：個人 Fine-grained PAT

1. 每位管理者／編輯者各用自己的 GitHub 帳號，不共用密碼或最高權限 Token。
2. Repository owner 在 Settings → Collaborators／Organization teams 授權。若是 Organization repository，指定至少兩位獨立使用者為 Admin（需要帳戶治理時再由兩位組織 Owner 管理）；一般編輯者使用 Write，審查者由團隊規則分配。
3. **若目前是個人帳號 repository**，GitHub 的最高管理權限只有 owner，無法只靠 Sveltia 增加第二位等權 Admin。要滿足兩位最高管理者，必須由公司建立／移轉至 Organization，或使用公司已有的組織；本次沒有擅自移轉。環境對 GitHub API 回傳 403，尚未核實 owner.type 與成員設定。
4. 各自開 GitHub Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token。選正確 Resource owner、**Only select repositories** → 本倉庫；Contents: Read and write、Pull requests: Read and write；Metadata: Read（GitHub 自動提供）。不要授予 Administration、Workflows、全部倉庫或 Organization owner 權限。設定短期有效日與輪替；若組織要求核准，等待核准後再登入。
若編輯者是他人個人倉庫的 outside collaborator，Fine-grained PAT 的 Resource owner／存取資格可能受 GitHub 限制；不可假設登入一定可用。公司應優先用 Organization 成員與組織核准 Token，或另行完成 OAuth 驗收。不得為了登入改成共用 owner Token。

5. 開 `/admin/` → **Sign In Using Access Token**，只在自己的受信任瀏覽器輸入本人 Token。CMS 可能在瀏覽器持久化登入資訊；使用後登出，共用電腦不可留下登入狀態。Token 不貼到 Issue、PR、config、環境公開變數或本文件。
6. Repository Settings → Rules／Branches：main 要求 PR、必要 CI、至少一位其他人 review、適用管理員、禁止 force push／刪除。為 `feature/sveltia-cms` 設定符合團隊審核流程的保護規則；Sveltia 的 `cms/*` 草稿分支需要可建立及寫入。

Sveltia 沒有可取代 GitHub 的完整伺服器端 RBAC。隱藏選單／delete:false／draft 不是安全權限隔離；Write 帳號仍可能透過 GitHub 直接改其他檔案。fine-grained PAT 的 Contents 權限也不是資料夾白名單。正式權限、審查、audit log 與禁止自我核准應由 GitHub 控制。公開 repository 可使用 GitHub 提供的免費分支保護能力；不要為本整合另購 CMS 角色功能。

### 可選的企業 OAuth

目前 config 只開 token，沒有虛構可用的 OAuth URL，也沒有把 client secret 放入靜態站。未部署／未驗證 OAuth。

未來可部署官方 [sveltia-cms-auth](https://github.com/sveltia/sveltia-cms-auth) 的 serverless OAuth broker，或在既有受管 Azure Functions／AWS Lambda 實作符合 Sveltia 協定的 token exchange。需 GitHub OAuth App、精確 callback URL、state 與 origin allowlist、伺服端 secret storage。驗證成功後才加入 backend.base_url/auth_endpoint 及 auth_methods: [oauth, token]。GitHub 後端不可假設支援純靜態 PKCE 登入；Sveltia 明確不支援 GitHub PKCE。OAuth 登入仍受同一套 GitHub repository 權限與分支規則約束。

## 編輯、審核與部署

1. 在指定語言集合編輯／新增，保留既有 slug。SEO 可在 SEO 物件編輯。
2. config 目標固定 `feature/sveltia-cms`，使用 `publish_mode: editorial_workflow`。CMS 草稿分支／PR 目標是這個整合分支，**不是 main**。本機 Local Repository 模式直接寫本機檔案，不代表 GitHub workflow 已驗證。
3. 在 CMS 完成審核及 Publish，只是將內容合併至整合分支。feature push 執行 CI，不部署 main 網站。
4. 到 GitHub 開 `feature/sveltia-cms` → `main` PR，其他人 review 並確認 CI 通過後合併。既有 Preview (GitHub Pages) main-push workflow 自動建置與部署。本站不設定自動合併，也不讓 CMS 繞過 main 保護。
5. 這是持續使用的內容整合分支，合併後不要刪除。main 有其他程式更新時，管理者應先同步回整合分支，再繼續 CMS 編輯，避免讓舊程式碼長期落後。
6. 預覽網址、canonical、hreflang 沿用現有機制。Pages 仍為 noindex 測試站。新增文章列表會自動分頁；SEO 與新聞回歸改為比較 Git 裡目前文案，避免合法 CMS 編輯被舊的匯入文字快照阻擋；原 TXT 來源完整保留。

若公司希望「CMS Publish 立即正式部署」，應在這一輪驗收後另行評估將 backend.branch 切到 main 的風險與 PR 保護相容性。本次沒有這樣修改。

## 圖片與影片

素材維持原格式，沒有新增壓縮、裁切、WebP 轉檔或現有二進位檔變更。新上傳檔案加入短隨機後綴，降低同名碰撞；不要使用 Replace／Delete 取代既有素材。本分支 CI 會拒絕覆蓋或刪除 origin/main 已有圖片／影片，需更新圖片時以新檔名上傳再改引用。

Assets 素材資料夾：

- 新聞圖：`src/assets/images/news/`。
- 產品／解決方案圖：`src/assets/images/products/`。
- 一般頁／案例／技術文章：`src/assets/images/content/`。
- 新聞本地影片：`public/media/news/`（前台 URL `/media/news/檔名.mp4` 或 `.webm`）；單檔 CMS 上傳限制 20 MB，超過時走 Git 上傳或經確認的外部影片連結，不要把大型影片塞進 CMS 編輯表單。
- 隔離測試：`cms-test-content/`、`cms-test-media/`，不在 Astro content loaders 或 public 內。

內容 Image 欄位回存相對路徑 `../../../assets/images/.../檔名.ext`；Assets 面板的 `/src/assets/...` 只是 CMS 內部映射，不是網站公開 URL。必須透過 Image 欄位選取，不能手貼 Assets 面板 URL 當前台路徑。Astro 本地 image loader 會解析檔案、產生部署資產，Pages rebase 沿用原機制。

產品共用 `hero.image` 或解決方案 `image` 可控制主圖／卡片，TW 決定來源、EN/JP 填 alt；`landing.heroImage` 可指定詳細頁主視覺。明確圖片設定現在會優先於既有 primary-images fallback，沒有設定時網站外觀不變。圖片必須有正確 alt，所有語言應使用同一張圖而非複製檔案。

新聞多圖／影片仍共用 `src/data/news-media.json`，到「新聞共用圖集與影片（進階）」編輯。新聞的 mediaId 應指向對應 key；新建文章可用與 slug 一樣的 mediaId，再新增同名物件。例：

```json
{
  "example-news-slug": {
    "cover": {
      "filename": "2026-confirmed-event-cover-ab12cd.jpg",
      "approved": false
    },
    "gallery": [],
    "videos": [],
    "sourceLinks": []
  }
}
```

以上只是結構範例，不會產生文章或圖片。JSON 欄位是完整對應表，**新增 key 時保留其他原有 key**；格式器會驗證物件型別與媒體欄位，不會加一層 body。

上傳實際照片後，把實際檔名填到 filename，核准可公開並補齊真實的 tw/en/jp alt 後才設 approved=true。圖集以相同 photo 結構加入 gallery，可加 caption 的三語文字。尚無素材維持 approved=false，不會破圖。YouTube/Facebook 寫入實際 https URL；embedApproved 僅在確認可嵌入後啟用，否則沿用連結。local 影片設 approved=true，url 填 `/media/news/...mp4`。系統不下載外部影片，不自動播放有聲影片。

## 維護與回復

- 欄位只維護 Astro `src/content.config.ts` 與 `scripts/sveltia/generate.mjs` 的 UI 規則，執行 `npm run cms:sveltia:generate`。不要手改產生的 config.yml；CI 比對它是否過期。
- `npm run cms:sveltia:check`：schema 與既有資料／三語完整性；`npm run qa:sveltia`：真實 CMS 程式＋瀏覽器隔離副本新增／修改／上傳。
- 本輪沒有刪除任何 EmDash 程式或 DB，也沒有將 Cloudflare 的 content source 切換成 Markdown。請勿同時在兩套 CMS 編輯同一內容並假設會同步。
- 回復整合：revert 本 PR commit。回復內容：revert 該次內容 PR；不要以 force push 改寫 main 歷史。

## BXR Control Center 後續建議

Control Center 可集中顯示登入入口、待審 PR、GitHub CI 與各雲部署狀態，但仍以 GitHub repo／slug／commit SHA 為內容權威來源，不建立第二份文章資料庫。先完成真人授權與發布驗收，再做企業 OAuth／SSO broker、角色政策、audit log 與 Azure/AWS artifact promotion；secret 只在各雲 secret manager，不能由前端 config 提供。純靜態 Astro build profile 與 EmDash 退場另開小範圍 PR 驗證，避免本輪更動既有部署架構。
