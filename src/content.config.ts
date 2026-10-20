import { existsSync } from "node:fs";
import { defineCollection, type SchemaContext } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { PENDING } from "./lib/pending";
import { DOMAINS } from "./lib/domains";
import { contentSource } from "./lib/content-source";
import { emdashLoader } from "./lib/emdash/loader";

/*
 * Entry ids are `<lang>/<slug>` (lang = URL segment en / tw / jp) whatever the source.
 * Structural fields (order, domains, relations, dates, draft) are read from the `tw`
 * entry only; see docs/PLAN.md §2.1. Relations store bare slugs and are checked at
 * build time in src/lib/content.ts (unknown slugs fail the build).
 *
 * Content comes from EmDash in production, or from Markdown files (backup / local);
 * see src/lib/content-source.ts. Both produce exactly the same entry shapes.
 */

const source = contentSource();
const FOLDER: Record<string, string> = { "case-studies": "case-studies" };
function loader(collection: string, emdashCollection: string) {
  if (source === "emdash") return emdashLoader(emdashCollection);
  const folder = FOLDER[collection] ?? collection;
  const fixture = `./tests/fixtures/content/${folder}`;
  const base = source === "fixtures" && existsSync(fixture) ? fixture : `./src/content/${folder}`;
  return glob({ pattern: "*/*.md", base });
}

const pending = z.literal(PENDING);
const text = z.string().min(1);
const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug: lowercase letters, digits and hyphens");
const slugs = z.array(slug).default([]);
const translationStatus = z.enum(["source", "pending", "translated"]);
/** Numeric field that may hold the PENDING marker until the value is known. */
const numberOrPending = z.union([z.number().nonnegative(), pending]);

/** An image always carries alt text (WCAG 1.1.1). */
const picture = ({ image }: SchemaContext) => z.object({ src: image(), alt: text });

const titled = z.object({ title: text, description: text });
const seo = (ctx: SchemaContext) =>
  z.object({ title: text.optional(), description: text.optional(), ogImage: ctx.image().optional() }).optional();
const cta = z.object({ title: text, description: text });
/** Paragraphs separated by a blank line. */
const paragraphs = z.string().min(1);
/**
 * Product sales landing page (owner copy, 2026-10-20): hero headline → training
 * challenge → our approach → key features → applications → closing CTA. When present,
 * the product page uses this layout; products without it keep the original template.
 */
const landing = z.object({
  headline: text,
  subheadline: text,
  /** Button text of the hero and closing CTA, e.g. 洽詢 SUT 訓練系統. */
  ctaLabel: text,
  challenge: z.object({ title: text, body: paragraphs }),
  approach: z.object({ title: text, body: paragraphs }),
  features: z.array(z.object({ title: text, description: text })).min(1),
  applications: z.array(text).min(1),
  closing: z.object({ title: text, description: text }),
});

const products = defineCollection({
  loader: loader("products", "products"),
  schema: (ctx) =>
    z.object({
      translationStatus,
      draft: z.boolean().default(false),
      publishDate: z.coerce.date(),
      updatedAt: z.coerce.date().optional(),
      order: z.number().int(),
      domains: z.array(z.enum(DOMAINS)).min(1),
      hero: z.object({
        name: text,
        englishName: text,
        code: text,
        tagline: text,
        image: picture(ctx).optional(),
      }),
      summary: text.optional(),
      landing: landing.optional(),
      capabilities: z.array(titled).optional(),
      howItWorks: z.array(titled).optional(),
      scenarios: z.array(titled).optional(),
      integratedScenarios: z.array(slug).optional(),
      components: z.array(z.object({ name: text, description: text })).optional(),
      deployment: z
        .object({
          personnel: z
            .union([z.object({ min: z.number().int().positive(), max: z.number().int().positive(), approx: z.boolean().default(false) }), pending])
            .optional(),
          area: numberOrPending.optional(),
          setupTime: numberOrPending.optional(),
          notes: text.optional(),
        })
        .optional(),
      integratedOps: z.object({ description: text.optional(), products: z.array(slug).optional() }).optional(),
      relatedSolutions: z.array(slug).optional(),
      cta: cta
        .extend({ brochure: z.boolean().default(true), demo: z.boolean().default(true) })
        .optional(),
      seo: seo(ctx),
    }),
});

