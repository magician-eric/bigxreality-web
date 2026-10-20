// i18n routing "manual": this site already routes by its own [lang] segment, so the
// middleware only passes requests through. Required by Astro when routing is manual.
import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware((_context, next) => next());
