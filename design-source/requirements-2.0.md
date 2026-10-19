# Big x Reality 官方網站 2.0
## 完整需求、資訊架構、視覺設計與技術實作交接文件

### 一、專案背景與目標

你現在要協助重新規劃及設計 **全球動力科技 Big x Reality** 的官方網站。

這不是單純替換舊網站版型，而是要建立一套符合國際市場、企業品牌形象、B2B 業務開發、產品行銷、內容管理，以及未來公司治理與投資人關係需求的企業官網。

**公司資訊**

- 品牌：Big x Reality
- 中文公司名稱：全球動力科技
- 品牌標語：Turn every drill into real.
- 現有官網：https://www.bigxreality.com/
- 舊網站套裝方案：https://www.bigxreality.com/tw/packages
- GitHub Repository：https://github.com/bigxreality/bigxreality-website

公司的核心業務包括 XR 沉浸式模擬訓練、軍警戰術訓練、防災應變、無人載具訓練及相關軟硬體整合。

網站必須傳達三個核心概念：

1. **Reality**：真實任務、真實操作、真實環境。
2. **Virtual**：沉浸式模擬、虛擬訓練、可重複的任務環境。
3. **Intelligence**：AI 行為模擬、訓練數據、系統整合與決策輔助。

網站不應被設計成一般 VR 遊戲公司，也不應過度偏向軍事裝備銷售網站。

我們提供的是可應用於不同產業的專業模擬訓練技術與系統。

主要目標：

- 建立國際化、專業、可信賴的企業形象。
- 清楚區分 Solutions、Products、Technologies。
- 讓海外客戶快速理解產品與應用。
- 透過產品型錄申請與 Demo 預約取得有效商機。
- 支援英文、正體中文、日文。
- 透過 News、Insights、Case Studies 累積 SEO／GEO 內容。
- 讓行銷人員能透過 CMS 維護網站。
- 為未來投資人關係、公司治理與公開資訊預留架構。
- 維持網站效能、安全性、可擴充性與合理的維護成本。

---

### 二、既有網站與開發架構

目前規劃採用的技術：

- Astro 7
- Decap CMS
- GitHub Repository
- 靜態網站部署
- GitHub Pages／Netlify 等部署方式，依實際環境確認
- Google Apps Script 等現有表單整合方式

請先檢查 Repository 的實際狀況，不要假設上述功能都已完整實作。

**重要開發原則**

採取：

Design Tokens → Reusable Components → Fixed Page Templates → Structured CMS Content

不要將 CMS 做成可以任意拖拉、自由拼接所有 Section 的大型 Page Builder。

網站需要有一致的視覺系統與頁面結構，但不同產品可以依實際資料決定哪些區塊顯示。

不要過度工程化。

能用 Astro 原生功能完成的工作，不要額外導入龐大的前端框架。

不要在網站初始載入階段加入不必要的 3D 引擎、動畫函式庫或大量 JavaScript。

---

### 三、品牌 CIS 與視覺規範

請以我提供的 **BXR_CIS_Brand_Guidelines_v3.2** 作為主要視覺規範。

正式配色、Logo 安全距離、字體、輔助色與使用限制，都必須以 CIS 原始文件為準。

先前討論的企業紅色為：

`#D02753`

但正式實作前必須與 CIS v3.2 核對，不得自行認定為唯一標準色。

**Logo 要求**

我已經提供正式 Big x Reality Logo 圖檔。

必須直接使用正式 Logo 原始素材。

禁止：

- 自己重新畫 Logo。
- 用文字重新拼出 Big x Reality。
- 改造 R 圖案。
- 擅自改變字距或比例。
- 自行發明另一套品牌標誌。
- 在 Logo 上增加不存在的線條或裝飾。

應建立正式的 Logo Asset 使用規則，包含深色背景、淺色背景及 Favicon 版本。

如果目前提供的 Logo 不適合某種背景，應使用 CIS 授權的對應版本，而不是自行改色。

**視覺方向**

整體應為：

- 現代國際科技企業。
- 專業、理性、具有技術可信度。
- 大型、高品質、真實的情境照片。
- 深色與淺色區塊交錯。
- 清晰的字體層級。
- 有節制的企業紅色強調。
- 細緻的線條、技術網格與資訊視覺化。
- 適當的留白與閱讀節奏。

可以參考國際國防科技、專業模擬訓練、科技系統整合企業的設計水準。

但不要照抄其他品牌。

**避免的設計**

- 全網站每一區都是黑色。
- 過度 Cyberpunk。
- 大量霓虹紅、霓虹藍。
- 不必要的發光邊框。
- 所有區塊都使用軍人持槍照片。
- 過度密集的卡片。
- 只有漂亮圖片卻沒有清楚的資訊層級。
- 為了視覺效果犧牲載入速度與易讀性。

