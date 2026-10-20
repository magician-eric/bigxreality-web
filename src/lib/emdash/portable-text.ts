/**
 * Portable Text (EmDash rich text) → HTML for article bodies and overviews.
 * Supports the editor's text features: paragraphs, h2–h4, quotes, bullet and
 * numbered lists (nested), bold, italic, underline, strike, inline code, links,
 * images and code blocks. Raw HTML and embeds are dropped on purpose (editors
 * cannot inject scripts or third-party frames into the public site).
 */
import type { Json } from "./client";

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
const SAFE_HREF = /^(https?:|mailto:|tel:|\/|#)/i;
const MARKS: Record<string, string> = { strong: "strong", em: "em", underline: "u", "strike-through": "s", code: "code" };

export type ImageResolver = (block: Json) => { src: string; width?: number; height?: number } | undefined;

function spans(block: Json): string {
  const defs = new Map<string, Json>((block.markDefs ?? []).map((d: Json) => [d._key, d]));
  return (block.children ?? [])
    .map((c: Json) => {
      let html = esc(c.text ?? "").replace(/\n/g, "<br>");
      for (const m of c.marks ?? []) {
        if (MARKS[m]) html = `<${MARKS[m]}>${html}</${MARKS[m]}>`;
        else if (defs.get(m)?._type === "link") {
          const href = String(defs.get(m)!.href ?? "");
          if (!SAFE_HREF.test(href)) continue;
          const external = /^https?:/i.test(href) && !href.startsWith("https://www.bigxreality.com");
          html = `<a href="${esc(href)}"${external ? ' rel="noopener"' : ""}>${html}</a>`;
        }
      }
      return html;
    })
    .join("");
}

export function portableTextToHtml(blocks: Json[] | undefined, image: ImageResolver): string {
  const out: string[] = [];
  const lists: { tag: string; level: number }[] = [];
  const closeLists = (level = 0) => {
    while (lists.length && lists[lists.length - 1].level > level) out.push(`</li></${lists.pop()!.tag}>`);
  };
  for (const b of blocks ?? []) {
    if (b._type === "block" && b.listItem) {
      const level = b.level ?? 1;
      const tag = b.listItem === "number" ? "ol" : "ul";
      closeLists(level);
      const top = lists[lists.length - 1];
      if (!top || top.level < level) {
        lists.push({ tag, level });
        out.push(`<${tag}><li>`);
      } else if (top.tag !== tag) {
        out.push(`</li></${lists.pop()!.tag}>`);
        lists.push({ tag, level });
        out.push(`<${tag}><li>`);
      } else out.push("</li><li>");
      out.push(spans(b));
      continue;
    }
    closeLists();
    if (b._type === "block") {
      const inner = spans(b);
      if (!inner.trim()) continue;
      const style = b.style ?? "normal";
      // h1 is the page title; a heading typed as h1 in the editor becomes h2.
      if (/^h[1-6]$/.test(style)) {
        const n = Math.min(Math.max(Number(style[1]), 2), 4);
        out.push(`<h${n}>${inner}</h${n}>`);
      } else if (style === "blockquote") out.push(`<blockquote><p>${inner}</p></blockquote>`);
      else out.push(`<p>${inner}</p>`);
    } else if (b._type === "image") {
      const img = image(b);
      if (!img) continue;
      const size = img.width && img.height ? ` width="${img.width}" height="${img.height}"` : "";
      const tag = `<img src="${esc(img.src)}" alt="${esc(b.alt ?? "")}"${size} loading="lazy" decoding="async">`;
      out.push(b.caption ? `<figure>${tag}<figcaption>${esc(b.caption)}</figcaption></figure>` : `<figure>${tag}</figure>`);
    } else if (b._type === "code") {
      out.push(`<pre><code>${esc(b.code ?? "")}</code></pre>`);
    }
  }
  closeLists();
  return out.length ? out.join("\n") + "\n" : "";
}

/** Plain text of a Portable Text value (for reading time, search, empty checks). */
export function portableTextToPlain(blocks: Json[] | undefined): string {
  return (blocks ?? [])
    .filter((b) => b._type === "block")
    .map((b) => (b.children ?? []).map((c: Json) => c.text ?? "").join(""))
    .join("\n\n");
}
