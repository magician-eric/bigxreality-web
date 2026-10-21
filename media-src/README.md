# media-src

原始影片，不會輸出到網站。首頁階段依 `docs/PLAN.md` §4.3 的規格壓縮後才放進網站。

| 檔案 | 來源 | 規格 |
|---|---|---|
| `hero/home-hero-video-1.mp4` | 舊 repo `public/images/home/hero/` | 1280×720、24fps、4.1 秒、有音軌 |
| `hero/home-hero-video-2.mp4` | 同上 | 1920×1080、30fps、2.9 秒、有音軌 |

首頁輸出（已去除音軌，`public/video/hero/hero-{1,2}.{webm,mp4}`，合計約 1.35 MB）；封面圖取自 video-2 第一幀：`src/assets/images/home/hero-poster.jpg`。
