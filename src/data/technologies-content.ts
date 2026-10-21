import { batchTwoA } from "./technologies-batch-two-a.ts";
import { batchTwoB } from "./technologies-batch-two-b.ts";
/**
 * Traditional Chinese is the content master supplied for the core technologies launch.
 * English and Japanese preserve its section, paragraph, item and FAQ structure.
 * Japanese is translated directly from Traditional Chinese, not via English.
 * Product capabilities remain in the existing product collection; no claims are added here.
 */
export interface TechnologySection {
  id: string;
  title: string;
  paragraphs: string[];
  items?: { title: string; paragraphs: string[] }[];
  bullets?: string[];
  note?: string;
}
export interface TechnologyPageContent {
  eyebrow: string;
  title: string;
  lead: string;
  intro: string[];
  primaryCta: string;
  secondaryCta: string;
  sections: TechnologySection[];
  relatedTitle: string;
  faq: { question: string; answer: string }[];
  closing: { title: string; body: string; cta: string };
  seo: { title: string; description: string };
}
export interface TechnologyOverviewContent {
  eyebrow: string;
  title: string;
  lead: string;
  intro: string[];
  technologies: Record<string, { title: string; description: string }>;
  seo: { title: string; description: string };
}

const firstBatchContent: Record<"xr" | "training-design" | "domain-expertise", Record<"tw" | "en" | "jp", TechnologyPageContent>> = {
  "xr": {
    "tw": {
      "eyebrow": "EXTENDED REALITY",
      "title": "XR 延展實境技術",
      "lead": "讓訓練不再受限於實際場地與單一情境",
      "intro": [
        "在軍事、警勤與消防防災等專業領域，許多訓練情境受到場地、安全、設備及執行條件限制，難以隨時安排或重複演練。",
        "XR 延展實境技術提供另一種訓練方式：透過虛擬環境與互動操作，讓受訓者在可控制的模擬情境中熟悉任務流程、練習操作並進行應變判斷。",
        "BXR 運用 XR 技術開發不同形式的模擬訓練系統，讓虛擬情境成為專業訓練的延伸工具。"
      ],
      "primaryCta": "探索 XR 模擬訓練產品",
      "secondaryCta": "洽詢應用需求",
      "sections": [
        {
          "id": "concept",
          "title": "XR 不只是一副頭戴式顯示器",
          "paragraphs": [
            "XR（Extended Reality，延展實境）是涵蓋虛擬實境 VR、擴增實境 AR 與混合實境 MR 的技術概念。",
            "不同形式的 XR，能依照訓練目標提供不同程度的沉浸感、真實環境資訊與互動方式。"
          ],
          "items": [
            {
              "title": "VR 虛擬實境",
              "paragraphs": [
                "透過頭戴式顯示設備呈現虛擬環境，讓使用者進入模擬情境，進行操作、觀察及任務練習。"
              ]
            },
            {
              "title": "AR 擴增實境",
              "paragraphs": [
                "在真實環境視野中疊加數位資訊或互動內容，協助使用者在現實場域中取得額外的視覺提示與情境資訊。"
              ]
            },
            {
              "title": "MR 混合實境",
              "paragraphs": [
                "結合真實環境與數位內容，讓虛擬物件與實體空間形成更緊密的互動關係，應用方式依設備與系統設計而定。"
              ]
            }
          ]
        },
        {
          "id": "applications",
          "title": "從觀察情境，到實際參與訓練",
          "paragraphs": [
            "XR 模擬訓練不只是觀看三維畫面，而是讓受訓者透過互動參與任務。",
            "依照不同產品與訓練需求，系統可以運用虛擬場景、操作設備及互動事件，建立適合特定訓練目標的模擬流程。"
          ],
          "items": [
            {
              "title": "任務情境模擬",
              "paragraphs": [
                "呈現不同場域與任務條件，協助受訓者熟悉特定情境。"
              ]
            },
            {
              "title": "操作流程練習",
              "paragraphs": [
                "透過虛擬互動與適當的操作設備，練習訓練所需的程序。"
              ]
            },
            {
              "title": "應變判斷訓練",
              "paragraphs": [
                "透過模擬事件與情境變化，提供練習觀察、選擇與判斷的機會。"
              ]
            },
            {
              "title": "重複演練",
              "paragraphs": [
                "在可控制的條件下重新執行訓練流程，協助建立熟悉度。"
              ]
            }
          ]
        },
        {
          "id": "value",
          "title": "讓專業訓練擁有更多可運用的情境",
          "paragraphs": [
            "實體訓練與模擬訓練各有其價值。XR 並非要取代所有實體演練，而是補充傳統訓練難以頻繁執行的部分。",
            "透過適當的系統設計，XR 可協助訓練單位增加情境練習機會、調整訓練條件，並讓受訓者在實際任務前熟悉部分操作與流程。"
          ],
          "bullets": [
            "補充受場地與條件限制的訓練情境。",
            "支援可重複的操作與任務練習。",
            "依需求設計不同的互動形式。",
            "將虛擬情境與實體操作結合。",
            "作為既有專業訓練體系的輔助工具。"
          ]
        }
      ],
      "relatedTitle": "XR 技術如何應用於 BXR 產品",
      "faq": [
        {
          "question": "XR、VR、AR、MR 有什麼不同？",
          "answer": "XR 是涵蓋 VR、AR 與 MR 的延展實境概念。VR 主要提供虛擬環境體驗；AR 將數位資訊疊加在真實環境中；MR 則進一步結合虛擬內容與實體空間的互動。實際使用哪一種技術，取決於訓練目標、設備與應用需求。"
        },
        {
          "question": "XR 模擬訓練可以完全取代實體訓練嗎？",
          "answer": "不能一概而論。XR 模擬訓練適合作為實體訓練的補充，提供可控制、可重複的情境練習。涉及真實設備操作、體能、環境感受及現場安全規範的訓練，仍應依專業要求進行實體演練。"
        },
        {
          "question": "XR 模擬訓練是否一定需要 VR 頭盔？",
          "answer": "不一定。XR 包含不同技術形式，系統可能採用 VR 頭戴式設備、AR 顯示裝置或其他互動配置。實際設備應依產品設計與訓練需求確認。"
        },
        {
          "question": "XR 技術適用於哪些專業訓練領域？",
          "answer": "XR 可依應用需求運用於軍事、警勤、消防防災及其他專業教育訓練。不同領域的任務目標、操作程序及設備條件不同，因此需要分別設計模擬情境與互動方式。"
        },
        {
          "question": "BXR 的 XR 訓練系統是否都可以互相連線整合？",
          "answer": "不一定。不同產品具有各自的系統架構與訓練目的，是否能交換資訊或共同運作，需要依實際產品功能、介接條件及專案配置評估，不應視為所有系統的標準功能。"
        }
      ],
      "closing": {
        "title": "讓 XR 技術回應實際訓練需求",
        "body": "從訓練目標、應用情境到設備配置，BXR 可依不同需求討論適合的 XR 模擬訓練應用方式。",
        "cta": "洽詢 XR 訓練應用"
      },
      "seo": {
        "title": "XR 延展實境技術｜VR、AR、MR 專業模擬訓練｜BXR",
        "description": "了解 BXR 如何運用 XR 延展實境、VR、AR 與 MR 技術，建立軍事、警勤及消防防災領域的互動式模擬訓練情境，支援操作練習與任務應變。"
      }
    },
    "en": {
      "eyebrow": "EXTENDED REALITY",
      "title": "Extended Reality (XR) Technology",
      "lead": "Expand training beyond the limits of physical locations and individual scenarios",
      "intro": [
        "In professional fields such as military, police, and fire and disaster response, many training scenarios are constrained by location, safety, equipment, and operating conditions, making them difficult to arrange on demand or repeat.",
        "Extended reality (XR) offers another approach to training: virtual environments and interactive operations allow trainees to become familiar with mission workflows, practise procedures, and exercise response judgement in controlled simulated scenarios.",
        "BXR uses XR technology to develop different forms of simulation training systems, making virtual scenarios an extension of professional training."
      ],
      "primaryCta": "Explore XR simulation training products",
      "secondaryCta": "Discuss your application requirements",
      "sections": [
        {
          "id": "concept",
          "title": "XR is more than a head-mounted display",
          "paragraphs": [
            "XR (Extended Reality) is an umbrella concept encompassing virtual reality (VR), augmented reality (AR), and mixed reality (MR).",
            "Different forms of XR can provide different degrees of immersion, information about the real environment, and modes of interaction according to the training objectives."
          ],
          "items": [
            {
              "title": "VR — Virtual reality",
              "paragraphs": [
                "Head-mounted displays present a virtual environment, placing users inside a simulated scenario where they can operate, observe, and practise tasks."
              ]
            },
            {
              "title": "AR — Augmented reality",
              "paragraphs": [
                "Digital information or interactive content is overlaid on a view of the real environment, providing users with additional visual cues and contextual information in physical settings."
              ]
            },
            {
              "title": "MR — Mixed reality",
              "paragraphs": [
                "Real environments and digital content are combined to create closer interaction between virtual objects and physical space. The way this is applied depends on the equipment and system design."
              ]
            }
          ]
        },
        {
          "id": "applications",
          "title": "From observing scenarios to actively participating in training",
          "paragraphs": [
            "XR simulation training goes beyond viewing three-dimensional imagery: it enables trainees to participate in tasks through interaction.",
            "Depending on the product and training requirements, systems can use virtual scenes, operating equipment, and interactive events to create simulation workflows suited to specific training objectives."
          ],
          "items": [
            {
              "title": "Mission scenario simulation",
              "paragraphs": [
                "Present different settings and mission conditions to help trainees become familiar with particular scenarios."
              ]
            },
            {
              "title": "Operational procedure practice",
              "paragraphs": [
                "Use virtual interaction and suitable operating equipment to practise the procedures required for training."
              ]
            },
            {
              "title": "Response judgement training",
              "paragraphs": [
                "Use simulated events and changes in scenarios to provide opportunities to practise observation, selection, and judgement."
              ]
            },
            {
              "title": "Repeated practice",
              "paragraphs": [
                "Repeat training workflows under controlled conditions to help build familiarity."
              ]
            }
          ]
        },
        {
          "id": "value",
          "title": "Give professional training a broader range of usable scenarios",
          "paragraphs": [
            "Physical training and simulation training each have their own value. XR is intended to supplement aspects of traditional training that are difficult to conduct frequently, rather than replace all physical exercises.",
            "With appropriate system design, XR can help training organisations increase opportunities for scenario practice, adjust training conditions, and familiarise trainees with selected operations and procedures before actual missions."
          ],
          "bullets": [
            "Supplement training scenarios constrained by location and operating conditions.",
            "Support repeatable operational and mission practice.",
            "Design different forms of interaction to meet requirements.",
            "Combine virtual scenarios with physical operation.",
            "Serve as a supporting tool within existing professional training programmes."
          ]
        }
      ],
      "relatedTitle": "How BXR products apply XR technology",
      "faq": [
        {
          "question": "What is the difference between XR, VR, AR, and MR?",
          "answer": "XR is the extended reality concept that encompasses VR, AR, and MR. VR primarily provides experiences in virtual environments; AR overlays digital information on the real environment; MR further combines virtual content with interaction in physical space. The choice of technology depends on the training objectives, equipment, and application requirements."
        },
        {
          "question": "Can XR simulation training completely replace physical training?",
          "answer": "There is no universal answer. XR simulation training is suited to supplementing physical training with controlled, repeatable scenario practice. Training involving real equipment operation, physical fitness, environmental experience, and on-site safety procedures should still include physical exercises in accordance with professional requirements."
        },
        {
          "question": "Does XR simulation training always require a VR headset?",
          "answer": "No. XR includes different forms of technology, and systems may use VR headsets, AR displays, or other interactive configurations. The actual equipment should be confirmed according to the product design and training requirements."
        },
        {
          "question": "Which professional training fields can use XR technology?",
          "answer": "Depending on application requirements, XR can be used in military, police, fire and disaster response, and other professional education and training. Mission objectives, operating procedures, and equipment conditions differ across fields, so simulated scenarios and modes of interaction need to be designed separately."
        },
        {
          "question": "Can all BXR XR training systems connect and integrate with one another?",
          "answer": "Not necessarily. Different products have their own system architectures and training purposes. Whether they can exchange information or operate together must be evaluated against actual product functions, interface requirements, and project configurations; it should not be assumed to be a standard feature of every system."
        }
      ],
      "closing": {
        "title": "Apply XR technology to real training requirements",
        "body": "From training objectives and application scenarios to equipment configurations, BXR can discuss suitable approaches to XR simulation training for different requirements.",
        "cta": "Discuss XR training applications"
      },
      "seo": {
        "title": "Extended Reality (XR) Technology | VR, AR & MR for Professional Simulation Training | BXR",
        "description": "Discover how BXR uses XR, VR, AR, and MR to create interactive simulation training scenarios for military, police, and fire and disaster response, supporting operational practice and mission response."
      }
    },
    "jp": {
      "eyebrow": "EXTENDED REALITY",
      "title": "XR（エクステンデッド・リアリティ）技術",
      "lead": "実際の場所や一つのシナリオに縛られない訓練へ",
      "intro": [
        "軍事、警察業務、消防・防災などの専門分野では、多くの訓練シナリオが場所、安全性、設備、実施条件の制約を受け、必要なときに実施したり、繰り返し訓練したりすることが困難です。",
        "XR（エクステンデッド・リアリティ）技術は、訓練に別の方法を提供します。仮想環境とインタラクティブな操作を通じて、訓練生は制御可能な模擬シナリオの中で任務の流れを把握し、操作を練習し、状況に応じた対応判断を行えます。",
        "BXR は XR 技術を活用してさまざまな形式のシミュレーション訓練システムを開発し、仮想シナリオを専門訓練の可能性を広げるツールとして役立てています。"
      ],
      "primaryCta": "XR シミュレーション訓練製品を見る",
      "secondaryCta": "活用要件について相談する",
      "sections": [
        {
          "id": "concept",
          "title": "XR はヘッドマウントディスプレイだけではありません",
          "paragraphs": [
            "XR（Extended Reality、エクステンデッド・リアリティ）は、VR（仮想現実）、AR（拡張現実）、MR（複合現実）を包含する技術概念です。",
            "XR の形式によって、訓練目標に応じたさまざまな没入感、実環境の情報、インタラクションの方法を提供できます。"
          ],
          "items": [
            {
              "title": "VR — 仮想現実",
              "paragraphs": [
                "ヘッドマウントディスプレイで仮想環境を提示し、利用者が模擬シナリオに入り、操作、観察、任務の練習を行います。"
              ]
            },
            {
              "title": "AR — 拡張現実",
              "paragraphs": [
                "実環境の視野にデジタル情報やインタラクティブなコンテンツを重ね、現実の場所で追加の視覚的な手掛かりや状況情報を得られるようにします。"
              ]
            },
            {
              "title": "MR — 複合現実",
              "paragraphs": [
                "実環境とデジタルコンテンツを組み合わせ、仮想オブジェクトと物理空間の相互作用をより密接にします。活用方法は、機器とシステムの設計によって異なります。"
              ]
            }
          ]
        },
        {
          "id": "applications",
          "title": "状況を見るだけでなく、訓練に参加する",
          "paragraphs": [
            "XR シミュレーション訓練は、三次元映像を見るだけのものではなく、訓練生がインタラクションを通じて任務に参加するものです。",
            "製品や訓練要件に応じて、仮想シーン、操作機器、インタラクティブなイベントを用い、特定の訓練目標に適したシミュレーションの流れを構築できます。"
          ],
          "items": [
            {
              "title": "任務シナリオのシミュレーション",
              "paragraphs": [
                "さまざまな場所や任務条件を提示し、訓練生が特定の状況に慣れることを支援します。"
              ]
            },
            {
              "title": "操作手順の練習",
              "paragraphs": [
                "仮想空間でのインタラクションと適切な操作機器を通じて、訓練に必要な手順を練習します。"
              ]
            },
            {
              "title": "対応判断の訓練",
              "paragraphs": [
                "模擬イベントや状況の変化を通じて、観察、選択、判断を練習する機会を提供します。"
              ]
            },
            {
              "title": "反復訓練",
              "paragraphs": [
                "制御可能な条件の下で訓練の流れを繰り返し実施し、習熟を支援します。"
              ]
            }
          ]
        },
        {
          "id": "value",
          "title": "専門訓練で活用できるシナリオを広げる",
          "paragraphs": [
            "実地訓練とシミュレーション訓練には、それぞれの価値があります。XR はすべての実地演習を置き換えるものではなく、従来の訓練では頻繁に実施しにくい部分を補うものです。",
            "適切なシステム設計により、XR は訓練組織における状況別練習の機会を増やし、訓練条件の調整を支援し、実際の任務に先立って訓練生が一部の操作や手順に慣れるために役立ちます。"
          ],
          "bullets": [
            "場所や条件に制約のある訓練シナリオを補完する。",
            "繰り返し実施できる操作・任務練習を支援する。",
            "要件に応じて異なるインタラクションの形式を設計する。",
            "仮想シナリオと物理的な操作を組み合わせる。",
            "既存の専門訓練体系を支援するツールとして活用する。"
          ]
        }
      ],
      "relatedTitle": "BXR 製品における XR 技術の活用",
      "faq": [
        {
          "question": "XR、VR、AR、MR はどのように違いますか？",
          "answer": "XR は VR、AR、MR を包含するエクステンデッド・リアリティの概念です。VR は主に仮想環境での体験を提供し、AR は実環境にデジタル情報を重ねます。MR はさらに、仮想コンテンツと物理空間のインタラクションを組み合わせます。実際にどの技術を使用するかは、訓練目標、機器、活用要件によって決まります。"
        },
        {
          "question": "XR シミュレーション訓練で実地訓練を完全に置き換えられますか？",
          "answer": "一概には言えません。XR シミュレーション訓練は、制御可能で繰り返し実施できる状況別練習を提供し、実地訓練を補完する方法に適しています。実機の操作、体力、環境の体感、現場の安全規定に関わる訓練では、引き続き専門的な要件に従って実地演習を行う必要があります。"
        },
        {
          "question": "XR シミュレーション訓練には必ず VR ヘッドセットが必要ですか？",
          "answer": "必ずしも必要ではありません。XR には異なる技術形式が含まれ、システムには VR ヘッドセット、AR 表示装置、その他のインタラクティブな構成が採用される場合があります。実際の機器は、製品設計と訓練要件に応じて確認する必要があります。"
        },
        {
          "question": "XR 技術はどのような専門訓練分野に適していますか？",
          "answer": "XR は活用要件に応じて、軍事、警察業務、消防・防災、その他の専門教育・訓練に利用できます。分野ごとに任務目標、操作手順、設備条件が異なるため、模擬シナリオやインタラクションの方法をそれぞれ設計する必要があります。"
        },
        {
          "question": "BXR の XR 訓練システムはすべて相互接続・統合できますか？",
          "answer": "必ずしもできるわけではありません。製品ごとにシステム構成と訓練目的が異なります。情報交換や共同運用の可否は、実際の製品機能、接続条件、プロジェクト構成に応じて評価する必要があり、すべてのシステムの標準機能と考えるべきではありません。"
        }
      ],
      "closing": {
        "title": "XR 技術を実際の訓練要件に応えるものへ",
        "body": "訓練目標、活用シナリオ、機器構成に至るまで、BXR はさまざまな要件に応じて適切な XR シミュレーション訓練の活用方法を検討します。",
        "cta": "XR 訓練の活用について相談する"
      },
      "seo": {
        "title": "XR（エクステンデッド・リアリティ）技術｜VR・AR・MR による専門シミュレーション訓練｜BXR",
        "description": "BXR が XR（エクステンデッド・リアリティ）、VR、AR、MR 技術を活用し、軍事、警察業務、消防・防災分野で操作練習と任務への対応を支援する、インタラクティブなシミュレーション訓練シナリオを構築する方法をご紹介します。"
      }
    }
  },
  "training-design": {
    "tw": {
      "eyebrow": "SIMULATION-BASED TRAINING DESIGN",
      "title": "模擬訓練設計",
      "lead": "好的模擬訓練，不是讓畫面更像遊戲，而是讓每一次操作都有訓練目的",
      "intro": [
        "專業訓練系統的價值，不只取決於畫面是否逼真，更取決於模擬內容能否對應實際訓練目標。",
        "從任務情境、操作流程到互動事件，模擬訓練需要將專業需求轉換為可理解、可操作且能反覆練習的訓練內容。",
        "BXR 結合 XR 技術、情境設計與嚴肅遊戲理念，讓數位互動成為專業訓練的工具，而不是單純的娛樂體驗。"
      ],
      "primaryCta": "探索模擬訓練產品",
      "secondaryCta": "洽詢訓練設計需求",
      "sections": [
        {
          "id": "concept",
          "title": "先定義訓練目標，再設計模擬情境",
          "paragraphs": [
            "不同專業單位的訓練需求並不相同。即使使用相似的 XR 設備，軍事戰術、警勤應變與消防操作所需要的互動方式、任務流程及情境條件也可能完全不同。",
            "因此，模擬訓練設計應從訓練目的出發，思考受訓者需要熟悉哪些操作、面對哪些情境，以及如何透過模擬方式進行練習。"
          ],
          "items": [
            {
              "title": "訓練目標",
              "paragraphs": [
                "確認訓練希望建立的操作熟悉度、情境認知或應變能力。"
              ]
            },
            {
              "title": "情境與任務",
              "paragraphs": [
                "依訓練目的規劃場域、事件及任務條件。"
              ]
            },
            {
              "title": "互動與操作",
              "paragraphs": [
                "設計受訓者在情境中需要執行的動作、選擇與程序。"
              ]
            },
            {
              "title": "重複練習",
              "paragraphs": [
                "讓適合模擬的流程可以在可控制條件下反覆執行。"
              ]
            }
          ]
        },
        {
          "id": "serious-games",
          "title": "嚴肅遊戲：以訓練為目的的互動設計",
          "paragraphs": [
            "嚴肅遊戲（Serious Games）是將遊戲設計方法與教育、訓練或其他明確目的結合的應用概念。",
            "它不等於將專業訓練娛樂化，而是運用互動、任務、回饋與情境參與等設計方式，讓使用者在過程中主動操作與思考。",
            "在專業模擬訓練中，嚴肅遊戲的設計理念可用於建立任務參與感、安排互動流程，並讓受訓者透過反覆練習熟悉特定程序與情境。",
            "BXR 重視的是這些互動機制是否服務於訓練目標，而不是遊戲畫面的娛樂效果。"
          ]
        },
        {
          "id": "process",
          "title": "把訓練需求轉換成可以操作的模擬內容",
          "paragraphs": [
            "模擬訓練的設計過程，需要將專業單位的需求轉換為具體的系統規劃。",
            "依照專案範圍與實際需求，設計工作可涵蓋："
          ],
          "note": "以上為設計方法說明，不代表每個產品或專案都採用完全相同的開發程序。",
          "items": [
            {
              "title": "01｜理解需求",
              "paragraphs": [
                "釐清訓練對象、訓練目的、使用環境及操作條件。"
              ]
            },
            {
              "title": "02｜規劃情境",
              "paragraphs": [
                "整理適合模擬的任務流程、場域及事件。"
              ]
            },
            {
              "title": "03｜設計互動",
              "paragraphs": [
                "規劃操作方式、情境變化及必要的使用提示。"
              ]
            },
            {
              "title": "04｜建立系統",
              "paragraphs": [
                "結合虛擬內容、操作設備與系統功能，形成可使用的模擬訓練環境。"
              ]
            },
            {
              "title": "05｜檢視與調整",
              "paragraphs": [
                "依專案測試及使用回饋，調整適用的操作流程與內容呈現。"
              ]
            }
          ]
        },
        {
          "id": "value",
          "title": "讓技術表現轉化為訓練應用價值",
          "paragraphs": [
            "一套專業模擬訓練系統，應讓受訓者知道自己需要完成什麼任務、如何參與情境，以及哪些操作與判斷是練習的重點。",
            "當情境設計與訓練目標相互對應，模擬系統才能更有效地支援專業訓練的安排。"
          ],
          "bullets": [
            "讓訓練目標與互動內容建立明確關係。",
            "將部分難以頻繁安排的情境轉化為模擬練習。",
            "協助受訓者熟悉特定操作與任務流程。",
            "支援不同訓練情境的規劃與調整。",
            "作為實體訓練與專業教學的輔助方式。"
          ]
        }
      ],
      "relatedTitle": "從不同產品看模擬訓練設計的應用",
      "faq": [
        {
          "question": "什麼是模擬訓練設計？",
          "answer": "模擬訓練設計是依據訓練目標，規劃適合的情境、操作流程、互動方式與系統配置，讓受訓者能在模擬環境中練習特定任務。其重點是讓模擬內容對應訓練需求，而不只是製作逼真的虛擬畫面。"
        },
        {
          "question": "嚴肅遊戲與一般電子遊戲有什麼不同？",
          "answer": "一般電子遊戲通常以娛樂體驗為主要目的；嚴肅遊戲則將互動設計運用於教育、訓練或其他明確目標。兩者可能使用相似的技術與互動方式，但設計目的與內容評估重點不同。"
        },
        {
          "question": "模擬訓練是否一定要有分數或排行榜？",
          "answer": "不一定。模擬訓練可以依目標設計操作提示、任務結果或其他回饋方式，但不是每種訓練都需要分數、排名或競賽機制。是否採用這些功能，應依訓練需求與產品實際設計決定。"
        },
        {
          "question": "模擬訓練適合哪些任務？",
          "answer": "適合模擬的內容可能包括操作程序、情境辨識、任務流程及部分應變判斷練習。實際適用範圍需考量訓練目的、設備條件及專業安全要求，並非所有任務都適合完全以虛擬方式執行。"
        },
        {
          "question": "BXR 是否可以依不同單位的需求規劃模擬情境？",
          "answer": "BXR 可依產品功能與專案範圍，討論不同訓練目標所需要的情境與互動配置。實際可調整項目、開發範圍及導入方式，仍需依個別需求進行評估。"
        }
      ],
      "closing": {
        "title": "讓每一個模擬情境，都有清楚的訓練目的",
        "body": "從需求理解、情境規劃到互動設計，BXR 持續探索如何讓數位模擬更貼近專業訓練的實際使用方式。",
        "cta": "洽詢模擬訓練規劃"
      },
      "seo": {
        "title": "模擬訓練設計｜嚴肅遊戲與 XR 專業訓練應用｜BXR",
        "description": "了解 BXR 如何結合模擬訓練設計、嚴肅遊戲（Serious Games）與 XR 互動技術，將軍事、警勤及消防防災的訓練需求轉換為可操作、可重複練習的模擬情境。"
      }
    },
    "en": {
      "eyebrow": "SIMULATION-BASED TRAINING DESIGN",
      "title": "Simulation-Based Training Design",
      "lead": "Effective simulation training gives every action a training purpose, rather than simply making the visuals more game-like",
      "intro": [
        "The value of a professional training system depends not only on visual realism, but also on whether the simulation content addresses actual training objectives.",
        "From mission scenarios and operating procedures to interactive events, simulation training must translate professional requirements into content that is understandable, actionable, and suitable for repeated practice.",
        "BXR combines XR technology, scenario design, and serious games principles to make digital interaction a tool for professional training, rather than simply an entertainment experience."
      ],
      "primaryCta": "Explore simulation training products",
      "secondaryCta": "Discuss your training design requirements",
      "sections": [
        {
          "id": "concept",
          "title": "Define training objectives before designing simulated scenarios",
          "paragraphs": [
            "Training requirements vary between professional organisations. Even with similar XR equipment, military tactics, police response, and firefighting operations may require entirely different modes of interaction, mission workflows, and scenario conditions.",
            "Simulation-based training design should therefore begin with the training purpose: which operations trainees need to become familiar with, which scenarios they need to face, and how they can practise them through simulation."
          ],
          "items": [
            {
              "title": "Training objectives",
              "paragraphs": [
                "Identify the operational familiarity, situational awareness, or response capabilities that the training aims to develop."
              ]
            },
            {
              "title": "Scenarios and missions",
              "paragraphs": [
                "Plan settings, events, and mission conditions according to the training purpose."
              ]
            },
            {
              "title": "Interaction and operation",
              "paragraphs": [
                "Design the actions, choices, and procedures that trainees need to carry out within the scenario."
              ]
            },
            {
              "title": "Repeated practice",
              "paragraphs": [
                "Enable workflows suited to simulation to be repeated under controlled conditions."
              ]
            }
          ]
        },
        {
          "id": "serious-games",
          "title": "Serious games: interaction designed for training",
          "paragraphs": [
            "Serious games is an application concept that combines game design methods with education, training, or other clearly defined purposes.",
            "It does not mean turning professional training into entertainment. Instead, it uses design approaches such as interaction, missions, feedback, and participation in scenarios to encourage users to act and think actively throughout the process.",
            "In professional simulation training, serious games principles can be used to build engagement with missions, structure interactive workflows, and help trainees become familiar with specific procedures and scenarios through repeated practice.",
            "BXR focuses on whether these interactive mechanisms serve the training objectives, rather than on the entertainment effect of game visuals."
          ]
        },
        {
          "id": "process",
          "title": "Translate training requirements into actionable simulation content",
          "paragraphs": [
            "The design of simulation training requires professional organisations’ needs to be translated into concrete system plans.",
            "Depending on the project scope and actual requirements, design work may include:"
          ],
          "items": [
            {
              "title": "01 | Understand requirements",
              "paragraphs": [
                "Clarify who will be trained, the training purpose, the operating environment, and operational conditions."
              ]
            },
            {
              "title": "02 | Plan scenarios",
              "paragraphs": [
                "Organise mission workflows, settings, and events suited to simulation."
              ]
            },
            {
              "title": "03 | Design interaction",
              "paragraphs": [
                "Plan operating methods, scenario changes, and any necessary user guidance."
              ]
            },
            {
              "title": "04 | Build the system",
              "paragraphs": [
                "Combine virtual content, operating equipment, and system functions to form a usable simulation training environment."
              ]
            },
            {
              "title": "05 | Review and refine",
              "paragraphs": [
                "Adjust the relevant operating procedures and presentation of content based on project testing and user feedback."
              ]
            }
          ],
          "note": "This describes a design approach; it does not mean that every product or project follows exactly the same development process."
        },
        {
          "id": "value",
          "title": "Turn technical performance into practical training value",
          "paragraphs": [
            "A professional simulation training system should help trainees understand which tasks they need to complete, how to participate in the scenario, and which operations and judgements are the focus of practice.",
            "When scenario design aligns with training objectives, simulation systems can more effectively support the organisation of professional training."
          ],
          "bullets": [
            "Establish a clear relationship between training objectives and interactive content.",
            "Turn selected scenarios that are difficult to arrange frequently into simulation exercises.",
            "Help trainees become familiar with specific operations and mission workflows.",
            "Support the planning and adjustment of different training scenarios.",
            "Provide a supporting approach for physical training and professional instruction."
          ]
        }
      ],
      "relatedTitle": "Simulation-based training design in different products",
      "faq": [
        {
          "question": "What is simulation-based training design?",
          "answer": "Simulation-based training design plans suitable scenarios, operating procedures, modes of interaction, and system configurations according to training objectives, enabling trainees to practise specific tasks in a simulated environment. Its focus is on aligning simulation content with training requirements, rather than simply creating realistic virtual imagery."
        },
        {
          "question": "How do serious games differ from conventional video games?",
          "answer": "Conventional video games usually focus primarily on entertainment, while serious games apply interaction design to education, training, or other clearly defined objectives. They may use similar technologies and interaction methods, but their design purposes and the criteria used to assess content differ."
        },
        {
          "question": "Does simulation training always need scores or leaderboards?",
          "answer": "No. Simulation training can provide operational guidance, task outcomes, or other forms of feedback according to its objectives, but not every type of training requires scores, rankings, or competition. Whether these features are used should depend on the training requirements and the actual product design."
        },
        {
          "question": "Which tasks are suitable for simulation training?",
          "answer": "Content suited to simulation may include operating procedures, scenario recognition, mission workflows, and selected exercises in response judgement. The actual scope must take account of the training purpose, equipment conditions, and professional safety requirements; not every task is suitable for being conducted entirely virtually."
        },
        {
          "question": "Can BXR plan simulated scenarios for the needs of different organisations?",
          "answer": "Within the product’s capabilities and project scope, BXR can discuss the scenario and interaction configurations needed for different training objectives. The items that can be adjusted, the development scope, and the implementation approach still need to be assessed against individual requirements."
        }
      ],
      "closing": {
        "title": "Give every simulated scenario a clear training purpose",
        "body": "From understanding requirements and planning scenarios to designing interaction, BXR continues to explore how digital simulation can better reflect the practical use of professional training.",
        "cta": "Discuss simulation training planning"
      },
      "seo": {
        "title": "Simulation-Based Training Design | Serious Games & XR for Professional Training | BXR",
        "description": "Discover how BXR combines simulation-based training design, serious games, and interactive XR technology to translate military, police, and fire and disaster response training requirements into actionable, repeatable simulated scenarios."
      }
    },
    "jp": {
      "eyebrow": "SIMULATION-BASED TRAINING DESIGN",
      "title": "シミュレーション訓練設計",
      "lead": "優れたシミュレーション訓練とは、映像をゲームらしくすることではなく、一つひとつの操作に訓練上の目的を持たせること",
      "intro": [
        "専門訓練システムの価値は、映像がリアルかどうかだけでなく、シミュレーションの内容が実際の訓練目標に対応しているかどうかによって決まります。",
        "任務シナリオ、操作手順、インタラクティブなイベントに至るまで、シミュレーション訓練では専門的な要件を、理解しやすく、操作でき、繰り返し練習できる訓練内容に変換する必要があります。",
        "BXR は XR 技術、シナリオ設計、シリアスゲームの考え方を組み合わせ、デジタルインタラクションを単なる娯楽体験ではなく、専門訓練のためのツールとして活用します。"
      ],
      "primaryCta": "シミュレーション訓練製品を見る",
      "secondaryCta": "訓練設計の要件について相談する",
      "sections": [
        {
          "id": "concept",
          "title": "訓練目標を定めてから、模擬シナリオを設計する",
          "paragraphs": [
            "専門組織ごとに訓練要件は異なります。類似した XR 機器を使用していても、軍事戦術、警察業務の対応、消防活動では、必要なインタラクションの方法、任務の流れ、シナリオの条件がまったく異なる場合があります。",
            "そのため、シミュレーション訓練の設計では、訓練の目的を起点に、訓練生がどの操作に慣れる必要があるか、どの状況に対応するか、シミュレーションを通じてどう練習するかを考える必要があります。"
          ],
          "items": [
            {
              "title": "訓練目標",
              "paragraphs": [
                "訓練を通じて身に付けたい操作の習熟度、状況認識、対応能力を確認します。"
              ]
            },
            {
              "title": "シナリオと任務",
              "paragraphs": [
                "訓練の目的に応じて、場所、イベント、任務条件を計画します。"
              ]
            },
            {
              "title": "インタラクションと操作",
              "paragraphs": [
                "シナリオの中で訓練生が行う動作、選択、手順を設計します。"
              ]
            },
            {
              "title": "反復練習",
              "paragraphs": [
                "シミュレーションに適した手順を、制御可能な条件の下で繰り返し実施できるようにします。"
              ]
            }
          ]
        },
        {
          "id": "serious-games",
          "title": "シリアスゲーム：訓練を目的としたインタラクション設計",
          "paragraphs": [
            "シリアスゲーム（Serious Games）は、ゲームの設計手法を教育、訓練、その他の明確な目的と組み合わせる活用概念です。",
            "専門訓練を娯楽化することではなく、インタラクション、任務、フィードバック、シナリオへの参加といった設計手法を用いて、利用者が過程の中で主体的に操作し、考えることを促します。",
            "専門的なシミュレーション訓練では、シリアスゲームの設計理念を、任務への参加意識の形成、インタラクションの流れの構成、反復練習を通じた特定の手順や状況への習熟に活用できます。",
            "BXR が重視するのは、これらのインタラクションの仕組みが訓練目標に役立つかどうかであり、ゲーム映像の娯楽性ではありません。"
          ]
        },
        {
          "id": "process",
          "title": "訓練要件を、操作できるシミュレーション内容へ",
          "paragraphs": [
            "シミュレーション訓練の設計では、専門組織の要件を具体的なシステム計画に変換する必要があります。",
            "プロジェクトの範囲と実際の要件に応じて、設計作業には次の内容が含まれる場合があります。"
          ],
          "items": [
            {
              "title": "01｜要件を理解する",
              "paragraphs": [
                "訓練対象者、訓練目的、使用環境、操作条件を明確にします。"
              ]
            },
            {
              "title": "02｜シナリオを計画する",
              "paragraphs": [
                "シミュレーションに適した任務の流れ、場所、イベントを整理します。"
              ]
            },
            {
              "title": "03｜インタラクションを設計する",
              "paragraphs": [
                "操作方法、シナリオの変化、必要な使用ガイダンスを計画します。"
              ]
            },
            {
              "title": "04｜システムを構築する",
              "paragraphs": [
                "仮想コンテンツ、操作機器、システム機能を組み合わせ、利用可能なシミュレーション訓練環境を構築します。"
              ]
            },
            {
              "title": "05｜確認・調整する",
              "paragraphs": [
                "プロジェクトでのテストや利用者のフィードバックに応じて、該当する操作手順やコンテンツの提示方法を調整します。"
              ]
            }
          ],
          "note": "以上は設計方法の説明であり、すべての製品やプロジェクトがまったく同じ開発手順を採用することを意味するものではありません。"
        },
        {
          "id": "value",
          "title": "技術の表現力を、訓練での活用価値へ",
          "paragraphs": [
            "専門的なシミュレーション訓練システムは、訓練生がどの任務を完了する必要があるか、どのようにシナリオに参加するか、どの操作や判断が練習の重点となるかを理解できるものであるべきです。",
            "シナリオ設計と訓練目標が対応することで、シミュレーションシステムは専門訓練の実施計画をより効果的に支援できます。"
          ],
          "bullets": [
            "訓練目標とインタラクティブな内容の関係を明確にする。",
            "頻繁に実施しにくい一部のシナリオを模擬練習に変換する。",
            "訓練生が特定の操作や任務の流れに慣れることを支援する。",
            "さまざまな訓練シナリオの計画と調整を支援する。",
            "実地訓練と専門指導を補助する方法として活用する。"
          ]
        }
      ],
      "relatedTitle": "各製品に見るシミュレーション訓練設計の活用",
      "faq": [
        {
          "question": "シミュレーション訓練設計とは何ですか？",
          "answer": "シミュレーション訓練設計とは、訓練目標に基づいて適切なシナリオ、操作手順、インタラクションの方法、システム構成を計画し、訓練生が模擬環境で特定の任務を練習できるようにすることです。重視するのは、単にリアルな仮想映像を制作することではなく、シミュレーションの内容を訓練要件に対応させることです。"
        },
        {
          "question": "シリアスゲームと一般的なビデオゲームはどのように違いますか？",
          "answer": "一般的なビデオゲームは通常、娯楽体験を主な目的とします。一方、シリアスゲームはインタラクション設計を教育、訓練、その他の明確な目標に活用します。類似した技術やインタラクションの方法を使う場合があっても、設計目的と内容を評価する際の重点が異なります。"
        },
        {
          "question": "シミュレーション訓練には必ず点数やランキングが必要ですか？",
          "answer": "必ずしも必要ではありません。シミュレーション訓練では、目標に応じて操作ガイダンス、任務の結果、その他のフィードバック方法を設計できますが、すべての訓練に点数、順位、競争の仕組みが必要なわけではありません。これらの機能を採用するかどうかは、訓練要件と製品の実際の設計に応じて判断する必要があります。"
        },
        {
          "question": "シミュレーション訓練はどのような任務に適していますか？",
          "answer": "シミュレーションに適した内容には、操作手順、状況の識別、任務の流れ、一部の対応判断の練習などがあります。実際の適用範囲は、訓練目的、設備条件、専門的な安全要件を考慮する必要があり、すべての任務を完全に仮想環境で実施できるわけではありません。"
        },
        {
          "question": "BXR は各組織の要件に合わせて模擬シナリオを計画できますか？",
          "answer": "BXR は製品機能とプロジェクトの範囲に応じて、さまざまな訓練目標に必要なシナリオやインタラクションの構成を検討できます。実際に調整できる項目、開発範囲、導入方法は、個別の要件に応じて評価する必要があります。"
        }
      ],
      "closing": {
        "title": "一つひとつの模擬シナリオに、明確な訓練目的を",
        "body": "要件の理解、シナリオ計画、インタラクション設計を通じて、BXR はデジタルシミュレーションを専門訓練の実際の利用方法により近づけるための取り組みを続けています。",
        "cta": "シミュレーション訓練の計画について相談する"
      },
      "seo": {
        "title": "シミュレーション訓練設計｜シリアスゲームと XR による専門訓練への活用｜BXR",
        "description": "BXR がシミュレーション訓練設計、シリアスゲーム（Serious Games）、XR インタラクション技術を組み合わせ、軍事、警察業務、消防・防災の訓練要件を、操作でき、繰り返し練習できる模擬シナリオに変換する方法をご紹介します。"
      }
    }
  },
  "domain-expertise": {
    "tw": {
      "eyebrow": "DOMAIN EXPERTISE IN PROFESSIONAL TRAINING",
      "title": "專業訓練領域知識",
      "lead": "理解專業訓練需求，是開發模擬系統的重要起點",
      "intro": [
        "一套模擬訓練系統即使具備優秀的視覺效果與互動技術，如果無法對應實際訓練目的，仍然難以發揮應有的應用價值。",
        "軍事、警勤與消防防災各有不同的任務環境、操作程序及訓練需求。將這些專業需求轉換成可使用的模擬系統，需要的不只是軟體開發能力，也需要對應用領域的理解。",
        "BXR 在不同專業領域的產品與專案開發過程中，持續累積訓練情境設計與需求轉譯經驗，讓技術開發更貼近實際使用目的。"
      ],
      "primaryCta": "探索專業訓練解決方案",
      "secondaryCta": "洽詢訓練應用需求",
      "sections": [
        {
          "id": "concept",
          "title": "技術開發之前，先理解訓練要解決什麼問題",
          "paragraphs": [
            "不同領域的專業訓練，並不能只靠替換虛擬場景就完成。",
            "即使採用相同的 XR 或模擬技術，軍事單位、警察機關與消防單位的訓練對象、任務流程、操作方式及安全要求仍可能有明顯差異。",
            "因此，專業訓練領域知識的價值，在於協助開發團隊理解使用情境，並將需求轉換為合適的系統設計方向。"
          ],
          "items": [
            {
              "title": "任務情境理解",
              "paragraphs": [
                "了解不同領域的訓練目的與應用背景。"
              ]
            },
            {
              "title": "操作流程轉譯",
              "paragraphs": [
                "將適合模擬的操作程序轉換為互動設計需求。"
              ]
            },
            {
              "title": "訓練需求分析",
              "paragraphs": [
                "釐清訓練對象、使用條件與情境安排。"
              ]
            },
            {
              "title": "技術應用判斷",
              "paragraphs": [
                "評估哪些內容適合透過 XR、模擬系統或其他互動方式呈現。"
              ]
            }
          ]
        },
        {
          "id": "domains",
          "title": "不同任務領域，需要不同的模擬設計思維",
          "paragraphs": [],
          "items": [
            {
              "title": "軍事模擬",
              "paragraphs": [
                "軍事訓練涵蓋不同任務、操作程序與協同需求。模擬系統的設計，需要考量訓練目的、使用設備、任務條件及受訓者的操作方式。",
                "BXR 的軍事模擬產品涵蓋小部隊戰術、特定裝備操作、載具及無人系統相關訓練應用。"
              ]
            },
            {
              "title": "警勤模擬",
              "paragraphs": [
                "警勤訓練涉及不同勤務情境、現場判斷及操作程序。模擬設計需要考量情境呈現、互動方式及訓練人員的使用需求。",
                "BXR 透過不同形式的警勤模擬系統，支援特定執法應變與專業操作訓練。"
              ]
            },
            {
              "title": "消防防災",
              "paragraphs": [
                "消防防災訓練涉及安全認知、操作程序及情境判斷。部分訓練內容可透過虛擬環境輔助呈現，增加情境認識與操作練習的機會。",
                "BXR 將 XR 與互動模擬應用於適合的消防防災訓練與教育情境。"
              ]
            }
          ]
        },
        {
          "id": "translation",
          "title": "從專業需求到模擬系統，建立技術與應用之間的連結",
          "paragraphs": [
            "專業單位提出的訓練需求，通常不是單純的軟體功能清單。",
            "在實際專案中，可能需要先理解訓練對象、操作環境、使用流程及情境目的，再評估適合的模擬方式與系統配置。",
            "BXR 結合技術開發、專案經驗與使用單位的需求交流，將相關資訊轉換為產品設計、互動流程及應用規劃的參考。",
            "這項能力不取決於單一人員的背景，而是需要透過專案執行、跨領域溝通及持續改善逐步累積。"
          ]
        },
        {
          "id": "value",
          "title": "讓模擬系統不只做得出來，也更貼近使用目的",
          "paragraphs": [
            "專業訓練領域知識的作用，是讓技術開發能夠與實際應用建立關係。",
            "從需求討論到系統設計，對訓練情境的理解有助於釐清產品應該呈現哪些內容、支援哪些操作，以及如何安排適合的互動方式。"
          ],
          "bullets": [
            "協助技術團隊理解不同專業領域的需求。",
            "將訓練目標轉換為具體的系統設計方向。",
            "讓情境與操作流程更貼近預期使用方式。",
            "支援不同專案的需求溝通與應用規劃。",
            "透過開發與使用回饋持續累積組織經驗。"
          ]
        }
      ],
      "relatedTitle": "將專業領域理解運用於不同訓練需求",
      "faq": [
        {
          "question": "什麼是專業訓練領域知識？",
          "answer": "專業訓練領域知識是指對特定領域的訓練目標、任務情境、操作程序及使用需求的理解。在模擬系統開發中，這些知識有助於將實際訓練需求轉換為適合的功能、情境與互動設計。"
        },
        {
          "question": "為什麼開發 XR 訓練系統需要理解專業領域？",
          "answer": "因為不同領域的訓練目的與操作方式並不相同。若只具備 XR 開發能力，卻不了解訓練需求，可能無法設計出符合使用目的的情境與操作流程。專業領域理解能協助技術團隊更準確地規劃模擬內容。"
        },
        {
          "question": "軍事、警勤與消防模擬訓練可以使用相同的設計方式嗎？",
          "answer": "部分技術架構與互動方法可以共用，但不同領域的任務目標、操作程序及安全要求各有差異，因此仍需要依實際需求調整情境、操作方式與系統配置。"
        },
        {
          "question": "BXR 如何將訓練需求轉換成模擬系統？",
          "answer": "BXR 透過需求交流、情境規劃、技術評估與產品開發，將適合模擬的訓練內容轉換為系統功能及互動設計。實際流程與開發範圍依產品或專案需求而定。"
        },
        {
          "question": "模擬訓練系統是否能完全重現真實任務？",
          "answer": "模擬系統可以依訓練目標呈現特定情境、操作或任務條件，但不代表能完整重現真實環境的所有因素。模擬訓練應依其設計目的使用，並與必要的實體訓練及專業教學相互配合。"
        }
      ],
      "closing": {
        "title": "從理解需求開始，規劃適合的專業訓練應用",
        "body": "不同任務需要不同的訓練方式。BXR 透過技術開發與需求交流，持續探索符合各領域使用目的的模擬訓練方案。",
        "cta": "洽詢專業訓練需求"
      },
      "seo": {
        "title": "專業訓練領域知識｜軍警消模擬訓練需求與系統設計｜BXR",
        "description": "了解 BXR 如何結合軍事、警勤與消防防災的訓練需求理解、專案經驗及 XR 模擬技術，將專業任務情境轉換為適合的模擬訓練系統設計。"
      }
    },
    "en": {
      "eyebrow": "DOMAIN EXPERTISE IN PROFESSIONAL TRAINING",
      "title": "Domain Expertise in Professional Training",
      "lead": "Understanding professional training requirements is an essential starting point for simulation system development",
      "intro": [
        "Even a simulation training system with excellent visuals and interactive technology can struggle to deliver its intended practical value if it does not address actual training purposes.",
        "Military, police, and fire and disaster response each involve different mission environments, operating procedures, and training requirements. Translating these professional requirements into usable simulation systems requires more than software development capabilities: it also requires an understanding of the application domain.",
        "Through product and project development in different professional fields, BXR continues to accumulate experience in training scenario design and requirements translation, bringing technology development closer to its practical purpose."
      ],
      "primaryCta": "Explore professional training solutions",
      "secondaryCta": "Discuss your training application requirements",
      "sections": [
        {
          "id": "concept",
          "title": "Understand the problem training needs to solve before developing technology",
          "paragraphs": [
            "Professional training in different fields cannot be delivered simply by swapping virtual scenes.",
            "Even when the same XR or simulation technology is used, military organisations, police agencies, and fire services may differ significantly in their trainees, mission workflows, operating methods, and safety requirements.",
            "The value of domain expertise in professional training therefore lies in helping development teams understand usage scenarios and translate requirements into appropriate directions for system design."
          ],
          "items": [
            {
              "title": "Understanding mission scenarios",
              "paragraphs": [
                "Understand training purposes and application contexts in different fields."
              ]
            },
            {
              "title": "Translating operating procedures",
              "paragraphs": [
                "Translate operating procedures suited to simulation into interaction design requirements."
              ]
            },
            {
              "title": "Analysing training requirements",
              "paragraphs": [
                "Clarify who will be trained, the conditions of use, and scenario arrangements."
              ]
            },
            {
              "title": "Assessing technology applications",
              "paragraphs": [
                "Evaluate which content is suitable for presentation through XR, simulation systems, or other modes of interaction."
              ]
            }
          ]
        },
        {
          "id": "domains",
          "title": "Different mission domains call for different approaches to simulation design",
          "paragraphs": [],
          "items": [
            {
              "title": "Military simulation",
              "paragraphs": [
                "Military training encompasses different missions, operating procedures, and coordination requirements. Simulation system design needs to consider training purposes, the equipment used, mission conditions, and how trainees operate.",
                "BXR’s military simulation products cover training applications related to small-unit tactics, the operation of specific equipment, vehicles, and unmanned systems."
              ]
            },
            {
              "title": "Police simulation",
              "paragraphs": [
                "Police training involves different duty scenarios, on-scene judgement, and operating procedures. Simulation design needs to consider how scenarios are presented, modes of interaction, and the needs of training personnel.",
                "BXR supports specific law enforcement response and professional operational training through different forms of police simulation systems."
              ]
            },
            {
              "title": "Fire and disaster response",
              "paragraphs": [
                "Fire and disaster response training involves safety awareness, operating procedures, and situational judgement. Virtual environments can help present selected training content, increasing opportunities for understanding scenarios and practising operations.",
                "BXR applies XR and interactive simulation to suitable fire and disaster response training and educational scenarios."
              ]
            }
          ]
        },
        {
          "id": "translation",
          "title": "Connect technology and application by translating professional requirements into simulation systems",
          "paragraphs": [
            "The training requirements raised by professional organisations are usually more than a simple list of software functions.",
            "In actual projects, it may be necessary to first understand who will be trained, the operating environment, usage workflows, and the purpose of scenarios before evaluating suitable simulation approaches and system configurations.",
            "BXR combines technology development, project experience, and discussions with user organisations to turn relevant information into input for product design, interactive workflows, and application planning.",
            "This capability does not depend on the background of a single individual. It needs to be built gradually through project delivery, communication across domains, and continuous improvement."
          ]
        },
        {
          "id": "value",
          "title": "Build simulation systems that more closely serve their intended use",
          "paragraphs": [
            "Domain expertise in professional training helps connect technology development with practical applications.",
            "From requirements discussions to system design, an understanding of training scenarios helps clarify which content a product should present, which operations it should support, and how suitable modes of interaction should be arranged."
          ],
          "bullets": [
            "Help technology teams understand requirements in different professional fields.",
            "Translate training objectives into concrete directions for system design.",
            "Bring scenarios and operating procedures closer to the intended usage.",
            "Support requirements communication and application planning across different projects.",
            "Continue building organisational experience through development and user feedback."
          ]
        }
      ],
      "relatedTitle": "Apply domain understanding to different training requirements",
      "faq": [
        {
          "question": "What is domain expertise in professional training?",
          "answer": "Domain expertise in professional training is an understanding of training objectives, mission scenarios, operating procedures, and user requirements within a particular field. In simulation system development, this knowledge helps translate actual training requirements into suitable functions, scenarios, and interaction design."
        },
        {
          "question": "Why does XR training system development require an understanding of professional domains?",
          "answer": "Training purposes and operating methods vary across fields. XR development capabilities alone, without an understanding of training requirements, may not be enough to design scenarios and operating procedures that meet the intended purpose. Domain understanding helps technology teams plan simulation content more accurately."
        },
        {
          "question": "Can military, police, and fire simulation training use the same design approach?",
          "answer": "Some technology architectures and interaction methods can be shared, but mission objectives, operating procedures, and safety requirements differ across fields. Scenarios, operating methods, and system configurations therefore still need to be adjusted according to actual requirements."
        },
        {
          "question": "How does BXR translate training requirements into simulation systems?",
          "answer": "Through requirements discussions, scenario planning, technology assessment, and product development, BXR translates training content suited to simulation into system functions and interaction design. The actual process and development scope depend on the requirements of the product or project."
        },
        {
          "question": "Can simulation training systems fully reproduce real missions?",
          "answer": "Simulation systems can present particular scenarios, operations, or mission conditions according to training objectives, but this does not mean they can reproduce every factor in a real environment. Simulation training should be used for its designed purpose and combined with necessary physical training and professional instruction."
        }
      ],
      "closing": {
        "title": "Start with an understanding of requirements to plan suitable professional training applications",
        "body": "Different missions require different training methods. Through technology development and requirements discussions, BXR continues to explore simulation training solutions that serve the intended use in each field.",
        "cta": "Discuss your professional training requirements"
      },
      "seo": {
        "title": "Domain Expertise in Professional Training | Military, Police & Fire Simulation System Design | BXR",
        "description": "Discover how BXR combines an understanding of military, police, and fire and disaster response training requirements, project experience, and XR simulation technology to translate professional mission scenarios into suitable simulation training system designs."
      }
    },
    "jp": {
      "eyebrow": "DOMAIN EXPERTISE IN PROFESSIONAL TRAINING",
      "title": "専門訓練分野の知識",
      "lead": "専門訓練の要件を理解することが、シミュレーションシステム開発の重要な出発点",
      "intro": [
        "優れた映像表現やインタラクション技術を備えたシミュレーション訓練システムでも、実際の訓練目的に対応していなければ、期待される活用価値を十分に発揮することは困難です。",
        "軍事、警察業務、消防・防災では、任務環境、操作手順、訓練要件がそれぞれ異なります。こうした専門的な要件を利用可能なシミュレーションシステムに変換するには、ソフトウェア開発能力だけでなく、活用分野への理解も必要です。",
        "BXR は、異なる専門分野の製品・プロジェクト開発を通じて、訓練シナリオの設計と要件の具体化に関する経験を継続的に蓄積し、技術開発を実際の利用目的に近づけています。"
      ],
      "primaryCta": "専門訓練ソリューションを見る",
      "secondaryCta": "訓練の活用要件について相談する",
      "sections": [
        {
          "id": "concept",
          "title": "技術開発の前に、訓練で解決すべき課題を理解する",
          "paragraphs": [
            "異なる分野の専門訓練は、仮想シーンを置き換えるだけでは実現できません。",
            "同じ XR 技術やシミュレーション技術を採用していても、軍事組織、警察機関、消防組織では、訓練対象者、任務の流れ、操作方法、安全要件に大きな違いがある場合があります。",
            "そのため、専門訓練分野の知識には、開発チームが利用場面を理解し、要件を適切なシステム設計の方向性に変換することを支援する価値があります。"
          ],
          "items": [
            {
              "title": "任務シナリオの理解",
              "paragraphs": [
                "異なる分野の訓練目的と活用背景を理解します。"
              ]
            },
            {
              "title": "操作手順の具体化",
              "paragraphs": [
                "シミュレーションに適した操作手順を、インタラクション設計の要件に変換します。"
              ]
            },
            {
              "title": "訓練要件の分析",
              "paragraphs": [
                "訓練対象者、使用条件、シナリオの構成を明確にします。"
              ]
            },
            {
              "title": "技術活用の判断",
              "paragraphs": [
                "XR、シミュレーションシステム、その他のインタラクションの方法で提示するのに適した内容を評価します。"
              ]
            }
          ]
        },
        {
          "id": "domains",
          "title": "任務分野ごとに、異なるシミュレーション設計の考え方を",
          "paragraphs": [],
          "items": [
            {
              "title": "軍事シミュレーション",
              "paragraphs": [
                "軍事訓練には、さまざまな任務、操作手順、連携の要件が含まれます。シミュレーションシステムの設計では、訓練目的、使用機器、任務条件、訓練生の操作方法を考慮する必要があります。",
                "BXR の軍事シミュレーション製品は、小部隊戦術、特定装備の操作、ビークル、無人システムに関わる訓練への活用を対象としています。"
              ]
            },
            {
              "title": "警察業務シミュレーション",
              "paragraphs": [
                "警察業務の訓練には、さまざまな職務上の状況、現場での判断、操作手順が関わります。シミュレーション設計では、状況の提示方法、インタラクションの方法、訓練担当者の使用要件を考慮する必要があります。",
                "BXR は異なる形式の警察業務シミュレーションシステムを通じて、特定の法執行場面への対応と専門的な操作訓練を支援します。"
              ]
            },
            {
              "title": "消防・防災",
              "paragraphs": [
                "消防・防災訓練には、安全認識、操作手順、状況判断が関わります。一部の訓練内容は仮想環境を通じて提示を補助でき、状況への理解や操作練習の機会を増やせます。",
                "BXR は XR とインタラクティブなシミュレーションを、適した消防・防災の訓練・教育シナリオに活用します。"
              ]
            }
          ]
        },
        {
          "id": "translation",
          "title": "専門的な要件をシミュレーションシステムへ変換し、技術と活用をつなぐ",
          "paragraphs": [
            "専門組織が提示する訓練要件は、通常、単なるソフトウェア機能の一覧ではありません。",
            "実際のプロジェクトでは、訓練対象者、操作環境、使用の流れ、シナリオの目的を先に理解した上で、適切なシミュレーション方法とシステム構成を評価する必要がある場合があります。",
            "BXR は技術開発、プロジェクト経験、利用組織との要件に関する対話を組み合わせ、関連情報を製品設計、インタラクションの流れ、活用計画の参考にします。",
            "この能力は一人の経歴によって決まるものではなく、プロジェクトの実施、分野を越えたコミュニケーション、継続的な改善を通じて段階的に蓄積する必要があります。"
          ]
        },
        {
          "id": "value",
          "title": "開発できるだけでなく、利用目的により即したシミュレーションシステムへ",
          "paragraphs": [
            "専門訓練分野の知識は、技術開発と実際の活用を結び付ける役割を果たします。",
            "要件の検討からシステム設計まで、訓練シナリオへの理解は、製品でどの内容を提示し、どの操作を支援し、適切なインタラクションをどのように構成するかを明確にするために役立ちます。"
          ],
          "bullets": [
            "技術チームによる各専門分野の要件理解を支援する。",
            "訓練目標を具体的なシステム設計の方向性に変換する。",
            "シナリオや操作手順を想定される利用方法に近づける。",
            "さまざまなプロジェクトで要件に関する対話と活用計画を支援する。",
            "開発と利用者のフィードバックを通じて組織の経験を蓄積し続ける。"
          ]
        }
      ],
      "relatedTitle": "専門分野への理解を、さまざまな訓練要件に活かす",
      "faq": [
        {
          "question": "専門訓練分野の知識とは何ですか？",
          "answer": "専門訓練分野の知識とは、特定の分野における訓練目標、任務シナリオ、操作手順、利用要件への理解を指します。シミュレーションシステムの開発では、こうした知識が、実際の訓練要件を適切な機能、シナリオ、インタラクション設計に変換するために役立ちます。"
        },
        {
          "question": "XR 訓練システムの開発に専門分野への理解が必要なのはなぜですか？",
          "answer": "分野ごとに訓練目的や操作方法が異なるためです。XR の開発能力があっても訓練要件を理解していなければ、利用目的に合うシナリオや操作手順を設計できない場合があります。専門分野への理解は、技術チームがシミュレーションの内容をより的確に計画するために役立ちます。"
        },
        {
          "question": "軍事、警察業務、消防のシミュレーション訓練に同じ設計方法を使用できますか？",
          "answer": "一部の技術構成やインタラクションの手法は共用できますが、各分野の任務目標、操作手順、安全要件には違いがあります。そのため、実際の要件に応じてシナリオ、操作方法、システム構成を調整する必要があります。"
        },
        {
          "question": "BXR は訓練要件をどのようにシミュレーションシステムへ変換しますか？",
          "answer": "BXR は要件に関する対話、シナリオ計画、技術評価、製品開発を通じて、シミュレーションに適した訓練内容をシステム機能とインタラクション設計へ変換します。実際の手順と開発範囲は、製品またはプロジェクトの要件によって異なります。"
        },
        {
          "question": "シミュレーション訓練システムは実際の任務を完全に再現できますか？",
          "answer": "シミュレーションシステムは、訓練目標に応じて特定の状況、操作、任務条件を提示できますが、実環境のあらゆる要素を完全に再現できることを意味するものではありません。シミュレーション訓練は設計目的に沿って使用し、必要な実地訓練や専門指導と組み合わせるべきです。"
        }
      ],
      "closing": {
        "title": "要件の理解から、適切な専門訓練の活用を計画する",
        "body": "任務によって、必要な訓練方法は異なります。BXR は技術開発と要件に関する対話を通じて、各分野の利用目的に適したシミュレーション訓練ソリューションを探求し続けています。",
        "cta": "専門訓練の要件について相談する"
      },
      "seo": {
        "title": "専門訓練分野の知識｜軍事・警察・消防のシミュレーション訓練要件とシステム設計｜BXR",
        "description": "BXR が軍事、警察業務、消防・防災の訓練要件への理解、プロジェクト経験、XR シミュレーション技術を組み合わせ、専門的な任務シナリオを適切なシミュレーション訓練システムの設計に変換する方法をご紹介します。"
      }
    }
  }
};

