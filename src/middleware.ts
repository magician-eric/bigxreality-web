// i18n routing "manual": this site already routes by its own [lang] segment, so the
// middleware only passes requests through. Required by Astro when routing is manual.
// Public pages are prerendered, so only on-demand routes (the EmDash admin and its API)
// reach this; they are never meant for search engines.
import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (context, next) => {
  const response = await next();
  if (!context.url.pathname.startsWith("/_emdash")) return response;
  try {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    return response;
  } catch {
    // Some responses (redirects, proxied fetches) have immutable headers.
    const copy = new Response(response.body, response);
    copy.headers.set("X-Robots-Tag", "noindex, nofollow");
    return copy;
  }
});
