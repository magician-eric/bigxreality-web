// Minimal static server for dist/ (directory index + 404 status), so QA scripts
// test exactly the files Cloudflare Pages will serve. Run `npm run build` first.
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";

export const CHROMIUM = process.env.CHROMIUM_PATH ?? "/opt/pw-browsers/chromium";
export const DIST = path.resolve(import.meta.dirname, "../../dist");

const TYPES = {
  ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".json": "application/json",
  ".xml": "application/xml", ".txt": "text/plain", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg",
  ".webp": "image/webp", ".avif": "image/avif", ".woff2": "font/woff2", ".ico": "image/x-icon",
};

/** Resolves a URL path to a file in dist, or null. */
export async function resolveDist(urlPath) {
  let p = decodeURIComponent(urlPath.split(/[?#]/)[0]);
  if (p.endsWith("/")) p += "index.html";
  const file = path.join(DIST, p);
  if (!file.startsWith(DIST)) return null;
  try {
    return (await stat(file)).isFile() ? file : null;
  } catch {
    return null;
  }
}

export async function startPreview(port = 4329) {
  const server = createServer(async (req, res) => {
    const file = await resolveDist(req.url ?? "/");
    if (!file) {
      res.writeHead(404, { "content-type": "text/plain" }).end("404");
      return;
    }
    res.writeHead(200, { "content-type": TYPES[path.extname(file)] ?? "application/octet-stream" });
    res.end(await readFile(file));
  });
  await new Promise((resolve) => server.listen(port, "127.0.0.1", resolve));
  return { base: `http://127.0.0.1:${port}`, stop: () => server.close() };
}
