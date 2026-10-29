# 分批交付

| 批次 | 分支 | 範圍 | 審核 |
| --- | --- | --- | --- |
| 1 | codex/home-hero-video | 首頁影片構圖、輪播、鍵盤／減少動態效果 | [PR #47](https://github.com/magician-eric/bigxreality-web/pull/47)，使用者已合併 |
| 2 | codex/image-composition | 共用圖片、Hero、卡片、缺圖與獨立截圖 | [查看差異／建立 PR](https://github.com/magician-eric/bigxreality-web/compare/main...codex/image-composition?expand=1) |
| 3 | codex/positive-corporate-copy | 三語文案、逐欄對照、素材與驗證報告 | [以第二批為基底查看／建立 PR](https://github.com/magician-eric/bigxreality-web/compare/codex/image-composition...codex/positive-corporate-copy?expand=1) |

第三批以第二批為基底，避免重複審核圖片修改；待第二批合併後，將第三批 PR 的 base 改為 main。各批只推送分支，沒有自行合併。

Git push 成功；GitHub GraphQL 與 REST 建立 PR API 均回覆 Forbidden，包含環境外重試。第二、三批在取得 PR 編號前稱為待建立 PR，不冒稱已建立。