**字體方向**

先前討論：

- PT Mono：英文技術標籤、數字或局部 Display。
- Noto Sans TC：正體中文。
- Noto Sans：英文。
- Noto Sans JP：日文。

實際字型與字重仍以正式 CIS 規範為準。

---

### 四、網站語言與 URL 架構

已確認採用三種語言：

- English：`/en/`
- 正體中文：`/tw/`
- 日本語：`/jp/`

三種語言採平行目錄架構。

例如：

`/en/products/sut/`

`/tw/products/sut/`

`/jp/products/sut/`

**重要決策**

英文是全球市場主要內容語言，但英文仍放在 `/en/`，不是網站根目錄。

網站根目錄：

`https://www.bigxreality.com/`

預設導向：

`https://www.bigxreality.com/en/`

不要建立獨立的語言選擇首頁。

不要強制根據 IP 將訪客切換語言。

訪客主動選擇的語言應受到尊重。

語言切換時應盡可能保留相同頁面。

例如從英文 SUT 頁切換正體中文，應前往正體中文 SUT 頁，而不是回到首頁。

**技術要求**

- 正確使用 HTML `lang`。
- 英文 `en`。
- 正體中文 `zh-Hant-TW`。
- 日文 `ja-JP`。
- 每個語言頁面具有正確 canonical。
- 等價頁面之間建立 hreflang。
- 建立完整 sitemap。
- 舊網址建立正式 301 Redirect 對照表。
- `/tw/home` 應導向 `/tw/`。
- 不使用 `/ja/` 作為日文網址。
- 不得假設所有語言內容都已翻譯完成。

CMS 應能標示翻譯狀態，避免尚未完成的翻譯內容被當成正式內容發布。

---

### 五、全站主導覽架構

已確認主要導覽：

**Solutions | Products | Technologies | Resources | Company**

右側：

**Contact | EN / TW / JP**

不要把 News、Insights、Case Studies 全部放在第一層導覽。

也不要在 Header 第一層加入 Investor Relations。

建議 Sitemap：

```text
Home
│
├── Solutions
│   ├── Military
│   ├── Police
│   ├── Fire & Disaster Response
│   ├── Smart City
│   └── Anti-Fraud（待確認）
│
├── Products
│   ├── Products Overview
│   └── Individual Product Pages
│
├── Technologies
│   ├── VR
│   ├── AR
│   └── XR
│
├── Resources
│   ├── News
│   ├── Insights
│   └── Case Studies
│
├── Company
│   ├── About Us
│   ├── Partners & Clients
│   ├── Investor Relations
│   ├── Careers（外部 104）
│   └── Contact Us
│
└── Contact
```

Contact 可以同時在 Company 下拉選單及 Header 右側 CTA 出現，但只需要一個實際頁面。

**Applications 不需要建立。**

先前討論後認為目前沒有必要額外設立 Applications，避免與 Solutions、Products、Technologies 產生混淆。

未來有足夠內容再重新評估。

---

### 六、Solutions 的定義

Solutions 代表公司服務的市場、任務領域與客戶需求。

不是產品分類。

目前主要 Solutions：

**Military**

軍事訓練、戰術訓練、兵棋推演、無人載具及其他國防訓練應用。

**Police**

警勤訓練、戰術應變、執法訓練與相關情境。

**Fire & Disaster Response**

消防、防救災、應變訓練、火場調查與相關沉浸式教育。

**Smart City**

智慧城市、公共安全及相關模擬應用。

**Anti-Fraud**

反詐騙教育與互動訓練，目前先保留為可能的 Solutions 項目，是否正式獨立成為業務領域需再確認。

每個 Solution 頁面應包含：

1. Hero 與產業定位。
2. 該領域面臨的挑戰。
3. Big x Reality 提供的能力。
4. Related Products。
5. Related Technologies。
6. Related Case Studies。
7. Related Insights。
8. Related News。
9. Contact CTA。

Related Content 應由 CMS 關聯自動產生，不要手動重複建立相同內容。

---

### 七、Products 的核心定義

Products 代表公司實際提供的系統、平台或可獨立展示、銷售及部署的產品。

不要將所有功能、課程、訓練情境或專案都當成產品。

產品資料應區分：

**Product / System**

公司正式提供的產品或系統。

**Module / Capability**

產品內部的功能、訓練模組或技術能力。

**Training Scenario**

實際的訓練課程或情境。

**Integrated Training Scenario**

由多個產品互相串接形成的聯合訓練情境。

**Case Study**

已執行的專案與導入成果。

