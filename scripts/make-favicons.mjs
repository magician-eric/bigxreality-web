// Rasterises the official CIS symbol (design-source/01_Logo/SVG/BXR_Symbol_Red.svg)
// into the PNG sizes listed in the Web Design System P.04. The SVG itself is
// copied unchanged as favicon.svg. Nothing is redrawn.
import sharp from "sharp";
import { copyFile, readFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const src = path.join(root, "design-source/01_Logo/SVG/BXR_Symbol_Red.svg");
const pub = path.join(root, "public");
const svg = await readFile(src);

const outputs = [
  ["favicon-16.png", 16], ["favicon-32.png", 32], ["favicon-48.png", 48],
  ["apple-touch-icon.png", 180], ["icon-192.png", 192], ["icon-512.png", 512],
];
for (const [name, size] of outputs) {
  await sharp(svg, { density: 150 })
    .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(path.join(pub, name));
}
await copyFile(src, path.join(pub, "favicon.svg"));
console.log(`favicons: ${outputs.length} png + favicon.svg`);
