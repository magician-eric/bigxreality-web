/**
 * Call-to-action set per page type (AIDA landing pages): one group in the hero and
 * one in the closing band. Both come from here, so a page's buttons are defined once.
 * Every action is a real link: site pages, in-page anchors, or the contact page with
 * the request topic and product/solution filled in (docs/COPY-REVIEW.md).
 */
import { localePath, type Lang } from "../i18n";
import { getUi } from "./ui";

export interface CtaAction { label: string; href: string; variant: "primary" | "secondary" }
export interface CtaSet { hero: CtaAction[]; footer: CtaAction[] }

/** Topics understood by /[lang]/contact/ (they pick the heading and the e-mail subject). */
export type ContactTopic = "general" | "demo" | "info" | "product" | "solution" | "solution-demo" | "needs";

export function contactHref(lang: Lang, topic: ContactTopic, item?: string): string {
  const q = new URLSearchParams({ topic, ...(item ? { item } : {}) });
  return `${localePath(lang, "contact")}?${q}`;
}

type Ctx =
  | { page: "home" }
  | { page: "products" }
  | { page: "solutions" }
  | { page: "product"; code: string }
  /** Product landing page: one inquiry button (owner decision 2026-10-20: demo / brochure
   *  buttons stay off until those services are confirmed). */
  | { page: "productInquiry"; code: string; label: string }
  /** Solution landing page: one inquiry button with the solution name filled in. */
  | { page: "solutionInquiry"; name: string; label: string }
  | { page: "solution"; name: string };

export function ctaSet(lang: Lang, ctx: Ctx): CtaSet {
  const t = getUi(lang).cta;
  const products = localePath(lang, "products");
  const solutions = localePath(lang, "solutions");
  const p = (label: string, href: string): CtaAction => ({ label, href, variant: "primary" });
  const s = (label: string, href: string): CtaAction => ({ label, href, variant: "secondary" });
  switch (ctx.page) {
    case "home":
      return {
        hero: [p(t.exploreProducts, products), s(t.findSolutions, solutions)],
        footer: [p(t.exploreProducts, products), s(t.findSolutions, solutions)],
      };
    case "products":
      return {
        hero: [p(t.viewProducts, "#product-list"), s(t.findSolutions, solutions)],
        footer: [p(t.findSolutions, solutions), s(t.viewProducts, "#product-list")],
      };
    case "solutions":
      return {
        hero: [p(t.viewSolutions, "#solution-list"), s(t.exploreProducts, products)],
        footer: [p(t.exploreProducts, products), s(t.viewSolutions, "#solution-list")],
      };
    case "product":
      return {
        hero: [p(t.bookDemo, contactHref(lang, "demo", ctx.code)), s(t.requestInfo, contactHref(lang, "info", ctx.code))],
        footer: [p(t.bookDemo, contactHref(lang, "demo", ctx.code)), s(t.productInquiry, contactHref(lang, "product", ctx.code))],
      };
    case "productInquiry":
      return {
        hero: [p(ctx.label, contactHref(lang, "product", ctx.code))],
        footer: [p(ctx.label, contactHref(lang, "product", ctx.code))],
      };
    case "solutionInquiry":
      return {
        hero: [p(ctx.label, contactHref(lang, "solution", ctx.name))],
        footer: [p(ctx.label, contactHref(lang, "solution", ctx.name))],
      };
    case "solution":
      return {
        hero: [p(t.solutionInquiry, contactHref(lang, "solution", ctx.name)), s(t.solutionDemo, contactHref(lang, "solution-demo", ctx.name))],
        footer: [p(t.solutionInquiry, contactHref(lang, "solution", ctx.name)), s(t.discussNeeds, contactHref(lang, "needs", ctx.name))],
      };
  }
}