這些概念不能混為一談。

---

### 八、目前已知產品清單

根據舊網站套裝方案與後續討論，已知項目如下：

| 產品／系統 | 新版規劃 |
|---|---|
| SUT 小型部隊專項訓練系統 | 獨立 Product |
| UAV 無人機戰術訓練系統 | 獨立 Product |
| USV 無人船 VR 訓練系統 | 獨立 Product |
| 全配式警勤訓練系統 | 獨立 Product |
| 攜帶式警勤訓練器 | 獨立 Product |
| 兵棋圖台系統 | 獨立 Product |
| 迫擊砲模擬系統 | 獨立 Product |
| 狙擊槍模擬系統 | 獨立 Product |
| 機槍模擬系統 | 獨立 Product |
| 悍馬車載具訓練系統 | 獨立 Product |
| 快艇載具訓練系統 | 獨立 Product |

以上是目前盤點基礎，不代表已完成全部正式商品確認。

正式英文名稱、Slug、是否持續銷售、產品照片、規格與型錄，需要逐項核對。

舊站有些內容可能存在文字辨識或資料錯誤，例如迫擊砲相關項目的名稱與內文不一致。

不要直接將錯誤文字搬進新網站。

**Product Category 暫時不要定案。**

先前曾提出 Tactical、Police、Command、Weapon、Vehicle 等分類，但目前產品之間具有跨系統整合關係，不宜太早將整個產品架構固定。

等完整產品盤點完成後再決定分類與篩選方式。

---

### 九、SUT、UAV、USV 的產品關係——重要決策

這是目前最需要正確理解的產品架構。

**SUT、UAV、USV 必須是三個平行的獨立產品。**

不要將 UAV、USV 全部放到 SUT 下面。

SUT 不是公司所有軍事訓練系統的母產品。

三個系統可以各自展示，也可以在特定情境下整合。

#### 9.1 SUT 小型部隊專項訓練系統

SUT = Small Unit Tactical。

主要針對約 1 至 4 人的小部隊戰術訓練。

目前包含：

- 基礎射擊訓練。
- CQB 近接戰鬥。
- 小部隊戰術情境。
- 隊形、掩護與移動。
- 小隊溝通與協同。
- 情境判斷。
- 可與無人載具整合的協同訓練。

SUT 應被定位為可擴充的小部隊戰術訓練系統，而不只是 VR 射擊遊戲或射擊模擬器。

SUT Product Page 應重點呈現：

- Small Unit Tactical Training。
- Basic Marksmanship。
- CQB。
- Small Unit Tactics。
- Team Coordination。
- 可整合 Counter-UAS 與 MUM-T 情境。

注意，Counter-UAS 與 MUM-T 可以在 SUT 頁面介紹，但不要寫成只有 SUT 才能提供的獨立產品。

#### 9.2 UAV 無人機戰術訓練系統

UAV 是獨立產品。

目前已知有獨立的無人機訓練課程，學員可以透過搖桿控制虛擬無人機飛行。

可涵蓋：

- UAV 飛行操控。
- 搖桿操作。
- 無人機任務情境。
- 與地面部隊的協同訓練。

另外存在一種 Counter-UAS 訓練情境：

無人機在空中飛行。

SUT 地面士兵持槍對空中無人機目標進行模擬接戰。

這是 UAV 與 SUT 的跨產品整合訓練，不應被誤認為 UAV 只是 SUT 裡面的一個模組。

#### 9.3 USV 無人船 VR 訓練系統

USV 目前是一個可以獨立運行的 VR App。

同時可以將無人船的畫面串流進 SUT 的 MUM-T 訓練情境。

因此新版網站要將 USV 視為獨立產品項目。

它與 SUT、UAV 的關係是「可整合」，不是「隸屬」。

USV 產品頁可以介紹：

- 獨立 VR 訓練應用。
- 無人船操作與任務模擬。
- 與其他訓練系統的串接能力。
- MUM-T 情境中的應用。

尚未確認的功能不要自行增加。

#### 9.4 MUM-T 人機協同訓練

MUM-T = Manned-Unmanned Teaming。

它不是第四個獨立 Product。

它是 SUT、UAV、USV 可以共同參與的 **Integrated Training Scenario**。

目前實際運作概念：

- SUT 人員可以執行地面戰術任務。
- SUT 人員可以持槍，也可以操作無人機。
- UAV 提供空中視角。
- USV 提供海上無人載具視角。
- SUT 人員胸前配有胸掛顯示板。
- 胸掛顯示板可觀看 UAV、USV 的整合影像。
- USV 本身是獨立 VR App，但可以將畫面串流至 SUT 的 MUM-T 情境。

架構概念：