/** Market domains. Overview text is the Markdown body; related products and articles are reverse lookups. */
const solutions = defineCollection({
  loader: loader("solutions", "solutions"),
  schema: (ctx) =>
    z.object({
      translationStatus,
      draft: z.boolean().default(false),
      order: z.number().int(),
      domain: z.enum(DOMAINS),
      name: text,
      englishName: text,
      summary: text,
      heroDescription: text.optional(),
      image: picture(ctx).optional(),
      challenges: z.array(titled).optional(),
      capabilities: z.array(titled).optional(),
      cta: cta.optional(),
      /** Where the wording comes from (old official site, requirements); not shown on the site. */
      sourceNote: text.optional(),
      seo: seo(ctx),
    }),
});

/** Integrated training scenarios (MUM-T, Counter-UAS). Not products; no pages of their own. */
const scenarios = defineCollection({
  loader: loader("scenarios", "scenarios"),
  schema: z.object({
    translationStatus,
    draft: z.boolean().default(false),
    order: z.number().int(),
    code: text,
    name: text,
    englishName: text.optional(),
    summary: text,
    products: z.array(slug).min(2),
  }),
});

/** Copy for fixed page templates (one entry per page per language). */
const pages = defineCollection({
  loader: loader("pages", "pages"),
  schema: (ctx) =>
    z.object({
      translationStatus,
      seo: z.object({ title: text, description: text }),
      hero: z.object({
        eyebrow: text,
        title: text,
        description: text,
        image: picture(ctx).optional(),
        imageCaption: text.optional(),
      }),
      integrated: z.object({ eyebrow: text, title: text, description: text }).optional(),
      cta: cta.optional(),
    }),
});

/** Fixed tag list; articles can only use these (docs/PHASE-2-PLAN.md §3.5). */
const tags = defineCollection({
  loader: loader("tags", "tags"),
  schema: z.object({ translationStatus, name: text, description: text.optional() }),
});

/** Fields shared by news, insights and case studies (§3.2). The body is the article text. */
const articleBase = (ctx: SchemaContext) =>
  z.object({
    translationStatus,
    draft: z.boolean().default(false),
    publishDate: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    title: text,
    summary: text,
    cover: picture(ctx).optional(),
    tags: slugs,
    relatedProducts: slugs,
    relatedSolutions: slugs,
    relatedNews: slugs,
    relatedInsights: slugs,
    relatedCaseStudies: slugs,
    seo: seo(ctx),
  });

export const NEWS_CATEGORIES = ["company", "exhibition", "award", "product-launch", "partnership", "media"] as const;

const news = defineCollection({
  loader: loader("news", "news"),
  schema: (ctx) =>
    articleBase(ctx).extend({
      category: z.enum(NEWS_CATEGORIES),
      event: z.object({ name: text, location: text.optional(), startDate: z.coerce.date(), endDate: z.coerce.date().optional() }).optional(),
      source: z.object({ name: text, url: z.url() }).optional(),
    }),
});

const insights = defineCollection({
  loader: loader("insights", "insights"),
  schema: (ctx) => articleBase(ctx).extend({ author: text.optional() }),
});

const caseStudies = defineCollection({
  loader: loader("case-studies", "case_studies"),
  schema: (ctx) =>
    articleBase(ctx).extend({
      client: z.object({ name: text, disclosure: z.enum(["public", "anonymized"]) }),
      /** Client authorisation to publish; entries without it are never built. */
      approval: z.object({ approved: z.boolean() }),
      challenge: text.optional(),
      solution: text.optional(),
      outcomes: z.array(z.object({ label: text, value: text })).optional(),
      domains: z.array(z.enum(DOMAINS)).default([]),
    }),
});

export const collections = { products, solutions, scenarios, pages, tags, insights, news, "case-studies": caseStudies };
