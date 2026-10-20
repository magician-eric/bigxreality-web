/**
 * Site search tokenizer, shared by the index (scripts/build-search.mjs) and the
 * search page query (docs/PHASE-2-PLAN.md §12.4). Chinese/Japanese runs become
 * overlapping character bigrams, each encoded as an ASCII-letter token, so Pagefind
 * never has to segment CJK text itself (its own segmentation missed matches in the
 * T0 test). Other text keeps its words.
 */
const CJK = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}ー々]+/gu;

function enc(ch: string): string {
  let n = ch.codePointAt(0)!;
  let s = "";
  for (let i = 0; i < 4; i++) {
    s = String.fromCharCode(97 + (n % 26)) + s;
    n = Math.floor(n / 26);
  }
  return s;
}

export function tokenize(text: string): string {
  const out: string[] = [];
  let last = 0;
  for (const m of text.matchAll(CJK)) {
    out.push(text.slice(last, m.index));
    const run = [...m[0]];
    if (run.length === 1) out.push(` qz${enc(run[0])} `);
    else for (let i = 0; i < run.length - 1; i++) out.push(` qz${enc(run[i])}${enc(run[i + 1])} `);
    last = m.index! + m[0].length;
  }
  out.push(text.slice(last));
  return out.join(" ").replace(/\s+/g, " ").trim();
}

/** Pagefind matches languages in lower case (upper case made CJK pages fall back to the English index). */
export const searchLanguage = (htmlLang: string) => htmlLang.toLowerCase();
