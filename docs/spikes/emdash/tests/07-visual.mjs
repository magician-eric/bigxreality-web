// Item 6 (visual): screenshot the same pages from the phase 1 build and the EmDash
// build, served by two plain static servers, and count differing pixels.
import { createServer } from "node:http";
import { readFile, stat, mkdir } from "node:fs/promises";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { chromium } from "playwright-core";

const [dirA, dirB, out] = process.argv.slice(2);
const types = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp", ".avif": "image/avif", ".woff2": "font/woff2" };
const serve = (dir, port) => createServer(async (req, res) => {
  let p = path.join(dir, decodeURIComponent(req.url.split("?")[0]));
  try { if ((await stat(p)).isDirectory()) p = path.join(p, "index.html"); res.writeHead(200, { "content-type": types[path.extname(p)] ?? "application/octet-stream" }); res.end(await readFile(p)); }
  catch { res.writeHead(404).end(); }
}).listen(port);
const sa = serve(dirA, 4501), sb = serve(dirB, 4502);
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
for (const width of [1440, 390]) for (const p of ["/tw/products/", "/tw/products/sut/", "/en/products/sut/", "/tw/products/usv/"]) {
  const shots = [];
  for (const port of [4501, 4502]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    await page.goto(`http://127.0.0.1:${port}${p}`, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    const f = path.join(out, `${p.replaceAll("/", "_")}${width}-${port === 4501 ? "phase1" : "emdash"}.png`);
    await page.screenshot({ path: f, fullPage: true }); shots.push(f); await page.close();
  }
  let diff = "?";
  try { execFileSync("compare", ["-metric", "AE", ...shots, path.join(out, `${p.replaceAll("/", "_")}${width}-diff.png`)], { stdio: "pipe" }); diff = "0"; }
  catch (e) { diff = String(e.stderr).trim().split(" ")[0]; }
  console.log(`${p.padEnd(20)} @${width}: ${diff} differing pixels`);
}
await browser.close(); sa.close(); sb.close();
