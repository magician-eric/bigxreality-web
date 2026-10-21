/** FAQPage structured data from a page's question and answer list (plain text, same content as the visible accordion). */
export function faqLd(items: { question: string; answer: string }[], url: string, inLanguage: string): Record<string, unknown> {
  return {
    "@type": "FAQPage",
    url,
    inLanguage,
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.question,
      acceptedAnswer: { "@type": "Answer", text: it.answer },
    })),
  };
}
