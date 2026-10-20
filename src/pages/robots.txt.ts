import type { APIRoute } from "astro";
import { isFixtureBuild } from "../lib/content-source";
import { site } from "../lib/site";

/** TEST FIXTURE builds block every crawler in case one is ever deployed by mistake (PHASE-2-PLAN §11.5). */
export const GET: APIRoute = () => {
  const body = isFixtureBuild()
    ? "User-agent: *\nDisallow: /\n"
    : `User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap.xml\n`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
