// Shared by index and query. CJK runs (Han, kana) become overlapping character
// bigrams, and each bigram is encoded as an ASCII letter token so Pagefind
// never has to segment CJK text itself. Other text keeps its words.
const CJK = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}ー々]+/gu;
const enc = (ch) => { let n = ch.codePointAt(0), s = ""; for (let i = 0; i < 4; i++) { s = String.fromCharCode(97 + (n % 26)) + s; n = Math.floor(n / 26); } return s; };
export function tokenize(text) {
  const out = [];
  let last = 0;
  for (const m of text.matchAll(CJK)) {
    out.push(text.slice(last, m.index));
    const run = [...m[0]];
    if (run.length === 1) out.push(` qz${enc(run[0])} `);
    else for (let i = 0; i < run.length - 1; i++) out.push(` qz${enc(run[i])}${enc(run[i + 1])} `);
    last = m.index + m[0].length;
  }
  out.push(text.slice(last));
  return out.join(" ").replace(/\s+/g, " ").trim();
}
