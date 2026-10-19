// Test-only site for the Pagefind spike. Chinese text is taken from the real
// phase 1 content (src/content/**/tw); English and Japanese text is spike-only.
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const LANG = { en: "en", tw: "zh-Hant-TW", jp: "ja-JP" };
const pages = {
  tw: {
    "products/sut": ["SUT 小型部隊專項訓練系統", "SUT = Small Unit Tactical。SUT 小型部隊專項訓練系統主要針對約 1 至 4 人的小部隊戰術訓練，定位為可擴充的小部隊戰術訓練系統。核心能力：隊形、掩護與移動；小隊溝通與協同；情境判斷；訓練評估。訓練情境：基礎射擊訓練、CQB 近接戰鬥、小部隊戰術情境。"],
    "products/uav": ["UAV 無人機戰術訓練系統", "UAV 無人機戰術訓練系統是獨立產品。目前已知有獨立的無人機訓練課程，學員可以透過搖桿控制虛擬無人機飛行。核心能力：UAV 飛行操控、搖桿操作、與地面部隊的協同訓練。"],
    "products/usv": ["USV 無人船 VR 訓練系統", "USV 無人船 VR 訓練系統目前是一個可以獨立運行的 VR App，同時可以將無人船的畫面串流進 SUT 的 MUM-T 訓練情境。"],
    "insights/mum-t": ["MUM-T 人機協同訓練", "SUT、UAV、USV 可以共同參與的整合訓練情境。SUT 人員執行地面戰術任務，可以持槍，也可以操作無人機；UAV 提供空中視角，USV 提供海上無人載具視角；SUT 人員的胸掛顯示板可觀看 UAV、USV 的整合影像。"],
  },
  en: {
    "products/sut": ["SUT Small Unit Tactical Training System", "SUT focuses on small unit tactical training for teams of about one to four people. Capabilities include formation, cover and movement, team communication, situational judgement and training assessment. Scenarios include basic marksmanship and close quarters battle."],
    "products/uav": ["UAV Tactical Training System", "Trainees fly a virtual drone with a joystick. The unmanned aerial vehicle course covers flight control and coordination with ground forces."],
    "products/usv": ["USV Unmanned Surface Vehicle VR Training", "A standalone VR app that can stream the unmanned vessel view into the SUT manned-unmanned teaming scenario."],
    "insights/mum-t": ["MUM-T Manned-Unmanned Teaming", "SUT, UAV and USV take part in one integrated training scenario. A chest-mounted display shows the combined drone and vessel video."],
  },
  jp: {
    "products/sut": ["SUT 小部隊戦術訓練システム", "SUT は約1〜4人の小部隊による戦術訓練のためのシステムです。隊形、援護と移動、チーム内の連携、状況判断、訓練評価を扱います。シナリオには基礎射撃と近接戦闘が含まれます。"],
    "products/uav": ["UAV ドローン戦術訓練システム", "受講者はジョイスティックで仮想ドローンを操縦します。無人航空機の飛行操作と地上部隊との連携を訓練します。"],
    "products/usv": ["USV 無人艇 VR 訓練システム", "単独で動作する VR アプリで、無人艇の映像を SUT の有人・無人チーミング訓練に配信できます。"],
    "insights/mum-t": ["MUM-T 有人無人連携訓練", "SUT、UAV、USV がひとつの統合訓練シナリオに参加します。胸部ディスプレイでドローンと無人艇の映像を確認できます。"],
  },
};

const html = (lang, title, body, indexable) => `<!doctype html><html lang="${LANG[lang]}"><head><meta charset="utf-8"><title>${title}</title></head>
<body><header>NAVTOKEN 選單 menu メニュー</header><main ${indexable ? "data-pagefind-body" : ""}><h1>${title}</h1><p>${body}</p></main></body></html>`;

for (const lang of Object.keys(pages)) {
  const write = async (p, content) => {
    const dir = path.join("site", lang, p);
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, "index.html"), content);
  };
  for (const [p, [t, b]] of Object.entries(pages[lang])) await write(p, html(lang, t, b, true));
  // must never be found: listing page, pending translation, search page
  await write("news", html(lang, "LISTINGTOKEN list", "LISTINGTOKEN 列表 一覧", false));
  await write("pending", html(lang, "PENDINGTOKEN", "PENDINGTOKEN 待翻譯 翻訳待ち", false));
  await write("search", html(lang, "search", "", false));
}
console.log("site written");
