// Copies self-hosted font files into public/fonts and writes one stylesheet per
// family. Font family names are rewritten to the names used by the design
// tokens (--font-sans / --font-mono), so the tokens file stays untouched.
import { mkdir, readFile, writeFile, copyFile, readdir } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const out = path.join(root, "public/fonts");

const families = [
  { pkg: "@fontsource-variable/noto-sans-tc", css: "index.css", from: "Noto Sans TC Variable", to: "Noto Sans TC", file: "noto-sans-tc.css" },
  { pkg: "@fontsource-variable/noto-sans-jp", css: "index.css", from: "Noto Sans JP Variable", to: "Noto Sans JP", file: "noto-sans-jp.css" },
  { pkg: "@fontsource/b612-mono", css: "latin-400.css", from: "B612 Mono", to: "B612 Mono", file: "b612-mono.css" },
];

await mkdir(out, { recursive: true });
for (const f of families) {
  const dir = path.join(root, "node_modules", f.pkg);
  let css = await readFile(path.join(dir, f.css), "utf8");
  css = css
    .replaceAll(`'${f.from}'`, `'${f.to}'`)
    // keep woff2 only; every supported browser reads it
    .replace(/,\s*url\([^)]*\.woff\) format\('woff'\)/g, "")
    .replace(/url\(\.\/files\//g, "url(/fonts/")
    .replace(/\/\*.*?\*\/\n/g, "");
  const used = new Set([...css.matchAll(/url\(\/fonts\/([^)]+)\)/g)].map((m) => m[1]));
  const files = (await readdir(path.join(dir, "files"))).filter((n) => used.has(n));
  await Promise.all(files.map((n) => copyFile(path.join(dir, "files", n), path.join(out, n))));
  await writeFile(path.join(out, f.file), css);
  console.log(`fonts: ${f.file} (${files.length} files)`);
}