```text
               MUM-T
      Integrated Training

        UAV        USV
         │          │
         └────┬─────┘
              │
       Video / Information
              │
              ▼
       SUT Ground Squad
              │
              ▼
      Chest-mounted Display
```

這張圖只是資訊架構示意，不代表所有裝置的實際網路拓樸。

不要自行推論通訊協定、資料流方向或控制權限。

**網站呈現方式**

SUT、UAV、USV 各自有 Product Page。

三個頁面都可以有「Integrated Operations」區塊，介紹相互整合能力。

MUM-T 可以透過 Insight、Case Study 或整合訓練專題內容詳細說明。

不需要為了 MUM-T 重新建立第四個產品。

同樣地，Counter-UAS 也可以作為跨產品訓練情境。

---

### 十、Products Overview 頁面

建議網址：

`/[locale]/products/`

這應該是一個真正的產品中心，而不是舊站那種全部內容往下排列的套裝方案頁面。

主要結構：

**Hero**

- Products 標題。
- 一句產品定位。
- 品牌視覺照片。

**Product Discovery**

- 全部產品。
- 分類或篩選功能。
- 搜尋功能。
- 產品卡片。

**Product Cards**

每張卡片包含：

- 正式產品照片。
- Product Name。
- Short Description。
- Related Solutions。
- Explore Product。

**Integrated Training**

介紹多產品整合能力。

例如：

SUT × UAV × USV。

但不能把整合訓練寫成一個新的獨立產品。

**CTA**

引導客戶了解產品或聯繫業務。

產品卡片的內容由 CMS Product Collection 自動產生。

不要在前端硬寫產品名稱與資料。

---

### 十一、單一 Product Landing Page 模板

每個產品必須有自己的頁面。

例如：

`/en/products/sut/`

`/tw/products/sut/`

`/jp/products/sut/`

所有產品使用一致的模板。

建議區塊：

1. **Hero**
   - 產品名稱。
   - 英文名稱。
   - 一句產品定位。
   - 主要圖片或影片。
   - Request Brochure。
   - Book a Live Demo。

2. **Overview**
   - 產品介紹。
   - 解決的訓練問題。
   - 核心價值。

3. **Key Capabilities**
   - 核心能力。
   - 3～6 項為宜，依實際內容調整。

4. **How It Works**
   - 操作流程。
   - 系統運作概念。
   - 必要時使用架構圖。

5. **Training Scenarios**
   - 產品支援的訓練情境。
   - 例如 SUT 的射擊、CQB、小部隊作戰。

6. **System Components**
   - 硬體、軟體與系統組成。
   - 必須依真實配置填寫。
   - 不要憑示意圖虛構設備。

7. **Deployment / Configuration**
   - 可公開的部署方式。
   - 場地需求。
   - 人數與配置。
   - 其他實際支援條件。

8. **Integrated Operations**
   - 可與哪些產品整合。
   - 例如 SUT、UAV、USV 的整合關係。

9. **Related Solutions**
   - Military、Police 等。

10. **Related Case Studies**
    - 相關導入案例。

11. **Related Insights / News**
    - 相關技術文章與新聞。

12. **Final CTA**
    - Request Brochure。
    - Book a Live Demo。

以上是可選擇顯示的固定模板區塊。

沒有資料的 Section 不顯示。

不要為了讓每個產品頁一樣長而填充沒有價值的文字。

---

### 十二、SUT 專屬頁面重點

SUT 是重要產品頁，視覺與內容需要有代表性。

Hero 可以採用真實小部隊戰術訓練畫面。

主要定位：

**SUT — Small Unit Tactical Training System**

內容重點：

- 小部隊戰術訓練。
- 基礎射擊。
- CQB。
- 小隊協作。
- 情境變化。
- 訓練評估。
- 跨系統整合能力。

頁面視覺應有明確的閱讀順序：

Hero → Overview → Capabilities → Training Scenarios → System Components → Integrated Operations → Related Content → CTA。

不要只呈現軍人持槍的形象照。

應搭配實際系統介面、設備、操作流程與可驗證的產品照片。

對於 AI、追蹤系統、即時資訊顯示等能力，只能呈現經產品團隊確認的真實功能。

**SUT 頁面的核心訊息**

這是一套可從基礎操作延伸到小隊協同與跨系統聯合訓練的戰術訓練系統。

---

### 十三、首頁 Home

首頁是企業品牌入口，不是產品型錄頁。

先前已經製作過首頁視覺示意圖，風格為：

- 深色科技感。
- 大型情境 Hero。
- 白色文字。
- 企業紅色強調。
- 高品質軍警／防災相關影像。
- 具有清楚的內容分區。

