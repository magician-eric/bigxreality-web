// Japanese solutions and product pages (/jp/): complete localization of the Traditional Chinese master —
// each page renders its content file, keeps the Chinese page's sections and item counts, the five FAQs
// and their scope statements, with no placeholder text. Shared checks: lib/qa-localized.mjs.
import { runLocalizedQa } from "./lib/qa-localized.mjs";

await runLocalizedQa({
  lang: "jp",
  port: 4340,
  htmlLang: "ja-JP",
  // Traditional Chinese forms that Japanese writes differently (們 這 說 與 為 對 產 實 發 體 驗 應).
  foreign: /[們這說與為對產實發體驗應]/,
  nav: { top: ["ソリューション", "製品情報", "コア技術", "リソース", "BXRについて"], resources: ["ニュース", "技術コラム", "導入事例"], contact: "お問い合わせ" },
  scope: {
    sut: ["USVシステムの映像情報をSUTの訓練環境に送信できることです"],
    uav: ["実際に配備されるドローンの探知、妨害、迎撃装置と同等のものではありません"],
    usv: ["実際の無人艇を遠隔操縦する機能を備えているとは言えません", "両システムのすべての機能が相互に接続されていることを意味するものではありません"],
    "wargaming-table": ["標準で接続できる機能を備えていることを意味するものでもありません"],
    "mortar-observation": ["迫撃砲の実際の発射操作を完全に再現するシミュレーションシステムと理解すべきではありません"],
    "full-scale-police-training": ["実際の法執行に使用できる装備とみなすべきではありません"],
    "fire-extinguisher-simulator": ["引き続き現地の消防法規と機器の表示に従う必要があります"],
  },
});
