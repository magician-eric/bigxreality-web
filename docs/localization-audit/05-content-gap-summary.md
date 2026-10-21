# 05｜三語內容缺漏統計、英日新增內容、繁中母版缺口

版本／方法：見 01。問題：C-08、C-13、C-14（以及 C-01～C-12 的統計）。

## 1. 缺漏統計
| 項目 | TW | EN | JP |
|---|---|---|---|
| 已建立頁面 | 31 | 31 | 31 |
| 與 TW 完整對應的頁面 | — | 0 | 0 |
| 精簡版（產品） | — | 12 | 12 |
| 改寫且有區塊缺漏（解決方案＋總覽） | — | 7 | 7 |
| [待翻譯] 佔位頁 | — | 12 | 12 |
| 產品：卡片層級項目（標題＋說明） | 282 | 73（多為只有標題） | 73 |
| 產品：簡介段落 | 27 | 0 | 0 |
| 產品：FAQ 題數 | 60 | 0 | 0 |
| 產品：圖片位置 | 125 | 0 | 0 |
| 解決方案：卡片層級項目 | 117 | 57（重寫） | 57 |
| 解決方案：圖片位置 | 46 | 0 | 0 |
| 介面字串（共 297）未翻譯 | 0 | 201 | 150 |
| noindex 頁（因內容未翻譯或無資料） | 9 | 12 | 12 |
| 在 sitemap 的網址 | 22 | 19 | 19 |
| 三語都不存在的頁面（首頁、核心技術、隱私權） | 3 | 3 | 3 |

產品頁英日完全缺漏的區塊數：簡介 12、訓練流程 11、FAQ 12、延伸說明 9、結尾說明 12。被壓縮成一句的區塊：挑戰 11、解決方式 11、能力 12、情境 12、價值 12。

## 2. C-08：英日有、繁中沒有的內容（依新版繁中＋FAQ 重新判定）
| 頁面 | 英文（日文相同） | 判定 | 繁中依據 |
|---|---|---|---|
| SUT | tactical law enforcement preparation | **無依據** | TW 只屬於軍事；FAQ 寫「軍事或相關專業單位」 |
| UAV | critical infrastructure security | **無依據** | — |
| UAV | base protection | 有依據 | FAQ「基地防護」 |
| UAV | engagement procedures | 部分一致 | FAQ「反制行為屬虛擬情境及程序演練」；英日沒有附上範圍聲明 |
| 兵棋圖台 | touch-based map、VR visualization、force movement | 有依據（僅 FAQ） | FAQ 有寫；TW 主文沒有 → A-06 |
| 兵棋圖台 | Training Challenges、How It Works 區塊 | **區塊新增** | TW 無此區 |
| 迫擊砲 | fire adjustment | 有依據（僅 FAQ） | FAQ「射擊修正」 |
| 機槍 | fire control、target engagement | 大致一致 | FAQ「火力運用概念、目標應對」 |
| 狙擊槍 | stability | **無依據** | — |
| 悍馬車 | restricted visibility | **無依據** | — |
| 悍馬車 | tactical mobility | 有依據 | FAQ「戰術機動準備」 |
| 快艇 | naval training、maritime security；名稱加「Military／軍用」 | **無依據** | — |
| 全配式警勤 | compatible simulated police equipment | 有依據 | FAQ 模擬警用裝備 |
| 全配式警勤 | team-based exercises；police academies、training centers | **無依據** | — |
| BOX | wheeled case（キャスター付き） | **無依據** | TW「可攜式箱體」 |
| BOX | individual or group training | **無依據** | FAQ 只寫「人數依版本」 |
| BOX | mobile instructional teams | 有依據 | FAQ「巡迴訓練」 |
| VR 滅火、消防方案 | extinguisher selection | 有依據（僅 FAQ） | TW 主文寫「介紹」→ A-06 |
| 消防方案 | Experience Mode＝熟悉環境 | **語意不符** | TW＝介紹四類火災與三種滅火器 |
| VR 滅火、消防方案 | industrial building（鐵皮屋） | **語意不符** | 鐵皮屋 |
| 警勤方案 | safe-distance management、equipment selection、changing threat conditions、team-based | **無依據** | — |
| 警勤方案 | Featured Products 區塊 | **區塊新增** | — |
| MUM-T | integration must be assessed | **立場不同** | TW「依據已完成的整合功能」→ A-04 |
| NOVA | Important Scope 聲明 | 區塊新增 | TW 兵棋圖台 FAQ 有類似聲明 |
| 解決方案總覽 | 結尾 CTA、四張卡片口號 | 區塊新增 | — |
| 產品／方案頁 | Back to Products／Solutions | UI 新增 | TW 字串為空 |

處理方式：「無依據」項目請業主確認是否屬實。屬實→先補進繁中母版；不屬實→從英日刪除。由 ChatGPT 依繁中重寫英日時，不得保留無依據項目。

## 3. C-13：名稱不一致（同時影響 SEO 實體辨識 → A-05）
| 對象 | TW 頁名 | TW 檔內英文名 | EN 站 | JP 站 |
|---|---|---|---|---|
| 警勤方案 | 警勤模擬 | Police Simulation | Law Enforcement Training | 警察訓練シミュレーション |
| 消防方案 | 消防防災 | Fire & Disaster Prevention | Fire & Disaster Preparedness | 消防・防災 |
| MUM-T 方案 | MUM-T 小隊戰術協同訓練 | MUM-T Squad Tactical Teaming | MUM-T Small-Unit Tactical Coordination | MUM-T｜小部隊戦術連携 |
| MUM-T 整合情境 | MUM-T 人機協同訓練 | Manned-Unmanned Teaming | [待翻譯] | [待翻譯] |
| 全配式 | 全配式警勤訓練系統（On-sited） | — | …— On-site | （常設型） |
| 悍馬車 | 悍馬車載具訓練系統 | — | Humvee Driving Simulator | ハンヴィー運転訓練シミュレーター |
| 快艇 | 快艇載具訓練系統 | — | Military Speedboat Simulator | 軍用高速艇操縦シミュレーター |
| 兵棋圖台 | 兵棋圖台系統 | — | BXR Wargaming Table | BXR ウォーゲーミングテーブル |
| 滅火器用詞 | 主文「滅火器」 | — | — | — |
| 滅火器用詞 | FAQ「消火器」 | — | — | — |

需要先確定一份三語命名表（業主決定），再交由 ChatGPT 套用。

## 4. C-14：繁中母版本身的缺口（英日無從翻譯，需先寫繁中）
- 頁面未建立：首頁 `/tw/`、核心技術 `/tw/technologies/`、隱私權政策 `/tw/privacy/`（→ T-01、T-03）。
- [待提供]：`pages/tw/products.md` 的 seo.description、hero.description、cta.title／description（**頁面可被索引** → T-08）；news、insights、search、tags 的說明；`site.json` 的地址、電話、社群、人才招募、表單網址。
- 解決方案頁沒有 FAQ（產品頁有）→ K-13～K-19。
- 繁中內部前後不一：兵棋圖台（主文沒有觸控／VR，FAQ 有）、迫擊砲（主文「判讀」，FAQ「射擊修正」）、VR 滅火（主文「介紹」，FAQ「選擇」）、整合範圍（MUM-T 頁、產品總覽、SUT FAQ 的說法不同）→ A-04、A-06。