但目前的示意圖只作為視覺方向，不代表所有文案、數據與影像都可以直接使用。

**重要：首頁不需要 Featured Products 產品卡片區塊。**

先前已經決定首頁以品牌、Solutions、Technologies、Cases、News 為主。

最新示意圖曾出現 Featured Products，但正式架構應以這項資訊架構決策為準。

建議首頁：

#### 13.1 Hero

大型全寬 Hero Video。

既有素材可能包含：

- `hero1.mp4`
- `hero2.mp4`

請確認 Repository 內實際素材。

兩支影片應依序播放。

第一支結束後播放第二支，第二支結束後回到第一支。

不要讓每支影片自己無限循環，導致無法切換。

可加入適當 Crossfade。

支援 Reduced Motion，必要時改用靜態圖片。

Hero 文案應強調公司品牌定位，而非單一產品。

品牌標語：

**Turn every drill into real.**

#### 13.2 Brand Positioning

說明 Big x Reality 的核心技術與訓練理念。

#### 13.3 Technologies / XR Capabilities

簡潔介紹 VR、AR、XR 如何讓訓練更安全、可重複、可量測。

#### 13.4 Solutions

四個主要 Solutions：

- Military
- Police
- Fire & Disaster Response
- Smart City

Anti-Fraud 待確認。

可使用四張大型視覺卡片。

#### 13.5 Case Studies

自動取得 CMS 中符合首頁展示條件的案例。

不要另外維護一份首頁案例資料。

#### 13.6 Latest News

自動取得 CMS 最新新聞。

#### 13.7 CTA

引導聯絡公司或探索解決方案。

#### 13.8 Footer

完整網站導覽、公司資訊、聯絡方式、社群連結、法律資訊與 Investor Relations 入口。

**首頁內容排列**

應避免整頁從上到下都是深黑色。

可以在 Hero 使用深色影像，之後穿插白色、淺灰或藍灰背景，增加層次。

---

### 十四、Technologies

Technologies 目前先聚焦：

- Virtual Reality（VR）
- Augmented Reality（AR）
- Extended Reality（XR）

不要為了讓網站看起來很豐富，就自行增加大量 AI、Digital Twin、Computer Vision 等獨立 Technology 頁面。

AI 等能力可以出現在相關內容，但是否建立為正式 Technology 分類需要另行確認。

每個 Technology Page 應回答：

1. 這項技術是什麼？
2. Big x Reality 如何使用？
3. 可以實現哪些訓練能力？
4. 有哪些相關產品？
5. 有哪些實際案例？

技術介紹不能只有百科全書定義。

要連結到公司的真實應用。

---

### 十五、Resources

主導覽統一為：

**Resources**

底下三類：

**News**

公司的最新消息，例如：

- 展覽。
- 產品發布。
- 合作。
- 獎項。
- 媒體報導。
- 公司公告。

**Insights**

知識、技術與產業觀點。

例如：

- XR 訓練的優勢。
- VR、AR、MR 的應用差異。
- 小部隊戰術訓練。
- MUM-T。
- 無人載具訓練。
- 防災與反詐教育。

**Case Studies**

實際導入案例。

內容可包含：

- 專案背景。
- 客戶需求。
- 挑戰。
- 導入方案。
- 使用產品。
- 使用技術。
- 導入成果。

不得自行虛構客戶、數據、導入績效或未經公開授權的案例。

**CMS 原則**

News、Insights、Case Studies 是三種獨立 Collection。

同一個實際專案可以分別有新聞、案例與技術文章，但各自內容目的不同，應交叉連結而非直接複製。

Resources Hub 可整合最新與精選內容。

---

### 十六、Company

目前已確認的 Company 架構：

**About Us**

公司簡介、願景、使命、核心能力、國際市場等。

不需要獨立 Milestones 頁面。

如果未來有足夠內容，可以把公司沿革放在 About Us。

**Partners & Clients**

展示合作夥伴與客戶。

需區分：

- Partners。
- Clients。

不可因為曾經接觸或合作就擅自公開對方 Logo。

CMS 必須有公開授權或核准狀態。

**Investor Relations**

保留投資人關係與公司治理內容。

**Careers**

直接連到公司的 104 人力銀行招募頁。

不自行開發徵才系統。

正式網址需確認。

**Contact Us**

一般商務合作、媒體、供應商、聯絡需求。

不要跟產品型錄申請及 Demo 預約混成同一套流程。

---

### 十七、Investor Relations 與 Corporate Governance

公司未來可能需要更多投資人關係及公司治理資訊，因此現在應先預留合理架構。

但目前內容不多。

**不要為了完整性建立大量空白頁面。**

