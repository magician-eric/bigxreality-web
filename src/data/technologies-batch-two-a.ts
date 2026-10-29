/** Complete second-batch content. TW is the supplied master; EN/JP preserve every paragraph and qualification. Japanese is translated directly from TW. */
import type { TechnologyPageContent } from "./technologies-content.ts";

export const batchTwoA: Record<"ai-simulation" | "digital-simulation", Record<"tw" | "en" | "jp", TechnologyPageContent>> = {
  "ai-simulation": {
    "tw": {
      "eyebrow": "核心技術",
      "title": "AI 智慧模擬",
      "lead": "依照訓練目的，探索多元模擬互動",
      "intro": [
        "專業訓練經常需要面對不同的任務條件、情境變化與互動對象。固定的模擬流程可以協助建立操作熟悉度，但部分訓練需求也可能需要更具變化的情境設計。",
        "人工智慧（AI）為模擬系統提供新的技術應用方向，包括虛擬角色行為、情境互動及資訊處理等。",
        "BXR 持續關注 AI 與 XR 模擬訓練的結合，依實際產品功能與專案需求，評估適合的智慧模擬應用方式。"
      ],
      "primaryCta": "探索模擬訓練產品",
      "secondaryCta": "洽詢 AI 模擬應用",
      "sections": [
        {
          "id": "concept",
          "title": "AI 如何參與模擬訓練？",
          "paragraphs": [
            "傳統模擬系統可以透過預先設定的事件、條件與操作流程建立訓練情境。AI 則提供另一類技術工具，可能運用於角色行為、資訊判讀或互動內容的處理。",
            "不過，並非所有動態情境都使用 AI。依照預設規則觸發的事件、條件判斷及一般程式控制，也能實現不同程度的互動變化。",
            "因此，AI 智慧模擬的重點不在於將所有功能都稱為人工智慧，而是判斷哪些訓練需求適合使用 AI，以及如何與既有模擬技術配合。"
          ],
          "items": [
            {
              "title": "虛擬角色行為",
              "paragraphs": [
                "AI 可作為虛擬角色行為設計的技術選項之一，協助探索不同的互動反應與情境變化。"
              ]
            },
            {
              "title": "情境互動",
              "paragraphs": [
                "依照訓練目的，評估使用 AI 或其他模擬邏輯來支援特定的互動內容。"
              ]
            },
            {
              "title": "資訊處理",
              "paragraphs": [
                "在適合的應用中，AI 可協助處理、分類或分析模擬系統中的相關資訊。"
              ]
            },
            {
              "title": "技術適用性",
              "paragraphs": [
                "AI 的導入需要考量可靠性、可控制性、訓練目的及系統條件，並非所有訓練情境都適合採用。"
              ]
            }
          ]
        },
        {
          "id": "simulation-methods",
          "title": "依照訓練需求，選擇合適的互動技術",
          "paragraphs": [
            "專業模擬訓練需要的不只是情境變化，更需要能夠對應訓練目標的互動設計。",
            "預先設定的腳本、規則式邏輯與 AI 技術各有不同的適用情境。",
            "對於需要明確操作程序、固定訓練條件或可重複比較的任務，規則式設計可能更容易控制與驗證。",
            "對於需要探索較多互動變化的應用，AI 則可能提供額外的技術選擇。",
            "BXR 依照訓練目的評估 AI 技術，重視實際應用的適切性。"
          ]
        },
        {
          "id": "adoption",
          "title": "AI 模擬應用，需要兼顧互動與訓練控制",
          "paragraphs": [
            "在專業訓練環境中，系統的可靠性與訓練內容的可控制性十分重要。",
            "導入 AI 時，應依實際應用評估："
          ],
          "items": [
            {
              "title": "訓練目標",
              "paragraphs": [
                "評估 AI 功能對特定訓練內容的實際助益與系統複雜度。"
              ]
            },
            {
              "title": "情境控制",
              "paragraphs": [
                "是否能維持必要的任務條件、操作邏輯與訓練範圍。"
              ]
            },
            {
              "title": "結果一致性",
              "paragraphs": [
                "對需要固定條件或比較結果的訓練，是否能符合可重複性要求。"
              ]
            },
            {
              "title": "系統整合",
              "paragraphs": [
                "AI 功能是否適合既有設備、資料架構及模擬流程。"
              ]
            },
            {
              "title": "資訊安全",
              "paragraphs": [
                "依實際部署環境與資料性質，評估資訊處理與使用限制。"
              ]
            }
          ]
        },
        {
          "id": "value",
          "title": "讓智慧技術與訓練設計共同服務專業目標",
          "paragraphs": [
            "AI 在模擬訓練中的價值，取決於它是否能解決具體的訓練問題。",
            "當 AI 與情境設計、操作互動及專業需求相互配合時，可以為特定應用提供新的設計方向。",
            "可能的應用價值包括："
          ],
          "bullets": [
            "探索不同形式的虛擬角色互動。",
            "支援特定模擬情境的資訊處理。",
            "為適合的訓練內容增加互動設計選項。",
            "配合既有模擬技術評估新的應用方式。",
            "依實際需求逐步驗證技術適用性。"
          ],
          "note": "以上為 AI 技術在模擬訓練中的應用方向，不代表 BXR 所有產品均已具備相關功能。"
        }
      ],
      "relatedTitle": "從訓練需求出發，評估 AI 的適用情境",
      "faq": [
        {
          "question": "什麼是 AI 智慧模擬？",
          "answer": "AI 智慧模擬是將人工智慧技術運用於特定模擬系統或互動情境的應用方向，可能涉及虛擬角色行為、資訊處理或情境互動。實際功能依系統設計與產品配置而定。"
        },
        {
          "question": "模擬系統中的虛擬角色會移動，就代表使用了 AI 嗎？",
          "answer": "不一定。虛擬角色的移動與反應也可以透過預先設定的動畫、事件腳本或規則式程式控制完成。是否使用 AI，應依實際技術架構判斷。"
        },
        {
          "question": "AI 能否自動產生所有訓練情境？",
          "answer": "不能一概而論。AI 可以作為部分情境設計或互動處理的技術選項，但專業訓練仍需要明確的訓練目標、內容規劃及適當驗證。不能將 AI 視為能自動完成所有訓練設計的工具。"
        },
        {
          "question": "AI 是否適合所有軍事、警勤及消防訓練？",
          "answer": "不一定。不同訓練對可靠性、可控制性及操作程序有不同要求。是否適合導入 AI，需依實際任務、設備條件與應用目的評估。"
        },
        {
          "question": "BXR 的所有模擬訓練產品都具備 AI 功能嗎？",
          "answer": "不是。不同產品具有各自的技術架構與功能範圍，AI 並非所有系統的標準配備。具體 AI 應用與可用功能，應依產品資料及專案配置確認。"
        }
      ],
      "closing": {
        "title": "從訓練需求出發，探索 AI 與模擬技術的適當結合",
        "body": "不同情境需要不同的互動與控制方式。BXR 可依應用目標，討論 AI 與既有模擬技術的適用性及系統規劃方向。",
        "cta": "洽詢 AI 模擬應用"
      },
      "seo": {
        "title": "AI 智慧模擬｜人工智慧與 XR 訓練應用",
        "description": "了解 AI 如何應用於虛擬角色、情境互動與模擬資訊處理，以及 BXR 如何依軍事、警勤及消防防災訓練需求，評估 AI 與 XR 模擬系統的結合方式。"
      }
    },
    "en": {
      "eyebrow": "Core Technology",
      "title": "AI-Enhanced Simulation",
      "lead": "Let simulation scenarios do more than present a mission: explore more varied forms of interaction",
      "intro": [
        "Professional training often involves different mission conditions, changing scenarios, and people or entities to interact with. Fixed simulation sequences can help build familiarity with operations, while some training needs may also call for more varied scenario design.",
        "Artificial intelligence (AI) offers new directions for applying technology in simulation systems, including virtual character behavior, scenario interaction, and information processing.",
        "BXR continues to explore the combination of AI and XR simulation training, assessing suitable applications for AI-enhanced simulation according to actual product capabilities and project requirements."
      ],
      "primaryCta": "Explore simulation training products",
      "secondaryCta": "Discuss AI simulation applications",
      "sections": [
        {
          "id": "concept",
          "title": "How can AI contribute to simulation training?",
          "paragraphs": [
            "Conventional simulation systems can create training scenarios through predefined events, conditions, and operating sequences. AI offers another category of technical tools that may be used to handle character behavior, information interpretation, or interactive content.",
            "However, not every dynamic scenario uses AI. Events triggered by predefined rules, conditional logic, and ordinary program control can also deliver varying degrees of interactive variation.",
            "The focus of AI-enhanced simulation is therefore not to label every feature as artificial intelligence, but to determine which training needs are suited to AI and how it can work alongside established simulation technologies."
          ],
          "items": [
            {
              "title": "Virtual character behavior",
              "paragraphs": [
                "AI can be one technical option for designing virtual character behavior, helping explore different interactive responses and scenario variations."
              ]
            },
            {
              "title": "Scenario interaction",
              "paragraphs": [
                "Assess the use of AI or other simulation logic to support specific interactive content according to the training objective."
              ]
            },
            {
              "title": "Information processing",
              "paragraphs": [
                "In suitable applications, AI can help process, classify, or analyze information within a simulation system."
              ]
            },
            {
              "title": "Technical suitability",
              "paragraphs": [
                "Adopting AI requires consideration of reliability, controllability, training objectives, and system conditions. It is not appropriate for every training scenario."
              ]
            }
          ]
        },
        {
          "id": "simulation-methods",
          "title": "Selecting Interaction Technologies for Training Objectives",
          "paragraphs": [
            "Professional simulation training requires more than changing scenarios: it also requires interaction design that corresponds to training objectives.",
            "Predefined scripts, rule-based logic, and AI technologies each have their own appropriate applications.",
            "For tasks that require explicit operating procedures, fixed training conditions, or repeatable comparisons, rule-based design may be easier to control and verify.",
            "For applications that seek a wider range of interactive variations, AI may offer an additional technical option.",
            "BXR focuses on whether the technology serves the training objective, rather than using AI for its own sake."
          ]
        },
        {
          "id": "adoption",
          "title": "AI simulation applications must balance interaction with training control",
          "paragraphs": [
            "System reliability and control over training content are important in professional training environments.",
            "When adopting AI, the following should be assessed for the actual application:"
          ],
          "items": [
            {
              "title": "Training objectives",
              "paragraphs": [
                "Whether the AI functionality contributes to specific training content rather than adding unrelated complexity."
              ]
            },
            {
              "title": "Scenario control",
              "paragraphs": [
                "Whether the necessary mission conditions, operating logic, and training boundaries can be maintained."
              ]
            },
            {
              "title": "Consistency of results",
              "paragraphs": [
                "Whether repeatability requirements can be met for training that requires fixed conditions or comparisons of results."
              ]
            },
            {
              "title": "System integration",
              "paragraphs": [
                "Whether the AI functionality is suitable for existing equipment, data structures, and simulation sequences."
              ]
            },
            {
              "title": "Information security",
              "paragraphs": [
                "Assess restrictions on information processing and use according to the actual deployment environment and the nature of the data."
              ]
            }
          ]
        },
        {
          "id": "value",
          "title": "Let intelligent technology serve training objectives, rather than replace training design",
          "paragraphs": [
            "The value of AI in simulation training depends on whether it can address a specific training problem.",
            "When AI works together with scenario design, operational interaction, and professional requirements, it can offer new design directions for particular applications.",
            "Potential application benefits include:"
          ],
          "bullets": [
            "Explore different forms of interaction with virtual characters.",
            "Support information processing for specific simulation scenarios.",
            "Expand interaction design options for suitable training content.",
            "Evaluate new applications alongside established simulation technologies.",
            "Validate technical suitability step by step according to actual needs."
          ],
          "note": "These are directions for applying AI technology in simulation training; they do not mean that all BXR products already include these capabilities."
        }
      ],
      "relatedTitle": "Start with training needs to assess where AI may be appropriate",
      "faq": [
        {
          "question": "What is AI-enhanced simulation?",
          "answer": "AI-enhanced simulation is an application direction that uses artificial intelligence in specific simulation systems or interactive scenarios. It may involve virtual character behavior, information processing, or scenario interaction. Actual capabilities depend on the system design and product configuration."
        },
        {
          "question": "Does movement by a virtual character in a simulation system mean it uses AI?",
          "answer": "Not necessarily. Virtual character movement and responses can also be implemented through predefined animations, event scripts, or rule-based program control. Whether AI is used should be determined from the actual technical architecture."
        },
        {
          "question": "Can AI automatically generate every training scenario?",
          "answer": "There is no universal answer. AI can be a technical option for some aspects of scenario design or interaction processing, but professional training still requires clear training objectives, content planning, and appropriate validation. AI should not be treated as a tool that can automatically complete all training design."
        },
        {
          "question": "Is AI suitable for all military, policing, and fire and disaster response training?",
          "answer": "Not necessarily. Different types of training have different requirements for reliability, controllability, and operating procedures. Whether AI is appropriate must be assessed according to the actual task, equipment conditions, and application purpose."
        },
        {
          "question": "Do all BXR simulation training products include AI capabilities?",
          "answer": "No. Different products have their own technical architectures and functional scope, and AI is not standard in every system. Specific AI applications and available capabilities should be confirmed against product documentation and project configurations."
        }
      ],
      "closing": {
        "title": "Start with training needs to explore an appropriate combination of AI and simulation technology",
        "body": "Different scenarios require different approaches to interaction and control. BXR can discuss the suitability of AI and established simulation technologies, along with directions for system planning, according to the application objectives.",
        "cta": "Discuss AI simulation applications"
      },
      "seo": {
        "title": "AI-Enhanced Simulation｜AI & XR Training",
        "description": "Learn how AI can be applied to virtual characters, scenario interaction, and simulation information processing, and how BXR evaluates combining AI with XR simulation systems for military, policing, and fire and disaster response training needs."
      }
    },
    "jp": {
      "eyebrow": "コア技術",
      "title": "AI シミュレーション",
      "lead": "任務を再現するだけでなく、より多様なインタラクションを模擬シナリオで探求する",
      "intro": [
        "専門訓練では、異なる任務条件、シナリオの変化、対話や操作の相手に対応することが求められます。固定されたシミュレーションの流れは操作への習熟に役立ちますが、訓練要件によっては、より変化に富んだシナリオ設計が必要になる場合もあります。",
        "人工知能（AI）は、仮想キャラクターの行動、シナリオ内のインタラクション、情報処理など、シミュレーションシステムへの新たな技術活用の方向性を提供します。",
        "BXR は AI と XR シミュレーション訓練の組み合わせに継続して注目し、製品の実際の機能とプロジェクト要件に応じて、適切な AI シミュレーションの活用方法を検討しています。"
      ],
      "primaryCta": "シミュレーション訓練製品を見る",
      "secondaryCta": "AI シミュレーションの活用について相談する",
      "sections": [
        {
          "id": "concept",
          "title": "AI はシミュレーション訓練にどのように関わるのか",
          "paragraphs": [
            "従来のシミュレーションシステムは、あらかじめ設定したイベント、条件、操作の流れによって訓練シナリオを構築できます。AI はそれとは別の技術的な手段であり、キャラクターの行動、情報の読み取り、インタラクティブなコンテンツの処理に活用できる可能性があります。",
            "ただし、動的なシナリオのすべてに AI が使われているわけではありません。あらかじめ定めたルールで発生するイベント、条件判定、一般的なプログラム制御でも、さまざまな程度のインタラクションの変化を実現できます。",
            "そのため、AI シミュレーションで重要なのは、すべての機能を人工知能と呼ぶことではなく、どの訓練要件に AI が適しているか、既存のシミュレーション技術とどのように組み合わせるかを判断することです。"
          ],
          "items": [
            {
              "title": "仮想キャラクターの行動",
              "paragraphs": [
                "AI は、仮想キャラクターの行動を設計する技術的な選択肢の一つとして、異なる対話・操作への反応やシナリオの変化を探求するために活用できます。"
              ]
            },
            {
              "title": "シナリオ内のインタラクション",
              "paragraphs": [
                "訓練目的に応じて、特定のインタラクティブなコンテンツを支える手段として、AI やその他のシミュレーションロジックの利用を検討します。"
              ]
            },
            {
              "title": "情報処理",
              "paragraphs": [
                "適した用途では、AI によってシミュレーションシステム内の関連情報の処理、分類、分析を支援できます。"
              ]
            },
            {
              "title": "技術の適合性",
              "paragraphs": [
                "AI の導入には、信頼性、制御可能性、訓練目的、システムの条件を考慮する必要があり、すべての訓練シナリオに適しているわけではありません。"
              ]
            }
          ]
        },
        {
          "id": "simulation-methods",
          "title": "高度なインタラクションに、常に人工知能が必要とは限らない",
          "paragraphs": [
            "専門的なシミュレーション訓練では、シナリオに変化を持たせるだけでなく、訓練目標に対応したインタラクション設計が必要です。",
            "あらかじめ設定したスクリプト、ルールベースのロジック、AI 技術には、それぞれ適した活用場面があります。",
            "明確な操作手順、固定された訓練条件、繰り返し比較できることが求められる任務では、ルールベースの設計の方が制御と検証を行いやすい場合があります。",
            "より多様なインタラクションの変化を探求する用途では、AI が追加の技術的な選択肢となる可能性があります。",
            "BXR が重視するのは、AI を使うこと自体ではなく、その技術が訓練目的に合っているかどうかです。"
          ]
        },
        {
          "id": "adoption",
          "title": "AI シミュレーションでは、インタラクションと訓練の制御を両立する",
          "paragraphs": [
            "専門訓練の環境では、システムの信頼性と訓練内容を制御できることが重要です。",
            "AI を導入する際は、実際の用途に応じて次の点を検討する必要があります。"
          ],
          "items": [
            {
              "title": "訓練目標",
              "paragraphs": [
                "AI 機能が、無関係な複雑さを増やすのではなく、特定の訓練内容に役立つかどうか。"
              ]
            },
            {
              "title": "シナリオの制御",
              "paragraphs": [
                "必要な任務条件、操作ロジック、訓練の範囲を維持できるかどうか。"
              ]
            },
            {
              "title": "結果の一貫性",
              "paragraphs": [
                "固定条件や結果の比較が必要な訓練で、反復可能性の要件を満たせるかどうか。"
              ]
            },
            {
              "title": "システム統合",
              "paragraphs": [
                "AI 機能が、既存の機器、データ構造、シミュレーションの流れに適しているかどうか。"
              ]
            },
            {
              "title": "情報セキュリティ",
              "paragraphs": [
                "実際の導入環境とデータの性質に応じて、情報の処理と利用に関する制限を検討します。"
              ]
            }
          ]
        },
        {
          "id": "value",
          "title": "AI を訓練設計の代わりにせず、訓練目標に役立つ技術として活用する",
          "paragraphs": [
            "シミュレーション訓練における AI の価値は、具体的な訓練上の課題を解決できるかどうかによって決まります。",
            "AI をシナリオ設計、操作によるインタラクション、専門的な要件と組み合わせることで、特定の用途に新たな設計の方向性を提供できる可能性があります。",
            "期待される活用価値には、次のようなものがあります。"
          ],
          "bullets": [
            "仮想キャラクターとのさまざまなインタラクションを探求する。",
            "特定の模擬シナリオにおける情報処理を支援する。",
            "適した訓練内容について、インタラクション設計の選択肢を増やす。",
            "既存のシミュレーション技術と組み合わせ、新たな活用方法を検討する。",
            "実際の要件に応じて、技術の適合性を段階的に検証する。"
          ],
          "note": "上記は、シミュレーション訓練における AI 技術の活用の方向性であり、BXR のすべての製品にこれらの機能がすでに備わっていることを意味するものではありません。"
        }
      ],
      "relatedTitle": "訓練要件を出発点に、AI が適する場面を検討する",
      "faq": [
        {
          "question": "AI シミュレーションとは何ですか。",
          "answer": "AI シミュレーションは、特定のシミュレーションシステムやインタラクティブなシナリオに人工知能を活用する方向性であり、仮想キャラクターの行動、情報処理、シナリオ内のインタラクションなどが対象となる可能性があります。実際の機能は、システム設計と製品構成によって異なります。"
        },
        {
          "question": "シミュレーション内の仮想キャラクターが動けば、AI が使われているということですか。",
          "answer": "必ずしもそうではありません。仮想キャラクターの動きや反応は、あらかじめ設定したアニメーション、イベントスクリプト、ルールベースのプログラム制御によっても実現できます。AI が使われているかどうかは、実際の技術構成に基づいて判断する必要があります。"
        },
        {
          "question": "AI は、すべての訓練シナリオを自動生成できますか。",
          "answer": "一概にはいえません。AI は、シナリオ設計やインタラクション処理の一部における技術的な選択肢となり得ますが、専門訓練には引き続き、明確な訓練目標、内容の計画、適切な検証が必要です。AI がすべての訓練設計を自動で完了できるとは考えるべきではありません。"
        },
        {
          "question": "AI は、すべての軍事・警察業務・消防訓練に適していますか。",
          "answer": "必ずしもそうではありません。訓練によって、信頼性、制御可能性、操作手順に求められる条件は異なります。AI の導入に適しているかどうかは、実際の任務、機器の条件、活用目的に応じて検討する必要があります。"
        },
        {
          "question": "BXR のすべてのシミュレーション訓練製品に AI 機能がありますか。",
          "answer": "いいえ。製品ごとに技術構成と機能範囲が異なり、AI はすべてのシステムの標準機能ではありません。具体的な AI の活用方法と利用できる機能は、製品資料とプロジェクトの構成に基づいて確認する必要があります。"
        }
      ],
      "closing": {
        "title": "訓練要件を出発点に、AI とシミュレーション技術の適切な組み合わせを探る",
        "body": "シナリオごとに、適したインタラクションと制御の方法は異なります。BXR は活用目標に応じて、AI と既存のシミュレーション技術の適合性や、システム計画の方向性についてご相談に応じます。",
        "cta": "AI シミュレーションの活用について相談する"
      },
      "seo": {
        "title": "AI シミュレーション｜AI・XR 訓練への活用",
        "description": "仮想キャラクター、シナリオ内のインタラクション、模擬情報の処理への AI 活用と、BXR が軍事・警察業務・消防防災の訓練要件に応じて AI と XR シミュレーションシステムの組み合わせを検討する方法をご紹介します。"
      }
    }
  },
  "digital-simulation": {
    "tw": {
      "eyebrow": "核心技術",
      "title": "數位場景與模擬建構",
      "lead": "將真實世界的訓練需求，轉化為可互動的數位環境",
      "intro": [
        "專業訓練經常涉及特定的空間、設備、地形與任務條件。這些因素不只是場景背景，也會影響受訓者如何觀察、操作與理解任務。",
        "數位場景與模擬建構技術，透過三維模型、虛擬環境與互動機制，將適合模擬的訓練內容轉換為可使用的數位情境。",
        "BXR 依照不同產品與訓練目的，運用數位環境建構技術，支援軍事、警勤、消防防災及相關專業模擬訓練應用。"
      ],
      "primaryCta": "探索相關訓練產品",
      "secondaryCta": "洽詢模擬場景需求",
      "sections": [
        {
          "id": "concept",
          "title": "讓數位場景成為訓練情境的重要環節",
          "paragraphs": [
            "在一般視覺展示中，三維場景主要用於呈現空間與外觀。",
            "但在模擬訓練中，場景還需要配合任務目標、使用者視角、操作方式與互動事件，才能形成適合訓練的數位環境。",
            "因此，數位場景建構不只是製作模型，而是將空間、設備、情境與操作需求整合進模擬系統。"
          ],
          "items": [
            {
              "title": "三維場景建構",
              "paragraphs": [
                "建立符合模擬目的的場域、地形、建築或空間配置。"
              ]
            },
            {
              "title": "數位設備模型",
              "paragraphs": [
                "依訓練需求呈現相關設備、載具或操作物件的外觀與必要互動。"
              ]
            },
            {
              "title": "情境條件設計",
              "paragraphs": [
                "配合訓練目標設定適當的環境、事件或任務條件。"
              ]
            },
            {
              "title": "互動環境整合",
              "paragraphs": [
                "讓場景中的必要元素與操作流程、虛擬角色或系統事件產生關聯。"
              ]
            }
          ]
        },
        {
          "id": "process",
          "title": "從訓練需求到數位環境的建立",
          "paragraphs": [
            "數位場景的建構方式，應依實際應用目的決定。",
            "有些訓練需要呈現特定空間的配置，有些重視操作物件的相對位置，也有些需要配合地形、視線或任務流程安排互動事件。",
            "常見的設計步驟包括："
          ],
          "items": [
            {
              "title": "01｜確認場景需求",
              "paragraphs": [
                "釐清訓練目標、場域特性及必要的模擬元素。"
              ]
            },
            {
              "title": "02｜規劃空間與物件",
              "paragraphs": [
                "整理場景配置、設備位置及使用者操作需求。"
              ]
            },
            {
              "title": "03｜建立數位內容",
              "paragraphs": [
                "依系統條件製作三維模型、環境素材及必要的視覺內容。"
              ]
            },
            {
              "title": "04｜整合互動機制",
              "paragraphs": [
                "將適合的物件、事件與操作流程納入模擬情境。"
              ]
            },
            {
              "title": "05｜測試與調整",
              "paragraphs": [
                "依產品需求與實際測試，調整場景呈現、互動方式及系統效能。"
              ]
            }
          ],
          "note": "不同產品與專案的實際流程可能有所差異。"
        },
        {
          "id": "digital-twins",
          "title": "釐清數位孿生與三維模擬的應用定位",
          "paragraphs": [
            "三維模擬場景可以呈現特定空間、設備與操作情境，但不代表它必然是數位孿生系統。",
            "數位孿生（Digital Twin）通常強調數位模型與實際對象之間的資料關聯，並依應用需求進行狀態反映、分析或其他形式的資訊互動。",
            "一般三維模擬環境則可以在不連接實體設備即時資料的情況下，依預設條件建立訓練情境。",
            "BXR 依不同產品與專案需求評估適合的數位環境建構方式，不將所有三維場景一概稱為數位孿生。"
          ]
        },
        {
          "id": "value",
          "title": "以數位場景建立可重複使用的訓練資源",
          "paragraphs": [
            "實際場域可能受到使用時間、地理位置、設備條件及安全要求限制，無法隨時提供相同的訓練環境。",
            "透過數位場景與模擬建構，可以將適合的空間與任務條件轉換為可重複使用的模擬內容，作為既有訓練方式的補充。",
            "主要價值："
          ],
          "bullets": [
            "建立符合訓練目的的虛擬場域。",
            "呈現特定設備、地形與空間配置。",
            "支援不同情境條件的模擬安排。",
            "協助受訓者熟悉部分場域與操作流程。",
            "依產品需求整合互動與任務內容。"
          ],
          "note": "數位場景的精度與功能應依訓練目的及系統條件決定，不代表所有場景均具備工程級精度或即時數位孿生能力。"
        }
      ],
      "relatedTitle": "數位場景如何支援不同訓練產品",
      "faq": [
        {
          "question": "數位場景與模擬建構是什麼？",
          "answer": "數位場景與模擬建構是依應用需求建立三維環境、設備模型及相關互動內容的技術方法。在專業訓練中，這些數位內容可用於呈現特定場域、操作條件與任務情境。"
        },
        {
          "question": "三維模擬場景就是數位孿生嗎？",
          "answer": "不一定。三維模擬可以使用預先建立的模型與情境條件；數位孿生則通常強調數位模型與實際對象之間的資料關聯。是否屬於數位孿生，應依系統架構與實際功能判斷。"
        },
        {
          "question": "模擬場景一定要與真實地點完全相同嗎？",
          "answer": "不一定。部分訓練需要參考特定場域配置，另一些訓練則適合使用依任務目的設計的模擬空間。場景需要的真實程度，應依訓練目標與系統條件評估。"
        },
        {
          "question": "數位場景可以用於哪些專業訓練？",
          "answer": "數位場景可依需求運用於軍事、警勤、消防防災、載具操作及其他模擬訓練。不同應用對場域、設備模型及互動方式的要求有所不同。"
        },
        {
          "question": "BXR 的所有模擬場景都會連接即時實體資料嗎？",
          "answer": "不會。不同產品採用不同的模擬架構，部分情境使用預先建立的數位內容，是否需要連接外部資料或實體設備，須依產品功能與專案需求確認。"
        }
      ],
      "closing": {
        "title": "讓訓練所需的場景，成為可操作的數位環境",
        "body": "從場域、設備到任務情境，BXR 可依訓練目的討論適合的數位場景與模擬建構方式。",
        "cta": "洽詢數位模擬應用"
      },
      "seo": {
        "title": "數位場景與模擬建構｜3D 模擬與數位孿生",
        "description": "了解 BXR 如何運用三維場景、數位設備模型與互動模擬技術，建立軍事、警勤及消防防災訓練環境，並認識數位孿生與一般 3D 模擬的差異。"
      }
    },
    "en": {
      "eyebrow": "Core Technology",
      "title": "Digital Environment & Simulation",
      "lead": "Turn real-world training needs into interactive digital environments",
      "intro": [
        "Professional training often involves specific spaces, equipment, terrain, and mission conditions. These factors are more than a backdrop: they also affect how trainees observe, operate, and understand a mission.",
        "Digital environment and simulation technologies use 3D models, virtual environments, and interaction mechanisms to turn training content suited to simulation into usable digital scenarios.",
        "BXR applies digital environment development technologies according to different products and training purposes, supporting military, policing, fire and disaster response, and related professional simulation training applications."
      ],
      "primaryCta": "Explore related training products",
      "secondaryCta": "Discuss simulation environment requirements",
      "sections": [
        {
          "id": "concept",
          "title": "Digital Environments as an Integral Part of Training Scenarios",
          "paragraphs": [
            "In conventional visual presentations, 3D environments are primarily used to show spaces and appearances.",
            "In simulation training, however, an environment must also work with mission objectives, user perspectives, operating methods, and interactive events to form a digital environment suitable for training.",
            "Developing a digital environment therefore involves more than making models: it integrates spatial, equipment, scenario, and operational requirements into the simulation system."
          ],
          "items": [
            {
              "title": "3D environment development",
              "paragraphs": [
                "Create sites, terrain, buildings, or spatial layouts that meet the purpose of the simulation."
              ]
            },
            {
              "title": "Digital equipment models",
              "paragraphs": [
                "Represent the appearance and necessary interactions of relevant equipment, vehicles, or objects to be operated according to training needs."
              ]
            },
            {
              "title": "Scenario condition design",
              "paragraphs": [
                "Set appropriate environmental, event, or mission conditions in line with the training objectives."
              ]
            },
            {
              "title": "Interactive environment integration",
              "paragraphs": [
                "Connect necessary elements in the environment with operating sequences, virtual characters, or system events."
              ]
            }
          ]
        },
        {
          "id": "process",
          "title": "From training needs to a digital environment",
          "paragraphs": [
            "The approach to developing a digital environment should be determined by the actual application purpose.",
            "Some training needs to represent the layout of a particular space; other training focuses on the relative positions of objects to be operated; and some needs interactive events arranged around terrain, sight lines, or mission sequences.",
            "Common design steps include:"
          ],
          "items": [
            {
              "title": "01 | Confirm environment requirements",
              "paragraphs": [
                "Clarify the training objectives, site characteristics, and necessary simulation elements."
              ]
            },
            {
              "title": "02 | Plan spaces and objects",
              "paragraphs": [
                "Organize the environment layout, equipment positions, and user operation requirements."
              ]
            },
            {
              "title": "03 | Develop digital content",
              "paragraphs": [
                "Produce 3D models, environmental assets, and necessary visual content according to system conditions."
              ]
            },
            {
              "title": "04 | Integrate interaction mechanisms",
              "paragraphs": [
                "Incorporate suitable objects, events, and operating sequences into the simulation scenario."
              ]
            },
            {
              "title": "05 | Test and refine",
              "paragraphs": [
                "Adjust the environment presentation, interaction methods, and system performance according to product requirements and actual testing."
              ]
            }
          ],
          "note": "The actual process may differ between products and projects."
        },
        {
          "id": "digital-twins",
          "title": "Distinct Roles of Digital Twins and 3D Simulation",
          "paragraphs": [
            "A 3D simulation environment can represent specific spaces, equipment, and operating scenarios, but that does not necessarily make it a digital twin system.",
            "A digital twin generally emphasizes data relationships between a digital model and its physical counterpart, using them to reflect states, perform analysis, or support other forms of information interaction according to application needs.",
            "A conventional 3D simulation environment, by contrast, can establish training scenarios from predefined conditions without connecting to real-time data from physical equipment.",
            "BXR assesses suitable approaches to digital environment development according to different product and project needs, rather than calling every 3D environment a digital twin."
          ]
        },
        {
          "id": "value",
          "title": "Make sites and scenarios that are difficult to access frequently into reusable training resources",
          "paragraphs": [
            "Real-world sites may be constrained by available time, geographic location, equipment conditions, and safety requirements, making the same training environment unavailable on demand.",
            "Digital environment and simulation development can turn suitable spaces and mission conditions into reusable simulation content, supplementing existing training methods.",
            "Key benefits:"
          ],
          "bullets": [
            "Build virtual sites that serve the training purpose.",
            "Represent specific equipment, terrain, and spatial layouts.",
            "Support simulation arrangements for different scenario conditions.",
            "Help trainees become familiar with selected sites and operating procedures.",
            "Integrate interaction and mission content according to product requirements."
          ],
          "note": "The accuracy and functionality of a digital environment should be determined by the training purpose and system conditions. Not every environment offers engineering-grade accuracy or real-time digital twin capabilities."
        }
      ],
      "relatedTitle": "How digital environments support different training products",
      "faq": [
        {
          "question": "What is digital environment and simulation development?",
          "answer": "Digital environment and simulation development is a technical approach to creating 3D environments, equipment models, and related interactive content according to application needs. In professional training, this digital content can represent specific sites, operating conditions, and mission scenarios."
        },
        {
          "question": "Is a 3D simulation environment the same as a digital twin?",
          "answer": "Not necessarily. A 3D simulation can use prebuilt models and scenario conditions, while a digital twin generally emphasizes data relationships between a digital model and its physical counterpart. Whether a system is a digital twin should be determined from its architecture and actual capabilities."
        },
        {
          "question": "Must a simulation environment exactly match a real location?",
          "answer": "Not necessarily. Some training needs to reference the layout of a particular site, while other training is suited to simulated spaces designed around the mission purpose. The required level of realism should be assessed according to training objectives and system conditions."
        },
        {
          "question": "What types of professional training can use digital environments?",
          "answer": "Digital environments can be used according to requirements for military, policing, fire and disaster response, vehicle operation, and other simulation training. Different applications have different requirements for sites, equipment models, and interaction methods."
        },
        {
          "question": "Do all BXR simulation environments connect to real-time physical data?",
          "answer": "No. Different products use different simulation architectures, and some scenarios use prebuilt digital content. Whether connections to external data or physical equipment are needed must be confirmed according to product capabilities and project requirements."
        }
      ],
      "closing": {
        "title": "Turn the environments needed for training into digital spaces trainees can interact with",
        "body": "From sites and equipment to mission scenarios, BXR can discuss suitable approaches to digital environment and simulation development according to the training purpose.",
        "cta": "Discuss digital simulation applications"
      },
      "seo": {
        "title": "Digital Environments｜3D Simulation & Digital Twins",
        "description": "Learn how BXR uses 3D environments, digital equipment models, and interactive simulation technologies to build military, policing, and fire and disaster response training environments, and understand the difference between digital twins and conventional 3D simulation."
      }
    },
    "jp": {
      "eyebrow": "コア技術",
      "title": "デジタル環境・シミュレーション構築",
      "lead": "現実の訓練要件を、インタラクティブなデジタル環境へ",
      "intro": [
        "専門訓練には、特定の空間、機器、地形、任務条件が関わることがよくあります。これらは単なる背景ではなく、訓練生がどのように観察し、操作し、任務を理解するかにも影響します。",
        "デジタル環境・シミュレーション構築の技術は、三次元モデル、仮想環境、インタラクションの仕組みを通じて、シミュレーションに適した訓練内容を、利用可能なデジタルシナリオに変換します。",
        "BXR は、製品と訓練目的に応じてデジタル環境構築技術を活用し、軍事、警察業務、消防・防災および関連する専門シミュレーション訓練を支援します。"
      ],
      "primaryCta": "関連する訓練製品を見る",
      "secondaryCta": "模擬環境の要件について相談する",
      "sections": [
        {
          "id": "concept",
          "title": "デジタル環境は視覚的な背景だけでなく、訓練シナリオの一部",
          "paragraphs": [
            "一般的なビジュアル展示では、三次元シーンは主に空間や外観を示すために使われます。",
            "一方、シミュレーション訓練の環境は、任務目標、利用者の視点、操作方法、インタラクティブなイベントとも組み合わせることで、訓練に適したデジタル環境になります。",
            "そのため、デジタル環境の構築はモデル制作だけではなく、空間、機器、シナリオ、操作の要件をシミュレーションシステムに統合することを意味します。"
          ],
          "items": [
            {
              "title": "三次元環境の構築",
              "paragraphs": [
                "シミュレーションの目的に合った場域、地形、建物、空間配置を構築します。"
              ]
            },
            {
              "title": "機器のデジタルモデル",
              "paragraphs": [
                "訓練要件に応じて、関連する機器、ビークル、操作対象の外観と必要なインタラクションを表現します。"
              ]
            },
            {
              "title": "シナリオ条件の設計",
              "paragraphs": [
                "訓練目標に合わせ、適切な環境、イベント、任務の条件を設定します。"
              ]
            },
            {
              "title": "インタラクティブな環境の統合",
              "paragraphs": [
                "環境内の必要な要素を、操作の流れ、仮想キャラクター、システムイベントと関連付けます。"
              ]
            }
          ]
        },
        {
          "id": "process",
          "title": "訓練要件からデジタル環境の構築へ",
          "paragraphs": [
            "デジタル環境の構築方法は、実際の活用目的に応じて決める必要があります。",
            "特定の空間配置を表現することが必要な訓練もあれば、操作対象の相対的な位置を重視する訓練もあります。また、地形、視線、任務の流れに合わせて、インタラクティブなイベントを配置する必要がある場合もあります。",
            "一般的な設計手順には、次のようなものがあります。"
          ],
          "items": [
            {
              "title": "01｜環境の要件を確認する",
              "paragraphs": [
                "訓練目標、場域の特性、必要なシミュレーション要素を明確にします。"
              ]
            },
            {
              "title": "02｜空間とオブジェクトを計画する",
              "paragraphs": [
                "環境の配置、機器の位置、利用者の操作要件を整理します。"
              ]
            },
            {
              "title": "03｜デジタルコンテンツを制作する",
              "paragraphs": [
                "システムの条件に応じて、三次元モデル、環境素材、必要なビジュアルコンテンツを制作します。"
              ]
            },
            {
              "title": "04｜インタラクションの仕組みを統合する",
              "paragraphs": [
                "適したオブジェクト、イベント、操作の流れを模擬シナリオに組み込みます。"
              ]
            },
            {
              "title": "05｜テストと調整を行う",
              "paragraphs": [
                "製品の要件と実際のテストに基づき、環境の表現、インタラクションの方法、システム性能を調整します。"
              ]
            }
          ],
          "note": "実際の手順は、製品やプロジェクトによって異なる場合があります。"
        },
        {
          "id": "digital-twins",
          "title": "デジタルツインと三次元シミュレーション、それぞれの応用分野",
          "paragraphs": [
            "三次元の模擬環境では、特定の空間、機器、操作シナリオを表現できますが、それだけで必ずデジタルツインシステムになるわけではありません。",
            "デジタルツイン（Digital Twin）は一般に、デジタルモデルと実際の対象とのデータ上の関連性を重視し、活用要件に応じて、状態の反映、分析、その他の情報のやり取りを行うものです。",
            "一方、一般的な三次元シミュレーション環境は、実際の機器のリアルタイムデータに接続しなくても、あらかじめ設定した条件で訓練シナリオを構築できます。",
            "BXR は製品やプロジェクトの要件に応じて、適したデジタル環境の構築方法を検討し、すべての三次元環境を一律にデジタルツインと呼ぶことはしません。"
          ]
        },
        {
          "id": "value",
          "title": "頻繁に利用することが難しい場域や状況を、繰り返し使える訓練資源にする",
          "paragraphs": [
            "実際の場域は、利用時間、地理的な位置、機器の条件、安全上の要件に制約され、同じ訓練環境をいつでも提供できるとは限りません。",
            "デジタル環境・シミュレーション構築によって、適した空間や任務条件を繰り返し利用できる模擬コンテンツに変換し、既存の訓練方法を補完できます。",
            "主な価値："
          ],
          "bullets": [
            "訓練目的に合った仮想の場域を構築する。",
            "特定の機器、地形、空間配置を表現する。",
            "異なるシナリオ条件でのシミュレーションを支援する。",
            "訓練生が一部の場域や操作の流れに慣れることを支援する。",
            "製品の要件に応じて、インタラクションと任務内容を統合する。"
          ],
          "note": "デジタル環境の精度と機能は、訓練目的とシステムの条件に応じて決める必要があり、すべての環境に工学用途の精度やリアルタイムのデジタルツイン機能が備わっていることを意味するものではありません。"
        }
      ],
      "relatedTitle": "デジタル環境は、さまざまな訓練製品をどのように支えるのか",
      "faq": [
        {
          "question": "デジタル環境・シミュレーション構築とは何ですか。",
          "answer": "デジタル環境・シミュレーション構築は、活用要件に応じて三次元環境、機器モデル、関連するインタラクティブなコンテンツを構築する技術的な方法です。専門訓練では、これらのデジタルコンテンツによって、特定の場域、操作条件、任務シナリオを表現できます。"
        },
        {
          "question": "三次元の模擬環境は、デジタルツインですか。",
          "answer": "必ずしもそうではありません。三次元シミュレーションでは、あらかじめ作成したモデルとシナリオ条件を利用できますが、デジタルツインは一般に、デジタルモデルと実際の対象とのデータ上の関連性を重視します。デジタルツインに当たるかどうかは、システム構成と実際の機能に基づいて判断する必要があります。"
        },
        {
          "question": "模擬環境は、実在する場所と完全に同じである必要がありますか。",
          "answer": "必ずしもそうではありません。特定の場域の配置を参考にする必要がある訓練もあれば、任務の目的に合わせて設計した模擬空間が適する訓練もあります。環境に必要な再現性は、訓練目標とシステムの条件に応じて検討する必要があります。"
        },
        {
          "question": "デジタル環境は、どのような専門訓練に活用できますか。",
          "answer": "デジタル環境は、要件に応じて軍事、警察業務、消防・防災、ビークルの操作、その他のシミュレーション訓練に活用できます。用途によって、場域、機器モデル、インタラクションの方法に求められる条件は異なります。"
        },
        {
          "question": "BXR のすべての模擬環境は、実際の対象のリアルタイムデータに接続しますか。",
          "answer": "いいえ。製品によってシミュレーションの構成は異なり、あらかじめ構築したデジタルコンテンツを使うシナリオもあります。外部データや実際の機器への接続が必要かどうかは、製品機能とプロジェクト要件に基づいて確認する必要があります。"
        }
      ],
      "closing": {
        "title": "訓練に必要な場域を、操作できるデジタル環境にする",
        "body": "場域や機器から任務シナリオまで、BXR は訓練目的に応じて、適切なデジタル環境・シミュレーション構築の方法についてご相談に応じます。",
        "cta": "デジタルシミュレーションの活用について相談する"
      },
      "seo": {
        "title": "デジタル環境構築｜3D 模擬・デジタルツイン",
        "description": "BXR が三次元環境、機器のデジタルモデル、インタラクティブなシミュレーション技術を活用して、軍事・警察業務・消防防災の訓練環境を構築する方法と、デジタルツインと一般的な 3D シミュレーションの違いをご紹介します。"
      }
    }
  }
};
