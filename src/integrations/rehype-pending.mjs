// Wraps the [待提供] / [待翻譯] markers found in Markdown body text in
// <mark class="pending">, the same element the templates use for frontmatter.
const MARKERS = /(\[待提供\]|\[待翻譯\])/;

function visit(node) {
  if (!node.children) return;
  const next = [];
  for (const child of node.children) {
    if (child.type === "text" && MARKERS.test(child.value)) {
      for (const part of child.value.split(MARKERS)) {
        if (!part) continue;
        next.push(
          MARKERS.test(part)
            ? { type: "element", tagName: "mark", properties: { className: ["pending"] }, children: [{ type: "text", value: part }] }
            : { type: "text", value: part },
        );
      }
    } else {
      visit(child);
      next.push(child);
    }
  }
  node.children = next;
}

export default function rehypePending() {
  return (tree) => visit(tree);
}