Investor Relations 暫時放在 Company 之下。

例如：

`/[locale]/company/investors/`

第一階段可是一個整合頁面，包含：

- Investor Relations Overview。
- Corporate Governance。
- Financial Information（有公開資料才顯示）。
- Investor Contact。

未來可擴充：

- Financial Reports。
- Corporate Governance。
- Shareholder Information。
- Public Disclosures。
- Investor Contact。
- 相關公開文件。

應參考台灣上市櫃公司官方網站的資訊架構，但不要照搬大型上市公司所有功能。

所有公開揭露義務應依公司實際法規身分及主管機關規範確認。

**重要**

依法應公開的投資人資訊，不能與受控產品型錄混用同一套申請權限。

公開資訊與受控文件必須分開管理。

---

### 十八、Contact、Request Brochure、Book Live Demo

目前已確認有三種不同的需求入口。

**General Contact**

一般聯絡。

**Request Brochure**

產品型錄／技術文件申請。

**Book a Live Demo**

產品展示預約。

其中 Request Brochure 與 Book a Live Demo 必須是兩套獨立表單與審核流程。

不要做成一張表單讓使用者選擇 Request Type。

#### 18.1 共用欄位

以下欄位為必填：

- Name
- Company / Organization
- Job Title
- Email
- Country
- Phone

另有：

- Other Requirements（其他需求）：非必填。

#### 18.2 Request Brochure

包含：

- Primary Product。
- Additional Products（選填）。
- Request Purpose。
- 共用聯絡欄位。
- Other Requirements。

產品頁點擊 Request Brochure 時，系統應自動帶入該產品作為 Primary Product。

該欄位必須鎖定，不可更改。

可以額外選擇其他感興趣的產品。

#### 18.3 Book Live Demo

包含：

- Primary Product。
- Additional Products（選填）。
- Demo Purpose。
- Preferred Demo Mode。
- 共用聯絡欄位。
- Other Requirements。

Demo Mode 可依實際業務流程提供線上、現場、展覽或其他選項。

Demo 預約不代表系統自動確認時間。

應進入業務審核與安排流程。

#### 18.4 一般入口與產品入口差異

如果從 SUT 頁面進入：

Primary Product = SUT。

如果從 UAV 頁面進入：

Primary Product = UAV。

如果從一般產品總覽或其他非產品頁面進入，使用者需要先選擇 Primary Product，選定後鎖定。

沒有 Primary Product 不得提交產品型錄或 Demo 申請。

#### 18.5 Attribution

表單資料需記錄：

- `primary_product_id`
- `additional_product_ids`
- `source_page`
- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_content`
- `utm_term`
- `submitted_at`
- `request_type`

不同申請不可因 Email 相同就覆蓋前一筆紀錄。

後端必須驗證產品 ID 與來源資訊，不能直接信任前端隱藏欄位。

---

### 十九、Country、Phone、Email 驗證

#### 19.1 Country

必須提供完整、正常使用的國家／地區選單。

不是只有台灣、美國、日本等少數幾個國家。

預設：

- `/tw/` → Taiwan。
- `/en/` → United States。
- `/jp/` → Japan。

#### 19.2 Phone

國碼預設跟隨 Country。

但使用者可以獨立修改電話國碼。

例如使用者公司位於日本，但使用台灣電話，也應允許。

不使用 SMS OTP。

應使用成熟電話驗證函式庫，例如 `libphonenumber-js`。

前端提供格式提示，後端再次驗證。

資料庫儲存 E.164 格式。

格式有效不代表電話實際存在或屬於申請者。

#### 19.3 Email

**不要使用 Email OTP。**

這是已經修改並確認的最終決策。

Email 驗證分兩層：

第一層：Email 格式與網域收信能力。

- 驗證基本 Email 格式。
- 檢查網域是否存在。
- 檢查合理的郵件接收設定，例如 MX。
- 正確處理合法的郵件接收備援情況。
- 明顯不存在或無法接收郵件的網域可拒絕。
- DNS 暫時失敗或不確定時應標記人工審核。

不能宣稱 MX 驗證可以證明特定信箱存在。

第二層：垃圾申請風險控制。

- Cloudflare Turnstile 或等效機制。
- 伺服器端 Rate Limiting。
- Honeypot。
- 一次性 Email 網域檢查。
- 可疑申請模式風險標記。

數字型 Email 使用者名稱或不尋常格式可以增加風險評估，但不可只憑這個條件直接拒絕。

明確機器人驗證失敗或超過速率限制可拒絕。

高風險但不確定的申請應進入人工審核。

---

### 二十、受控文件與人工審核

Request Brochure 提交後，**不得自動寄出產品型錄或技術文件**。

流程應為：

```text
Visitor
   ↓
