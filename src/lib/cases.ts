/**
 * Case studies for the cases list, the case page and the "applied cases" block on product and
 * solution pages. One place decides what is public: unpublished or unapproved cases never reach
 * getArticles (lib/content.ts), a client name is shown only when it is marked public, and
 * products / solutions are listed only when they have a built page in this language.
 * Relations are stored once on the case (relatedProducts / relatedSolutions) and read from both sides.
 */
import type { ImageMetadata } from "astro";
import { localePath, type Lang } from "../i18n";
import { getArticles, articlesAbout, articleHref, byDate, type Article } from "./articles";
import { getLocalized } from "./content";
import { CASE_DOMAINS, type CaseDomain } from "./domains";

export interface CaseLink { slug: string; name: string; href: string }
export interface CaseView {
  article: Article;
  slug: string;
  href: string;
  title: string;
  summary: string;
  /** What may be shown as the client: the name only when public, otherwise the unit type. */
  client: string;
  anonymized: boolean;
  domains: CaseDomain[];
  products: CaseLink[];
  solutions: CaseLink[];
  cover?: { src: ImageMetadata; alt: string };
}

type CaseData = {
  client: { name: string; type?: string; disclosure: "public" | "anonymized" };
  domains: CaseDomain[];
  background?: string; challenge?: string; solution?: string; application?: string; results?: string;
  outcomes?: { label: string; value: string }[];
  gallery?: { src: ImageMetadata; alt: string; caption?: string }[];
};
export const caseBase = (a: Article) => a.base.data as unknown as Article["base"]["data"] & CaseData;
export const caseLoc = (a: Article) => a.loc.data as unknown as Article["loc"]["data"] & CaseData;

export function clientLabel(a: Article): { text: string; anonymized: boolean } {
  const base = caseBase(a);
  const loc = caseLoc(a);
  if (base.client.disclosure === "public") return { text: loc.client.name, anonymized: false };
  return { text: loc.client.type ?? loc.client.name, anonymized: true };
}

export async function toViews(articles: Article[], lang: Lang): Promise<CaseView[]> {
  const products = await getLocalized("products", lang);
  const solutions = await getLocalized("solutions", lang);
  return articles.map((a) => {
    const base = a.base.data;
    const c = clientLabel(a);
    return {
      article: a,
      slug: a.slug,
      href: articleHref(a),
      title: a.loc.data.title,
      summary: a.loc.data.summary,
      client: c.text,
      anonymized: c.anonymized,
      domains: caseBase(a).domains,
      products: products.filter((p) => base.relatedProducts.includes(p.slug)).map((p) => ({ slug: p.slug, name: p.loc.data.hero.name, href: localePath(lang, "products", p.slug) })),
      solutions: solutions.filter((s) => base.relatedSolutions.includes(s.slug)).map((s) => ({ slug: s.slug, name: s.loc.data.name, href: localePath(lang, "solutions", s.slug) })),
      cover: base.cover && { src: base.cover.src, alt: a.loc.data.cover?.alt ?? base.cover.alt },
    };
  });
}

/** Every published case in this language, newest first. */
export async function getCases(lang: Lang): Promise<CaseView[]> {
  return toViews(await getArticles("case-studies", lang), lang);
}

/** Published cases that point at this product or solution, newest first. */
export async function casesAbout(field: "relatedProducts" | "relatedSolutions", slug: string, lang: Lang): Promise<CaseView[]> {
  return toViews(await articlesAbout(field, slug, lang, ["case-studies"]), lang);
}

/**
 * Other cases to read next: explicitly related cases first (either direction), then cases
 * sharing a product, a solution or a domain, newest first.
 */
export async function moreCases(current: Article, limit = 3): Promise<CaseView[]> {
  const all = (await getArticles("case-studies", current.lang)).filter((a) => a.slug !== current.slug);
  const own = current.base.data;
  const score = (a: Article) => {
    const d = a.base.data;
    let s = 0;
    if (own.relatedCaseStudies.includes(a.slug) || d.relatedCaseStudies.includes(current.slug)) s += 100;
    s += 10 * d.relatedProducts.filter((p) => own.relatedProducts.includes(p)).length;
    s += 10 * d.relatedSolutions.filter((p) => own.relatedSolutions.includes(p)).length;
    s += caseBase(a).domains.filter((x) => caseBase(current).domains.includes(x)).length;
    return s;
  };
  const picked = all.map((a) => ({ a, s: score(a) })).sort((x, y) => y.s - x.s || byDate(x.a, y.a)).slice(0, limit).map((x) => x.a);
  return toViews(picked, current.lang);
}

/** Filter options built only from the cases given, so a facet nobody uses is never offered. */
export function facets(cases: CaseView[]) {
  const uniq = (links: CaseLink[]) => [...new Map(links.map((l) => [l.slug, l])).values()];
  return {
    domains: CASE_DOMAINS.filter((d) => cases.some((c) => c.domains.includes(d))),
    products: uniq(cases.flatMap((c) => c.products)),
    solutions: uniq(cases.flatMap((c) => c.solutions)),
  };
}

export const paragraphs = (s: string) => s.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
