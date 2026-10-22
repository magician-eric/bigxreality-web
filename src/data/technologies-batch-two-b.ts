import type { TechnologyPageContent } from './technologies-content.ts';

/** Batch two content: TW is the supplied master; Japanese is translated directly from TW. */
export const batchTwoB = {
  "system-integration": {
    "tw": {
      "eyebrow": "核心技術",
      "title": "通訊與系統整合",
      "lead": "讓訓練設備、操作介面與資訊系統，在適當的架構中協同運作",
      "intro": [
        "專業模擬訓練不一定只使用單一設備。依照任務需求，訓練系統可能涉及操作裝置、顯示設備、模擬環境及其他資訊介面。",
        "當訓練需求跨越不同設備與系統時，通訊與系統整合能力便成為重要的技術課題。",
        "BXR 依照產品功能與專案需求，評估設備介接、資訊傳遞及系統配置方式，讓不同技術元件能在適合的訓練架構中發揮作用。"
      ],
      "primaryCta": "探索相關解決方案",
      "secondaryCta": "洽詢系統整合需求",
      "sections": [
        {
          "id": "concept",
          "title": "系統整合，不等於把所有設備接在一起",
          "paragraphs": [
            "不同訓練設備具有各自的操作方式、資料格式與系統限制。",
            "即使兩套設備都能傳輸資訊，也不代表它們可以直接交換資料或共同運作。",
            "真正的系統整合，需要先確認訓練目的、設備能力、介接條件與資訊使用方式，再決定適合的架構。"
          ],
          "items": [
            {
              "title": "設備介接",
              "paragraphs": [
                "評估不同操作設備、顯示裝置與模擬系統之間的連接需求。"
              ]
            },
            {
              "title": "資訊傳遞",
              "paragraphs": [
                "依實際應用規劃需要傳送的影像、狀態或其他資料。"
              ]
            },
            {
              "title": "系統配置",
              "paragraphs": [
                "依場域、設備及訓練需求安排適當的系統架構。"
              ]
            },
            {
              "title": "相容性評估",
              "paragraphs": [
                "確認不同設備與系統是否具備必要的介面、協定或開發條件。"
              ]
            }
          ]
        },
        {
          "id": "integration-design",
          "title": "從訓練目的出發，決定哪些資訊需要整合",
          "paragraphs": [
            "系統整合應服務於明確的訓練目標，而不是追求設備連接的數量。",
            "例如，某些訓練只需要將特定畫面傳送到另一套系統；另一些情境可能需要操作裝置與模擬環境之間的互動。",
            "這些需求在資料種類、傳輸方式、延遲要求及設備配置上都可能不同。",
            "因此，BXR 依照實際產品與專案條件，評估必要的資訊交換與系統介接方式。"
          ],
          "items": [
            {
              "title": "整合需求確認",
              "paragraphs": [
                "先釐清需要連接的設備，以及資訊傳遞的目的。"
              ]
            },
            {
              "title": "技術條件評估",
              "paragraphs": [
                "確認硬體介面、軟體架構與可使用的資料形式。"
              ]
            },
            {
              "title": "系統介接規劃",
              "paragraphs": [
                "依可行條件安排資訊流向與操作方式。"
              ]
            },
            {
              "title": "測試與調整",
              "paragraphs": [
                "依實際系統配置測試介接結果與使用情境。"
              ]
            }
          ]
        },
        {
          "id": "confirmed-application",
          "title": "以具體需求建立系統間的資訊連結",
          "paragraphs": [
            "在特定應用中，BXR 已有將 USV 無人船影像資訊提供至 SUT 訓練系統的整合情境。",
            "這類應用說明，系統整合可以從明確的資訊需求出發，讓不同系統在特定任務中建立有用途的連結。",
            "但這不代表所有 SUT、UAV、USV 產品均已具備全面互通能力，也不代表所有資訊都能傳送到其他設備。",
            "實際可整合的資料與操作方式，仍須依產品功能及專案條件確認。"
          ]
        },
        {
          "id": "value",
          "title": "讓每一項整合，都有清楚的使用目的",
          "paragraphs": [
            "適當的通訊與系統整合，可以協助訓練單位依需求組合設備、安排資訊顯示方式，或建立特定系統之間的資料連結。",
            "其價值不在於宣稱所有系統都能互通，而是讓必要的資訊能在可行的技術條件下支援訓練應用。",
            "主要價值："
          ],
          "bullets": [
            "依訓練需求評估設備與系統介接。",
            "支援特定影像或資訊的傳遞應用。",
            "協助規劃不同設備的操作與顯示方式。",
            "依既有產品能力評估整合可行性。",
            "避免不必要的系統複雜度。"
          ]
        }
      ],
      "relatedTitle": "從產品能力到跨系統應用規劃",
      "faq": [
        {
          "question": "模擬訓練中的系統整合是什麼？",
          "answer": "系統整合是依訓練需求，規劃不同設備、操作介面或模擬系統之間的連接與資訊交換。實際整合範圍取決於系統架構、介接條件及使用目的。"
        },
        {
          "question": "不同的模擬訓練產品都能互相連線嗎？",
          "answer": "不一定。不同產品可能使用不同的硬體、軟體與資料架構，是否能互通，需要確認相關介面、協定、資訊格式及實際產品功能。"
        },
        {
          "question": "MUM-T 與 NOVA 是同一套整合系統嗎？",
          "answer": "不是。MUM-T 主要著重小隊層級的資訊共享與協同應用；NOVA 則屬於較大型的跨系統模擬整合方向。兩者具有不同的應用層級與設計目的。"
        },
        {
          "question": "BXR 是否能將 USV 影像提供給 SUT 訓練系統？",
          "answer": "BXR 已有 USV 影像資訊提供至 SUT 的特定整合應用情境。但實際使用方式與可傳遞資訊，仍須依相關產品版本及系統配置確認。"
        },
        {
          "question": "系統整合是否一定需要重新開發所有設備？",
          "answer": "不一定。整合方式取決於既有設備的介面、資料架構與可擴充條件。部分需求可能透過適當的介接規劃處理，另一些則可能需要額外開發或設備調整。"
        }
      ],
      "closing": {
        "title": "從必要的資訊連結開始，規劃適合的系統整合",
        "body": "不同設備與模擬系統具有不同的技術條件。BXR 可依訓練需求，討論可行的介接方式與整合應用方向。",
        "cta": "洽詢系統整合需求"
      },
      "seo": {
        "title": "通訊與系統整合｜XR 訓練設備與資訊介接",
        "description": "了解 BXR 如何依專業訓練需求評估設備介接、影像資訊傳遞及模擬系統整合，並認識 SUT、USV、MUM-T 與 NOVA 等不同應用架構的關係。"
      }
    },
    "en": {
      "eyebrow": "Core Technology",
      "title": "Communication & System Integration",
      "lead": "Enable training equipment, operating interfaces, and information systems to work together within an appropriate architecture",
      "intro": [
        "Professional simulation training does not necessarily use just one device. Depending on mission requirements, a training system may involve operating devices, displays, simulated environments, and other information interfaces.",
        "When training requirements span different devices and systems, communication and system integration become important technical considerations.",
        "BXR evaluates equipment interfacing, information transfer, and system configurations according to product capabilities and project requirements, enabling different technical components to serve their purpose within a suitable training architecture."
      ],
      "primaryCta": "Explore related solutions",
      "secondaryCta": "Discuss your system integration requirements",
      "sections": [
        {
          "id": "concept",
          "title": "System integration means more than connecting every device",
          "paragraphs": [
            "Different training devices have their own operating methods, data formats, and system limitations.",
            "Even if two systems can transmit information, that does not mean they can directly exchange data or operate together.",
            "Meaningful system integration requires confirming training objectives, equipment capabilities, interface conditions, and how information will be used before choosing an appropriate architecture."
          ],
          "items": [
            {
              "title": "Equipment interfacing",
              "paragraphs": [
                "Evaluate connection requirements between different operating devices, displays, and simulation systems."
              ]
            },
            {
              "title": "Information transfer",
              "paragraphs": [
                "Plan which video, status information, or other data needs to be transmitted for the actual application."
              ]
            },
            {
              "title": "System configuration",
              "paragraphs": [
                "Arrange an appropriate system architecture according to the site, equipment, and training requirements."
              ]
            },
            {
              "title": "Compatibility assessment",
              "paragraphs": [
                "Confirm whether different devices and systems have the necessary interfaces, protocols, or development prerequisites."
              ]
            }
          ]
        },
        {
          "id": "integration-design",
          "title": "Start with training objectives to determine which information needs to be integrated",
          "paragraphs": [
            "System integration should serve clear training objectives rather than maximize the number of connected devices.",
            "For example, some training activities only require sending a particular video feed to another system; other scenarios may require interaction between operating devices and the simulated environment.",
            "These requirements may differ in data types, transmission methods, latency requirements, and equipment configurations.",
            "BXR therefore evaluates the necessary information exchanges and system interfaces according to actual product and project conditions."
          ],
          "items": [
            {
              "title": "Confirm integration requirements",
              "paragraphs": [
                "First clarify which devices need to be connected and the purpose of transferring information."
              ]
            },
            {
              "title": "Assess technical conditions",
              "paragraphs": [
                "Confirm hardware interfaces, software architectures, and the data formats available for use."
              ]
            },
            {
              "title": "Plan system interfaces",
              "paragraphs": [
                "Arrange information flows and operating methods within feasible technical conditions."
              ]
            },
            {
              "title": "Test and adjust",
              "paragraphs": [
                "Test interface outcomes and usage scenarios with the actual system configuration."
              ]
            }
          ]
        },
        {
          "id": "confirmed-application",
          "title": "Build information links between systems around specific requirements",
          "paragraphs": [
            "In a specific application, BXR has implemented an integration scenario that supplies video information from an unmanned surface vessel (USV) to the SUT training system.",
            "This type of application illustrates how system integration can begin with a clear information requirement and establish useful connections between different systems for a particular mission.",
            "However, this does not mean all SUT, UAV, and USV products already offer comprehensive interoperability, nor that every type of information can be sent to other equipment.",
            "The data and operating methods that can actually be integrated must still be confirmed against product capabilities and project conditions."
          ]
        },
        {
          "id": "value",
          "title": "Give every integration a clear purpose",
          "paragraphs": [
            "Appropriate communication and system integration can help training organizations combine equipment according to their needs, arrange how information is displayed, or establish data links between particular systems.",
            "The value lies in enabling necessary information to support training applications within feasible technical conditions, rather than claiming that all systems are interoperable.",
            "Key benefits:"
          ],
          "bullets": [
            "Assess equipment and system interfaces according to training requirements.",
            "Support the transfer of specific video feeds or information.",
            "Help plan how different devices are operated and how information is displayed.",
            "Evaluate integration feasibility based on existing product capabilities.",
            "Avoid unnecessary system complexity."
          ]
        }
      ],
      "relatedTitle": "From product capabilities to cross-system application planning",
      "faq": [
        {
          "question": "What is system integration in simulation training?",
          "answer": "System integration involves planning connections and information exchange between different devices, operating interfaces, or simulation systems according to training requirements. The actual scope depends on the system architecture, interface conditions, and intended use."
        },
        {
          "question": "Can different simulation training products all connect to one another?",
          "answer": "Not necessarily. Different products may use different hardware, software, and data architectures. Interoperability requires confirming the relevant interfaces, protocols, information formats, and actual product capabilities."
        },
        {
          "question": "Are MUM-T and NOVA the same integrated system?",
          "answer": "No. MUM-T primarily focuses on squad-level information sharing and collaboration, while NOVA addresses larger-scale cross-system simulation integration. They operate at different application levels and have different design objectives."
        },
        {
          "question": "Can BXR supply USV video to the SUT training system?",
          "answer": "BXR has a specific integration application scenario that supplies USV video information to SUT. However, the actual usage and information that can be transferred must still be confirmed for the relevant product versions and system configurations."
        },
        {
          "question": "Does system integration always require redeveloping all equipment?",
          "answer": "Not necessarily. The integration approach depends on the interfaces, data architectures, and extensibility of existing equipment. Some requirements may be handled through appropriate interface planning, while others may require additional development or equipment adjustments."
        }
      ],
      "closing": {
        "title": "Start with the information links you need to plan appropriate system integration",
        "body": "Different devices and simulation systems have different technical conditions. BXR can discuss feasible interfaces and integration applications according to training requirements.",
        "cta": "Discuss your system integration requirements"
      },
      "seo": {
        "title": "Communication & System Integration｜XR Training",
        "description": "Learn how BXR assesses equipment interfaces, video information transfer, and simulation system integration for professional training, and understand the relationships between SUT, USV, MUM-T, and NOVA application architectures."
      }
    },
    "jp": {
      "eyebrow": "コア技術",
      "title": "通信・システム統合",
      "lead": "適切な構成のもとで、訓練機器、操作インターフェース、情報システムの連携を支える",
      "intro": [
        "専門的なシミュレーション訓練は、必ずしも単一の機器だけを使用するものではありません。任務の要件に応じて、操作装置、表示機器、シミュレーション環境、その他の情報インターフェースが関わる場合があります。",
        "訓練要件が異なる機器やシステムにまたがる場合、通信とシステム統合の能力は重要な技術課題となります。",
        "BXR は製品機能とプロジェクト要件に応じて、機器の接続、情報伝達、システム構成の方法を検討し、さまざまな技術要素が適切な訓練システム構成の中で役割を果たせるようにします。"
      ],
      "primaryCta": "関連ソリューションを見る",
      "secondaryCta": "システム統合の要件について相談する",
      "sections": [
        {
          "id": "concept",
          "title": "システム統合は、すべての機器を接続することではありません",
          "paragraphs": [
            "訓練機器ごとに、操作方法、データ形式、システム上の制約は異なります。",
            "二つのシステムがそれぞれ情報を送信できても、直接データを交換したり、連携して動作したりできるとは限りません。",
            "実際に役立つシステム統合には、まず訓練目的、機器の能力、接続条件、情報の利用方法を確認し、そのうえで適切な構成を決める必要があります。"
          ],
          "items": [
            {
              "title": "機器の接続",
              "paragraphs": [
                "異なる操作機器、表示装置、シミュレーションシステムの間で必要となる接続を検討します。"
              ]
            },
            {
              "title": "情報伝達",
              "paragraphs": [
                "実際の用途に応じて、送信する必要のある映像、状態、その他のデータを計画します。"
              ]
            },
            {
              "title": "システム構成",
              "paragraphs": [
                "利用場所、機器、訓練要件に応じて、適切なシステム構成を設計します。"
              ]
            },
            {
              "title": "互換性の評価",
              "paragraphs": [
                "異なる機器やシステムに、必要なインターフェース、プロトコル、開発条件が備わっているかを確認します。"
              ]
            }
          ]
        },
        {
          "id": "integration-design",
          "title": "訓練目的から、統合すべき情報を判断する",
          "paragraphs": [
            "システム統合は、機器の接続台数を追求するのではなく、明確な訓練目標に役立つものであるべきです。",
            "例えば、特定の映像を別のシステムへ送るだけでよい訓練もあれば、操作装置とシミュレーション環境の間でのインタラクションが必要なシナリオもあります。",
            "これらの要件は、データの種類、伝送方法、遅延の要件、機器構成の面で異なる場合があります。",
            "そのため、BXR は実際の製品とプロジェクトの条件に応じて、必要な情報交換とシステム接続の方法を検討します。"
          ],
          "items": [
            {
              "title": "統合要件の確認",
              "paragraphs": [
                "接続が必要な機器と、情報を伝達する目的を最初に明確にします。"
              ]
            },
            {
              "title": "技術条件の評価",
              "paragraphs": [
                "ハードウェアのインターフェース、ソフトウェア構成、利用可能なデータ形式を確認します。"
              ]
            },
            {
              "title": "システム接続の計画",
              "paragraphs": [
                "実現可能な条件に基づき、情報の流れと操作方法を計画します。"
              ]
            },
            {
              "title": "テストと調整",
              "paragraphs": [
                "実際のシステム構成を用いて、接続結果と利用シナリオをテストします。"
              ]
            }
          ]
        },
        {
          "id": "confirmed-application",
          "title": "具体的な要件に基づいて、システム間の情報連携を構築する",
          "paragraphs": [
            "BXR には、特定の用途において、USV（無人水上艇）の映像情報を SUT 訓練システムへ提供する統合シナリオがあります。",
            "このような活用は、明確な情報要件を出発点として、特定の任務で役立つつながりを異なるシステム間に構築できることを示しています。",
            "ただし、これはすべての SUT、UAV、USV 製品がすでに全面的な相互運用能力を備えていることを意味せず、あらゆる情報を他の機器に送信できることも意味しません。",
            "実際に統合できるデータと操作方法は、製品機能およびプロジェクトの条件に基づいて確認する必要があります。"
          ]
        },
        {
          "id": "value",
          "title": "一つひとつの統合に、明確な利用目的を持たせる",
          "paragraphs": [
            "適切な通信とシステム統合は、訓練組織が要件に応じて機器を組み合わせ、情報の表示方法を整えたり、特定のシステム間にデータ連携を構築したりするうえで役立ちます。",
            "その価値は、すべてのシステムが相互運用できると主張することではなく、実現可能な技術条件のもとで、必要な情報が訓練での活用を支えられるようにすることにあります。",
            "主な価値："
          ],
          "bullets": [
            "訓練要件に応じて、機器とシステムの接続を評価します。",
            "特定の映像や情報を伝達する用途を支援します。",
            "異なる機器の操作方法と表示方法の計画を支援します。",
            "既存の製品能力に基づいて、統合の実現可能性を評価します。",
            "不必要なシステムの複雑化を避けます。"
          ]
        }
      ],
      "relatedTitle": "製品の能力を踏まえた、システム間の活用計画へ",
      "faq": [
        {
          "question": "シミュレーション訓練におけるシステム統合とは何ですか？",
          "answer": "システム統合とは、訓練要件に応じて、異なる機器、操作インターフェース、シミュレーションシステムの間の接続と情報交換を計画することです。実際の統合範囲は、システム構成、接続条件、利用目的によって決まります。"
        },
        {
          "question": "異なるシミュレーション訓練製品は、すべて相互に接続できますか？",
          "answer": "必ずしもそうではありません。製品ごとに異なるハードウェア、ソフトウェア、データ構成を採用している場合があります。相互運用できるかどうかは、関連するインターフェース、プロトコル、情報形式、実際の製品機能を確認する必要があります。"
        },
        {
          "question": "MUM-T と NOVA は同じ統合システムですか？",
          "answer": "いいえ。MUM-T は主に小部隊レベルの情報共有と協同運用を重視し、NOVA はより大規模なシステム間シミュレーション統合を対象とする方向性です。両者は活用するレベルと設計目的が異なります。"
        },
        {
          "question": "BXR は USV の映像を SUT 訓練システムに提供できますか？",
          "answer": "BXR には、USV の映像情報を SUT に提供する特定の統合活用シナリオがあります。ただし、実際の利用方法と伝達できる情報は、関連する製品バージョンおよびシステム構成に基づいて確認する必要があります。"
        },
        {
          "question": "システム統合では、必ずすべての機器を再開発する必要がありますか？",
          "answer": "必ずしも必要ではありません。統合方法は、既存機器のインターフェース、データ構成、拡張条件によって決まります。適切な接続計画で対応できる要件もあれば、追加開発や機器の調整が必要な要件もあります。"
        }
      ],
      "closing": {
        "title": "必要な情報連携から、適切なシステム統合を計画する",
        "body": "機器やシミュレーションシステムごとに技術条件は異なります。BXR は訓練要件に応じて、実現可能な接続方法と統合活用の方向性についてご相談に応じます。",
        "cta": "システム統合の要件について相談する"
      },
      "seo": {
        "title": "通信・システム統合｜XR 訓練機器の接続",
        "description": "BXR が専門訓練の要件に応じて機器の接続、映像情報の伝達、シミュレーションシステム統合を検討する方法と、SUT、USV、MUM-T、NOVA などの異なる活用構成の関係をご紹介します。"
      }
    }
  },
  "decision-visualization": {
    "tw": {
      "eyebrow": "核心技術",
      "title": "指揮決策與資訊視覺化",
      "lead": "讓複雜的任務資訊，更容易被理解、討論與運用",
      "intro": [
        "在需要掌握場域、任務配置或多項資訊的訓練情境中，如何呈現資訊，往往會影響使用者對情境的理解。",
        "地圖、圖台、三維場景與視覺化介面，可以將部分抽象資訊轉換為較容易觀察與討論的形式。",
        "BXR 運用數位圖台與模擬環境等技術，支援特定任務情境的資訊呈現、部署討論及決策演練，協助使用者以不同視角理解模擬內容。"
      ],
      "primaryCta": "探索相關產品",
      "secondaryCta": "洽詢資訊視覺化應用",
      "sections": [
        {
          "id": "concept",
          "title": "資訊視覺化的目的，是協助理解任務，而不是增加畫面複雜度",
          "paragraphs": [
            "專業訓練中的資訊可能涉及地形、空間、位置、任務配置或情境變化。",
            "若資訊只以文字或分散的資料呈現，使用者可能需要額外時間整理彼此的關係。",
            "透過適當的地圖、圖台與視覺化設計，可以將相關資訊依照任務目的組織與呈現，協助使用者掌握情境。"
          ],
          "items": [
            {
              "title": "地圖與空間呈現",
              "paragraphs": [
                "運用二維或三維方式呈現地形、場域及相關空間資訊。"
              ]
            },
            {
              "title": "任務資訊組織",
              "paragraphs": [
                "依使用需求安排資訊的分類、層次與顯示方式。"
              ]
            },
            {
              "title": "情境視覺化",
              "paragraphs": [
                "透過數位介面呈現適合模擬的任務配置或情境內容。"
              ]
            },
            {
              "title": "互動操作",
              "paragraphs": [
                "依系統設計提供適當的資訊查看、操作或討論方式。"
              ]
            }
          ]
        },
        {
          "id": "decision-exercises",
          "title": "從資訊呈現，到情境理解與決策討論",
          "paragraphs": [
            "在特定訓練應用中，圖台與數位視覺化介面可以作為任務討論、情境推演或操作練習的輔助工具。",
            "使用者可依系統提供的資訊，觀察任務條件、討論可能的配置方式，並在模擬情境中理解不同因素之間的關係。",
            "不過，資訊視覺化不等於自動決策，也不代表系統具備真實作戰指揮或即時戰場管理能力。",
            "BXR 重視的是讓視覺化工具符合訓練目的，支援特定情境中的理解、討論與演練。"
          ]
        },
        {
          "id": "wargaming-tables",
          "title": "以兵棋圖台呈現任務情境與空間關係",
          "paragraphs": [
            "兵棋圖台是資訊視覺化與模擬訓練結合的應用之一。",
            "透過數位地圖、三維場景及適當的互動介面，可以協助使用者觀察任務環境、理解空間配置，並進行特定情境的討論與推演。",
            "BXR 的兵棋圖台系統為相關應用提供具體的產品形式。",
            "實際圖台操作、資料呈現與訓練功能，應以既有正式產品資料為準，不得自行增加未確認的即時資料整合、戰場監控或自動指揮能力。"
          ]
        },
        {
          "id": "value",
          "title": "把資訊整理成更容易理解的任務畫面",
          "paragraphs": [
            "資訊視覺化的價值，不在於呈現越多資料越好，而是讓適當的資訊以符合任務需求的方式被理解。",
            "透過地圖、圖台與模擬視覺化介面，可以支援特定訓練情境中的空間理解、資訊討論與任務推演。",
            "主要價值："
          ],
          "bullets": [
            "協助呈現地形、場域與任務配置。",
            "將部分抽象資訊轉換為視覺化內容。",
            "支援特定情境的討論與推演。",
            "配合模擬環境呈現相關空間資訊。",
            "依訓練需求安排資訊顯示方式。"
          ]
        }
      ],
      "relatedTitle": "讓圖台與視覺化工具支援模擬訓練",
      "faq": [
        {
          "question": "什麼是指揮決策與資訊視覺化？",
          "answer": "指揮決策與資訊視覺化是將任務相關的空間、配置或情境資訊，以地圖、圖台或其他視覺介面呈現，協助使用者理解資訊並進行特定的討論或演練。"
        },
        {
          "question": "資訊視覺化系統會自動做出指揮決策嗎？",
          "answer": "不一定，而且資訊視覺化本身不代表自動決策。其主要作用是依系統設計呈現相關資訊，協助使用者觀察與理解情境。是否具備其他分析或決策功能，需依實際產品確認。"
        },
        {
          "question": "兵棋圖台與一般地圖有什麼不同？",
          "answer": "一般地圖主要用於呈現地理或空間資訊；兵棋圖台則可依訓練目的，結合任務情境、配置資訊及適當的互動方式，支援特定的討論與模擬推演。具體功能依產品設計而定。"
        },
        {
          "question": "兵棋圖台是否一定連接即時戰場資料？",
          "answer": "不一定。兵棋圖台可以使用依訓練目的建立的數位場景與模擬資料，不代表必然連接真實戰場或即時作戰系統。實際資料來源應依產品功能確認。"
        },
        {
          "question": "BXR 的兵棋圖台與 NOVA 是否已經全面整合？",
          "answer": "不能直接如此認定。兵棋圖台是獨立產品，NOVA 是軍事模擬下的跨系統整合子解決方案。兩者是否具備特定介接或整合功能，應以實際系統配置及已確認的專案能力為準。"
        }
      ],
      "closing": {
        "title": "讓任務資訊，成為更容易理解的訓練內容",
        "body": "從數位地圖、圖台到模擬情境，BXR 可依應用需求討論適合的資訊視覺化與訓練配置方式。",
        "cta": "洽詢資訊視覺化應用"
      },
      "seo": {
        "title": "指揮決策與資訊視覺化｜兵棋圖台與模擬推演",
        "description": "了解 BXR 如何運用數位地圖、兵棋圖台及三維資訊視覺化技術，支援任務情境理解、部署討論與專業模擬訓練中的決策演練。"
      }
    },
    "en": {
      "eyebrow": "Core Technology",
      "title": "Command & Decision Visualization",
      "lead": "Make complex mission information easier to understand, discuss, and use",
      "intro": [
        "In training scenarios that require an understanding of a site, mission deployment, or multiple sources of information, the way information is presented often affects how users understand the situation.",
        "Maps, tabletop systems, three-dimensional environments, and visualization interfaces can turn some abstract information into forms that are easier to observe and discuss.",
        "BXR uses technologies such as digital tabletop systems and simulated environments to support information presentation, deployment discussions, and decision-making exercises for particular mission scenarios, helping users understand simulated content from different perspectives."
      ],
      "primaryCta": "Explore related products",
      "secondaryCta": "Discuss information visualization applications",
      "sections": [
        {
          "id": "concept",
          "title": "Information visualization should help users understand the mission, rather than make displays more complex",
          "paragraphs": [
            "Information used in professional training may involve terrain, space, positions, mission deployment, or changes in a scenario.",
            "If information is presented only as text or scattered data, users may need additional time to organize the relationships between its elements.",
            "Appropriate maps, tabletop systems, and visualization design can organize and present relevant information according to mission objectives, helping users understand the situation."
          ],
          "items": [
            {
              "title": "Maps and spatial presentation",
              "paragraphs": [
                "Present terrain, sites, and relevant spatial information in two or three dimensions."
              ]
            },
            {
              "title": "Organizing mission information",
              "paragraphs": [
                "Arrange information categories, hierarchies, and display methods according to user needs."
              ]
            },
            {
              "title": "Scenario visualization",
              "paragraphs": [
                "Use digital interfaces to present mission deployments or scenario content suitable for simulation."
              ]
            },
            {
              "title": "Interactive operation",
              "paragraphs": [
                "Provide appropriate ways to view, interact with, or discuss information according to the system design."
              ]
            }
          ]
        },
        {
          "id": "decision-exercises",
          "title": "From presenting information to understanding scenarios and discussing decisions",
          "paragraphs": [
            "In particular training applications, tabletop systems and digital visualization interfaces can assist mission discussions, scenario exercises, or operational practice.",
            "Users can observe mission conditions, discuss possible deployments, and understand relationships between different factors in a simulated scenario based on the information provided by the system.",
            "However, information visualization does not mean automated decision-making, nor does it imply that a system can conduct real combat command or real-time battlefield management.",
            "BXR focuses on aligning visualization tools with training objectives to support understanding, discussion, and exercises in specific scenarios."
          ]
        },
        {
          "id": "wargaming-tables",
          "title": "Use wargaming tables to present mission scenarios and spatial relationships",
          "paragraphs": [
            "Wargaming tables are one application that combines information visualization with simulation training.",
            "Digital maps, three-dimensional environments, and appropriate interactive interfaces can help users observe the mission environment, understand spatial configurations, and discuss and explore particular scenarios.",
            "BXR’s Wargaming Table System provides a concrete product form for these applications.",
            "Actual tabletop operation, data presentation, and training functions should follow the existing official product information. Unconfirmed capabilities for real-time data integration, battlefield monitoring, or automated command must not be added."
          ]
        },
        {
          "id": "value",
          "title": "Organize information into a mission view that is easier to understand",
          "paragraphs": [
            "The value of information visualization lies not in presenting as much data as possible, but in making appropriate information understandable in a way that meets mission needs.",
            "Maps, tabletop systems, and simulation visualization interfaces can support spatial understanding, discussions of information, and mission exercises in specific training scenarios.",
            "Key benefits:"
          ],
          "bullets": [
            "Help present terrain, sites, and mission deployments.",
            "Turn some abstract information into visual content.",
            "Support discussion and exercises for particular scenarios.",
            "Present relevant spatial information alongside simulated environments.",
            "Arrange information displays according to training requirements."
          ]
        }
      ],
      "relatedTitle": "Use tabletop and visualization tools to support simulation training",
      "faq": [
        {
          "question": "What is command and decision visualization?",
          "answer": "Command and decision visualization presents mission-related spatial, deployment, or scenario information through maps, tabletop systems, or other visual interfaces, helping users understand the information and conduct particular discussions or exercises."
        },
        {
          "question": "Do information visualization systems make command decisions automatically?",
          "answer": "Not necessarily, and information visualization itself does not mean automated decision-making. Its primary role is to present relevant information according to the system design, helping users observe and understand a situation. Any additional analysis or decision-making functions must be confirmed for the actual product."
        },
        {
          "question": "How does a wargaming table differ from a conventional map?",
          "answer": "A conventional map primarily presents geographic or spatial information. A wargaming table can combine mission scenarios, deployment information, and appropriate interaction methods according to training objectives, supporting particular discussions and simulation exercises. Specific functions depend on the product design."
        },
        {
          "question": "Does a wargaming table always connect to real-time battlefield data?",
          "answer": "Not necessarily. A wargaming table can use digital environments and simulated data created for training purposes. This does not mean it necessarily connects to a real battlefield or real-time operational systems. Actual data sources should be confirmed against product capabilities."
        },
        {
          "question": "Are BXR’s Wargaming Table System and NOVA already fully integrated?",
          "answer": "This cannot be assumed. The Wargaming Table System is a standalone product, while NOVA is a cross-system integration sub-solution within military simulation. Any specific interfaces or integration capabilities between them should be determined from the actual system configuration and confirmed project capabilities."
        }
      ],
      "closing": {
        "title": "Make mission information easier to understand as training content",
        "body": "From digital maps and tabletop systems to simulated scenarios, BXR can discuss appropriate information visualization approaches and training configurations according to application requirements.",
        "cta": "Discuss information visualization applications"
      },
      "seo": {
        "title": "Command & Decision Visualization｜Wargaming Simulation",
        "description": "Learn how BXR uses digital maps, wargaming tables, and three-dimensional information visualization to support understanding mission scenarios, deployment discussions, and decision-making exercises in professional simulation training."
      }
    },
    "jp": {
      "eyebrow": "コア技術",
      "title": "指揮・意思決定と情報の可視化",
      "lead": "複雑な任務情報を、理解し、議論し、活用しやすくする",
      "intro": [
        "場所、任務の配置、複数の情報を把握する必要がある訓練シナリオでは、情報の提示方法が、利用者による状況の理解に影響することがよくあります。",
        "地図、テーブル、三次元空間、可視化インターフェースは、抽象的な情報の一部を、観察や議論がしやすい形に変換できます。",
        "BXR はデジタルテーブルやシミュレーション環境などの技術を活用し、特定の任務シナリオにおける情報の提示、配置に関する議論、意思決定演習を支援します。利用者が異なる視点からシミュレーション内容を理解するために役立てます。"
      ],
      "primaryCta": "関連製品を見る",
      "secondaryCta": "情報可視化の活用について相談する",
      "sections": [
        {
          "id": "concept",
          "title": "情報可視化の目的は、画面を複雑にすることではなく、任務の理解を支えることです",
          "paragraphs": [
            "専門訓練で扱う情報には、地形、空間、位置、任務の配置、シナリオの変化などが含まれる場合があります。",
            "情報が文章だけ、あるいは分散したデータとして提示されると、利用者はその相互関係を整理するために追加の時間を必要とする場合があります。",
            "適切な地図、テーブル、可視化設計を通じて、関連情報を任務の目的に沿って整理・提示することで、利用者による状況の把握を支援できます。"
          ],
          "items": [
            {
              "title": "地図と空間の提示",
              "paragraphs": [
                "二次元または三次元で、地形、場所、関連する空間情報を提示します。"
              ]
            },
            {
              "title": "任務情報の整理",
              "paragraphs": [
                "利用上の要件に応じて、情報の分類、階層、表示方法を整えます。"
              ]
            },
            {
              "title": "シナリオの可視化",
              "paragraphs": [
                "デジタルインターフェースを通じて、シミュレーションに適した任務の配置やシナリオ内容を提示します。"
              ]
            },
            {
              "title": "インタラクティブな操作",
              "paragraphs": [
                "システム設計に応じて、情報の確認、操作、議論に適した方法を提供します。"
              ]
            }
          ]
        },
        {
          "id": "decision-exercises",
          "title": "情報の提示から、状況の理解と意思決定の議論へ",
          "paragraphs": [
            "特定の訓練用途では、テーブルやデジタル可視化インターフェースを、任務に関する議論、シナリオ演習、操作練習の補助ツールとして活用できます。",
            "利用者はシステムが提示する情報に基づいて任務条件を観察し、考えられる配置方法を議論し、シミュレーション内でさまざまな要素の関係を理解できます。",
            "ただし、情報可視化は自動的な意思決定と同義ではなく、実際の戦闘指揮やリアルタイムの戦場管理能力がシステムに備わっていることも意味しません。",
            "BXR は、可視化ツールを訓練目的に適合させ、特定のシナリオにおける理解、議論、演習を支援することを重視しています。"
          ]
        },
        {
          "id": "wargaming-tables",
          "title": "兵棋演習テーブルで、任務シナリオと空間の関係を提示する",
          "paragraphs": [
            "兵棋演習テーブルは、情報可視化とシミュレーション訓練を組み合わせた活用の一つです。",
            "デジタル地図、三次元空間、適切なインタラクティブ・インターフェースにより、利用者による任務環境の観察、空間配置の理解、特定のシナリオに関する議論と演習を支援できます。",
            "BXR の兵棋演習テーブルシステムは、こうした活用のための具体的な製品形態です。",
            "実際のテーブル操作、データの提示、訓練機能は、既存の正式な製品資料に従う必要があります。未確認のリアルタイム・データ統合、戦場監視、自動指揮能力を独自に追加してはなりません。"
          ]
        },
        {
          "id": "value",
          "title": "情報を、理解しやすい任務の画面へ整理する",
          "paragraphs": [
            "情報可視化の価値は、できるだけ多くのデータを表示することではなく、適切な情報を任務の要件に合った方法で理解できるようにすることにあります。",
            "地図、テーブル、シミュレーションの可視化インターフェースにより、特定の訓練シナリオでの空間理解、情報に関する議論、任務演習を支援できます。",
            "主な価値："
          ],
          "bullets": [
            "地形、場所、任務の配置の提示を支援します。",
            "抽象的な情報の一部を可視化された内容に変換します。",
            "特定のシナリオに関する議論と演習を支援します。",
            "シミュレーション環境と組み合わせて、関連する空間情報を提示します。",
            "訓練要件に応じて情報の表示方法を整えます。"
          ]
        }
      ],
      "relatedTitle": "テーブルと可視化ツールを、シミュレーション訓練に役立てる",
      "faq": [
        {
          "question": "指揮・意思決定と情報の可視化とは何ですか？",
          "answer": "指揮・意思決定と情報の可視化とは、任務に関わる空間、配置、シナリオの情報を、地図、テーブル、その他の視覚的なインターフェースで提示し、利用者の情報理解と特定の議論や演習を支援することです。"
        },
        {
          "question": "情報可視化システムは、自動的に指揮上の意思決定を行いますか？",
          "answer": "必ずしもそうではなく、情報可視化そのものが自動的な意思決定を意味するわけでもありません。主な役割は、システム設計に応じて関連情報を提示し、利用者による状況の観察と理解を支援することです。追加の分析機能や意思決定機能の有無は、実際の製品に基づいて確認する必要があります。"
        },
        {
          "question": "兵棋演習テーブルと一般的な地図は、どのように違いますか？",
          "answer": "一般的な地図は、主に地理情報や空間情報を提示するためのものです。一方、兵棋演習テーブルは訓練目的に応じて任務シナリオ、配置情報、適切なインタラクションを組み合わせ、特定の議論やシミュレーション演習を支援できます。具体的な機能は製品設計によって異なります。"
        },
        {
          "question": "兵棋演習テーブルは、必ずリアルタイムの戦場データに接続しますか？",
          "answer": "必ずしも接続しません。兵棋演習テーブルは、訓練目的に合わせて構築したデジタル空間やシミュレーションデータを使用できます。実際の戦場やリアルタイムの作戦システムに必ず接続することを意味するものではありません。実際のデータソースは、製品機能に基づいて確認する必要があります。"
        },
        {
          "question": "BXR の兵棋演習テーブルシステムと NOVA は、すでに全面的に統合されていますか？",
          "answer": "そのように直接判断することはできません。兵棋演習テーブルは独立した製品であり、NOVA は軍事シミュレーション分野におけるシステム間統合のサブソリューションです。特定の接続機能や統合機能の有無は、実際のシステム構成と確認済みのプロジェクト能力に基づいて判断する必要があります。"
        }
      ],
      "closing": {
        "title": "任務情報を、理解しやすい訓練内容へ",
        "body": "デジタル地図、テーブル、シミュレーションシナリオまで、BXR は活用要件に応じて、適切な情報可視化と訓練構成の方法についてご相談に応じます。",
        "cta": "情報可視化の活用について相談する"
      },
      "seo": {
        "title": "指揮・意思決定の可視化｜兵棋演習・模擬推演",
        "description": "BXR がデジタル地図、兵棋演習テーブル、三次元の情報可視化技術を活用し、任務シナリオの理解、配置に関する議論、専門的なシミュレーション訓練の意思決定演習を支援する方法をご紹介します。"
      }
    }
  }
} satisfies Record<'system-integration' | 'decision-visualization', Record<'tw' | 'en' | 'jp', TechnologyPageContent>>;
