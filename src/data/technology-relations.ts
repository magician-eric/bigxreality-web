/** Editorial subject links, not assertions that a product implements every capability of a technology. */
export const technologyRelations = {
  xr: {
    products: ["sut", "full-scale-police-training", "police-box", "usv", "fire-extinguisher-simulator"],
    solutions: [], primaryDestination: "products",
  },
  "training-design": {
    products: ["sut", "mortar-observation", "full-scale-police-training", "police-box", "fire-extinguisher-simulator"],
    solutions: [], primaryDestination: "products",
  },
  "domain-expertise": {
    products: [], solutions: ["military", "police", "fire-rescue", "smart-city"], primaryDestination: "solutions",
  },
  "ai-simulation": {
    products: ["sut", "uav"], solutions: ["military"], primaryDestination: "products",
  },
  "digital-simulation": {
    products: ["sut", "wargaming-table", "hmmwv-simulator", "tactical-boat-simulator", "usv", "fire-extinguisher-simulator"],
    solutions: [], primaryDestination: "products",
  },
  "system-integration": {
    products: ["sut", "usv"], solutions: ["military", "mum-t", "nova"], primaryDestination: "solutions",
  },
  "decision-visualization": {
    products: ["wargaming-table"], solutions: ["military", "nova"], primaryDestination: "products",
  },
} as const;

export const technologyRelationNotes = {
  "ai-simulation": {
    tw: ["以下連結為相關應用領域，不代表所列產品均搭載 AI。具體 AI 應用與可用功能，應依產品資料及專案配置確認。"],
    en: ["These links identify related application areas; they do not mean that every listed product incorporates AI. Confirm specific AI applications and available features against the product information and project configuration."],
    jp: ["以下のリンクは関連する活用分野を示すものであり、掲載製品のすべてが AI を搭載していることを意味しません。具体的な AI の活用方法と利用可能な機能は、製品情報とプロジェクトの構成に基づいて確認する必要があります。"],
  },
  "system-integration": {
    tw: ["MUM-T 與 NOVA 是不同的軍事子解決方案，不是產品。", "MUM-T 以小隊層級的資訊共享與協同為主，重點涉及士兵及隊長胸掛板的資訊整合。", "NOVA 屬於較大型的跨系統模擬整合方向。", "兩者並非同一系統；SUT、UAV、USV 是否參與特定整合，應依實際產品與專案配置確認。"],
    en: ["MUM-T and NOVA are distinct military sub-solutions, not products.", "MUM-T focuses on information sharing and coordination at small-unit level, particularly information integration on soldiers’ and team leaders’ chest-mounted tablets.", "NOVA addresses larger-scale integration across simulation systems.", "They are not the same system. Whether SUT, UAV or USV participates in a particular integration must be confirmed against the actual products and project configuration."],
    jp: ["MUM-T と NOVA はそれぞれ異なる軍事分野のサブソリューションであり、製品ではありません。", "MUM-T は小部隊レベルの情報共有と連携を中心とし、特に隊員および隊長の胸部装着型タブレットにおける情報統合に関わります。", "NOVA は、より大規模なシステム間シミュレーション統合を対象とするものです。", "両者は同一のシステムではありません。SUT、UAV、USV が特定の統合に参加するかどうかは、実際の製品とプロジェクトの構成に基づいて確認する必要があります。"],
  },
  "decision-visualization": {
    tw: ["NOVA 是軍事模擬下的子解決方案，不是兵棋圖台的別名。兩者同時列於相關領域，不代表兵棋圖台已與 NOVA 完成整合；實際介接功能應依已確認的產品與專案配置評估。"],
    en: ["NOVA is a sub-solution within military simulation, not another name for the wargaming table. Listing both as related areas does not mean that the wargaming table has been integrated with NOVA. Any interfaces must be assessed against confirmed product capabilities and project configurations."],
    jp: ["NOVA は軍事シミュレーション分野のサブソリューションであり、兵棋演習テーブルの別名ではありません。両者を関連分野として併記しても、兵棋演習テーブルと NOVA の統合が完了していることを意味しません。実際の接続機能は、確認済みの製品機能とプロジェクトの構成に基づいて評価する必要があります。"],
  },
} as const;