Request Brochure
   ↓
Email / Phone Validation
   ↓
Spam & Risk Checks
   ↓
Request Record
   ↓
Manual Review
   ↓
Approved / Rejected
   ↓
Authorized Document Delivery
```

產品型錄、詳細技術規格與其他受控文件，不應直接放在公開可猜測的靜態網址。

需要：

- 受保護的文件儲存。
- 權限驗證。
- 審核狀態。
- 文件版本。
- 發送紀錄。
- 適當的存取期限。
- 必要的稽核紀錄。

CMS 可以管理文件的描述與對應關係，但不能把受控 PDF 直接公開。

若現有 Astro 靜態部署與 Google Apps Script 無法安全完成相關驗證、速率限制、文件權限與審核流程，請提出最小必要的 Serverless Backend 架構。

不要假裝純前端驗證已經達成後端安全要求。

---

### 二十一、CMS 資料架構

建議主要 Collections：

- Solutions。
- Products。
- Technologies。
- Case Studies。
- News。
- Insights。
- Documents。
- Investor Relations / Governance Content。

Products 至少應包含：

```text
product_id
slug
status
featured

localized_name
localized_short_description
localized_overview

hero_media
gallery

key_capabilities
training_scenarios
system_components
public_specifications
deployment_information

related_solutions
related_technologies
related_products
related_case_studies
related_insights
related_news

brochure_document_id
technical_document_id

seo_title
seo_description
publish_date
updated_at
```

產品之間的整合關係，建議使用結構化關聯，而不是純文字描述。

例如：

```text
SUT
  related_products:
    - UAV
      relationship: integrated
    - USV
      relationship: integrated