export const technologyContent = { ...firstBatchContent, ...batchTwoA, ...batchTwoB };

export const overviewContent: Record<"tw" | "en" | "jp", TechnologyOverviewContent> = {
  "tw": {
    "eyebrow": "CORE TECHNOLOGIES",
    "title": "核心技術",
    "lead": "從虛擬情境到實際訓練，讓技術回應專業需求",
    "intro": [
      "專業模擬訓練的價值，不只來自逼真的虛擬畫面，更取決於訓練目標、操作互動、情境設計與系統整合之間的配合。",
      "Big x Reality（BXR）結合 XR 延展實境、數位模擬、互動設計與跨領域應用經驗，持續開發適用於軍事、警勤及消防防災等領域的模擬訓練系統。",
      "透過技術與訓練需求的整合，協助專業單位建立安全、可重複且符合應用目的的訓練環境。"
    ],
    "technologies": {
      "xr": {
        "title": "XR 延展實境",
        "description": "整合 VR、AR、MR 等沉浸式互動技術，建立適用於不同任務需求的虛擬與虛實融合訓練環境。"
      },
      "ai-simulation": {
        "title": "AI 智慧模擬",
        "description": "探索人工智慧在虛擬角色、情境互動及模擬系統中的應用，依產品實際功能與專案需求導入。"
      },
      "digital-simulation": {
        "title": "數位場景與模擬建構",
        "description": "透過三維建模、場景設計與數位環境建構，將訓練所需的空間、設備與情境轉化為可互動的模擬環境。"
      },
      "training-design": {
        "title": "模擬訓練設計",
        "description": "結合訓練目標、任務流程與嚴肅遊戲設計理念，將專業訓練需求轉換為具備互動性與重複練習價值的模擬系統。"
      },
      "system-integration": {
        "title": "通訊與系統整合",
        "description": "依訓練需求整合操作設備、資訊介面與相關系統，支援特定情境中的資訊傳遞及協同應用。"
      },
      "decision-visualization": {
        "title": "指揮決策與資訊視覺化",
        "description": "透過地圖、圖台及資訊視覺化介面，協助呈現任務情境與相關資訊，支援部署討論及決策演練。"
      },
      "domain-expertise": {
        "title": "專業訓練領域知識",
        "description": "結合軍事、警勤及消防防災領域的訓練需求理解與專案應用經驗，將專業任務轉化為模擬系統的設計方向。"
      }
    },
    "seo": {
      "title": "核心技術｜XR 模擬訓練、訓練設計與系統整合｜BXR",
      "description": "了解 BXR 如何整合 XR 延展實境、數位模擬、訓練設計、專業領域知識及系統整合能力，回應軍事、警勤與消防防災等專業訓練需求。"
    }
  },
  "en": {
    "eyebrow": "CORE TECHNOLOGIES",
    "title": "Core Technologies",
    "lead": "From virtual scenarios to practical training: technology that responds to professional requirements",
    "intro": [
      "The value of professional simulation training comes not only from realistic virtual imagery, but also from the alignment between training objectives, operational interaction, scenario design, and system integration.",
      "Big x Reality (BXR) combines extended reality (XR), digital simulation, interaction design, and experience across application domains to continue developing simulation training systems for fields such as military, police, and fire and disaster response.",
      "By bringing technology and training requirements together, BXR helps professional organisations build safe, repeatable training environments suited to their intended applications."
    ],
    "technologies": {
      "xr": {
        "title": "Extended Reality (XR)",
        "description": "Integrate immersive interaction technologies such as VR, AR, and MR to create virtual and blended physical–digital training environments for different mission requirements."
      },
      "ai-simulation": {
        "title": "AI-Enhanced Simulation",
        "description": "Explore the application of artificial intelligence in virtual characters, scenario interaction, and simulation systems, introducing it according to actual product capabilities and project requirements."
      },
      "digital-simulation": {
        "title": "Digital Environments and Simulation Development",
        "description": "Use three-dimensional modelling, scene design, and digital environment development to turn the spaces, equipment, and scenarios needed for training into interactive simulated environments."
      },
      "training-design": {
        "title": "Simulation-Based Training Design",
        "description": "Combine training objectives, mission workflows, and serious games principles to translate professional training requirements into interactive simulation systems with value for repeated practice."
      },
      "system-integration": {
        "title": "Communication & System Integration",
        "description": "Integrate operating equipment, information interfaces, and related systems according to training requirements, supporting information transfer and collaborative applications in specific scenarios."
      },
      "decision-visualization": {
        "title": "Command Decision-Making and Information Visualisation",
        "description": "Use maps, tactical displays, and information visualisation interfaces to present mission scenarios and related information, supporting deployment discussions and decision-making exercises."
      },
      "domain-expertise": {
        "title": "Domain Expertise in Professional Training",
        "description": "Combine an understanding of training requirements in military, police, and fire and disaster response with project application experience to translate professional missions into directions for simulation system design."
      }
    },
    "seo": {
      "title": "Core Technologies | XR Simulation Training, Training Design & System Integration | BXR",
      "description": "Discover how BXR brings together XR, digital simulation, training design, domain expertise, and system integration capabilities to address professional training requirements in military, police, and fire and disaster response."
    }
  },
  "jp": {
    "eyebrow": "CORE TECHNOLOGIES",
    "title": "コア技術",
    "lead": "仮想シナリオから実際の訓練へ、専門的な要件に応える技術",
    "intro": [
      "専門的なシミュレーション訓練の価値は、リアルな仮想映像だけでなく、訓練目標、操作インタラクション、シナリオ設計、システム統合の連携によって決まります。",
      "Big x Reality（BXR）は、XR（エクステンデッド・リアリティ）、デジタルシミュレーション、インタラクション設計、分野を越えた活用経験を組み合わせ、軍事、警察業務、消防・防災などの分野に適したシミュレーション訓練システムの開発を続けています。",
      "技術と訓練要件の統合を通じて、専門組織が安全で、繰り返し利用でき、活用目的に合った訓練環境を構築することを支援します。"
    ],
    "technologies": {
      "xr": {
        "title": "XR（エクステンデッド・リアリティ）",
        "description": "VR、AR、MR などの没入型インタラクション技術を統合し、異なる任務要件に適した仮想環境や現実と仮想を融合した訓練環境を構築します。"
      },
      "ai-simulation": {
        "title": "AI シミュレーション",
        "description": "仮想キャラクター、シナリオ内のインタラクション、シミュレーションシステムへの人工知能の活用を探求し、製品の実際の機能とプロジェクト要件に応じて導入します。"
      },
      "digital-simulation": {
        "title": "デジタル環境・シミュレーション構築",
        "description": "三次元モデリング、シーン設計、デジタル環境の構築を通じて、訓練に必要な空間、設備、状況をインタラクティブな模擬環境に変換します。"
      },
      "training-design": {
        "title": "シミュレーション訓練設計",
        "description": "訓練目標、任務の流れ、シリアスゲームの設計理念を組み合わせ、専門訓練の要件を、インタラクションと反復練習の価値を備えたシミュレーションシステムに変換します。"
      },
      "system-integration": {
        "title": "通信・システム統合",
        "description": "訓練要件に応じて操作機器、情報インターフェース、関連システムを統合し、特定のシナリオでの情報伝達や連携した活用を支援します。"
      },
      "decision-visualization": {
        "title": "指揮・意思決定と情報の可視化",
        "description": "地図、作戦図台、情報可視化インターフェースを通じて任務シナリオと関連情報を提示し、配置の検討や意思決定演習を支援します。"
      },
      "domain-expertise": {
        "title": "専門訓練分野の知識",
        "description": "軍事、警察業務、消防・防災分野の訓練要件への理解とプロジェクトでの活用経験を組み合わせ、専門的な任務をシミュレーションシステムの設計方針に変換します。"
      }
    },
    "seo": {
      "title": "コア技術｜XR シミュレーション訓練・訓練設計・システム統合｜BXR",
      "description": "BXR が XR（エクステンデッド・リアリティ）、デジタルシミュレーション、訓練設計、専門分野の知識、システム統合能力を結び付け、軍事、警察業務、消防・防災などの専門訓練要件に応える方法をご紹介します。"
    }
  }
};
