const ESC: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
export function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ESC[c]);
}

/** Escapes text and wraps [待提供] / [待翻譯] in <mark class="pending">. */
export function markPending(s: string): string {
  return escapeHtml(s).replace(/(\[待提供\]|\[待翻譯\])/g, '<mark class="pending">$1</mark>');
}

/** Text for places that cannot hold markup (meta tags, JSON-LD, alt). Markers are kept as-is. */
export function plain(s: string): string {
  return s.replace(/\s+/g, " ").trim();
}

/**
 * Marks [待提供] / [待翻譯] inside already-rendered Markdown HTML. Only text
 * between tags is touched, never attribute values.
 */
export function markPendingHtml(html: string): string {
  return html.replace(/>([^<]*)</g, (_, text: string) => `>${text.replace(/(\[待提供\]|\[待翻譯\])/g, '<mark class="pending">$1</mark>')}<`);
}