```

但資料模型應避免雙向重複維護導致關係不一致。

建議建立單一關聯資料來源，前端依需要取得正向與反向關聯。

訓練情境可以先作為產品內的結構化資料。

如果未來有大量跨產品情境，再評估是否獨立建立 Training Scenarios Collection。

**目前不要因為有 MUM-T 就急著建立一套龐大的情境管理系統。**

---

### 二十二、SEO、GEO 與內容架構

網站需要支援：

- SEO Title。
- Meta Description。
- Canonical。
- hreflang。
- XML Sitemap。
- Robots。
- Open Graph。
- Structured Data。
- Breadcrumb。
- 清楚的 H1/H2/H3。
- 圖片替代文字。
- 語意化 HTML。
- 內部連結。
- 文章作者、日期、更新日期等必要欄位。

News、Insights、Case Studies 應具備適合搜尋引擎理解的結構化內容。

不要大量堆砌關鍵字。

GEO 的核心應是清楚、可驗證、容易被理解與引用的專業內容，而不是虛構 FAQ 或製造沒有實質資訊的文章。

產品與 Solutions 應互相關聯。

例如：

Military Solution → SUT Product → MUM-T Insight → Related Case Study。

---

### 二十三、效能與使用者體驗

網站需符合良好的 Core Web Vitals。

設計與工程內部目標：

- LCP ≤ 2.0 秒。
- INP ≤ 150 毫秒。
- CLS ≤ 0.05。

這是較積極的內部目標，不應誤稱為 Google 官方通過門檻。

應以真實使用者 p75 數據進行驗證。

Lighthouse 用於診斷。

**設計要求**

- Hero Video 不應阻塞首屏。
- 圖片依實際顯示尺寸輸出。
- 使用現代圖片格式。
- 適當 Lazy Loading。
- 避免版面位移。
- 字型合理載入。
- 動畫不應造成大量重排。
- 支援 Reduced Motion。
- Mobile First Responsive。
- 鍵盤可操作。
- 色彩對比符合無障礙要求。
- 表單有明確錯誤訊息。

首頁的 News、Case Studies：

- Desktop 可顯示 3～4 張卡片。
- Tablet 可採 2×2。
- Mobile 可採圖片在左、標題在右的橫向排列。

實際排版仍應依設計系統與內容長度調整。

---

### 二十四、頁面設計示意圖的使用方式

先前已討論並產生：

1. Home。
2. Products Overview。
3. SUT Product Detail。

三頁必須保持一致的設計語言：

- 相同 Header。
- 相同 Logo。
- 相同字型系統。
- 相同企業色。
- 相同按鈕樣式。
- 相同卡片系統。
- 相同 Footer。
- 相同 Responsive 邏輯。

但三頁的資訊任務不同。

**Home**

負責品牌與 Solutions 導流。

**Products**

負責產品探索、比較與分類。

**SUT Product Page**

負責深入介紹單一產品並促成型錄申請或 Demo 預約。

先前的 AI 示意圖只是視覺參考，不是正式網站素材。

不能將 AI 示意圖裡的虛構產品配置、合作單位、營運數字或訓練成效當成公司事實。

例如「100+ Projects」、「50+ Partners」、「10+ Years」等數字，必須經公司確認才能公開。

示意圖中不符合正式 CIS 的 Logo，也必須全部替換成正式素材。

---

### 二十五、網站資產與真實素材

優先使用：

- 正式 CIS。
- 正式 Logo。
- 既有產品照片。
- 既有產品影片。
- 已核准的展會照片。
- 已核准的產品說明。
- 公司實際製作的系統截圖。

不要使用與實際設備不符的 AI 圖像冒充產品照片。

可以使用概念視覺作為情境輔助，但必須與真實產品展示明確區分。

涉及軍事、警察、政府、合作夥伴或客戶 Logo 的素材，需確認公開使用權限。

---

### 二十六、分階段實作

請不要一次大規模重寫整個 Repository。

建議工作順序：

**Phase 1：Audit**

檢查：

- Repo。
- Astro 版本。
- CMS 設定。
- Deployment。
- Assets。
- Routing。
- 現有 Collections。
- Forms。
- SEO。
- 舊站需要遷移的內容。

**Phase 2：Information Architecture**

確認：

- Sitemap。
- Navigation。
- URL。
- Products 資料模型。
- Solutions 關聯。
- Resources。
- Company。
- Investor Relations。

**Phase 3：Design System**

建立：

- Tokens。
- Typography。
- Colors。
- Spacing。
- Grid。
- Buttons。
- Cards。
- Header。
- Footer。
- Form Components。

**Phase 4：核心頁面**

優先完成：

1. Home。
2. Products Overview。
3. SUT Product Detail。

確認三頁風格一致後，再擴充其他產品與內容頁。

**Phase 5：CMS**

完成可維護的 Collections 與資料關聯。

**Phase 6：Forms & Security**

實作：

- General Contact。
- Request Brochure。
- Book Live Demo。
- Validation。
- Risk Checks。
- Review Workflow。
- Protected Document Delivery。

**Phase 7：Multilingual & SEO**

完成三語系、Metadata、hreflang、Sitemap、Redirect。

**Phase 8：QA & Deployment**

進行：

- Responsive QA。
- Accessibility。
- Performance。
- Security Review。
- CMS Editing Test。
- Form End-to-End Test。
- Redirect Test。
- Deployment Verification。

---

### 二十七、你應該如何協助我

請以資深品牌設計師、UX/UI Designer、Information Architect、SEO Strategist 及 Astro 技術架構師的角度處理這個專案。

但請注意，這是一個實際需要上線、維護與持續擴充的企業官網。

不是只需要一張漂亮的概念圖。

工作時請遵守：

1. 已確認的決策不要自行推翻。
2. 尚未確認的內容明確標記待確認。
3. 不要虛構產品功能、產品名稱、規格、案例或合作關係。
4. 不要擅自修改正式 Logo。
5. 不要將所有無人載具功能塞進 SUT。
6. 不要將 MUM-T 當成獨立 Product。
7. 不要將 Solutions 與 Product Categories 混為一談。
8. 不要重新加入 Applications。
9. 不要重新導入 Email OTP。
10. 不要自動開放型錄下載。
11. 不要自行建立大量空白的投資人關係頁面。
12. 不要讓首頁變成產品型錄。
13. 不要為了設計感犧牲效能、SEO 或可維護性。
14. 不要在沒有盤點既有程式碼的情況下直接重構整個網站。
15. 不要只交付漂亮畫面，卻沒有可實作的組件與內容模型。

### 目前請優先執行的工作

先根據這份需求與現有 Repository，完成以下工作：

**A. 現況盤點**

列出目前已經完成、部分完成、尚未完成的功能。

**B. 資訊架構確認**

提出正式 Sitemap、Navigation、URL 與 CMS Collection 關係。

**C. 三頁一致的設計提案**

先針對：

- Home。
- Products Overview。
- SUT Product Detail。

提出完整 Desktop／Tablet／Mobile 設計架構。

**D. 產品資料關係**

明確呈現：

- SUT。
- UAV。
- USV。
- Counter-UAS。
- MUM-T。

如何在 Products、Training Scenarios 與 CMS Relationships 中運作。

**E. 技術落地計畫**

說明如何利用現有 Astro／Decap CMS 架構實現，而不是另起一套不必要的新系統。

請先交付 Audit、架構與設計方案，再依確認結果進入正式實作。

最終目標是建立一個**符合 Big x Reality CIS、具有國際企業水準、能夠支援業務轉換與長期內容營運的官方網站**。