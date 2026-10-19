import { defineCollection, type SchemaContext } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { PENDING } from "./lib/pending";

/*
 * Folder layout follows Decap CMS `i18n.structure: multiple_folders`:
 *   src/content/<collection>/<lang>/<slug>.md
 * Entry ids are therefore `<lang>/<slug>`. Relations store bare slugs and are
 * checked at build time in src/lib/content.ts (unknown slugs fail the build).
 * Structural fields (order, domains, relations, dates, draft) are read from the
 * `tw` file only; see docs/PLAN.md §2.1.
 */

export const DOMAINS = ["military", "police", "fire-rescue", "smart-city"] as const;

const pending = z.literal(PENDING);
const text = z.string().min(1);
const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug: lowercase letters, digits and hyphens");
const translationStatus = z.enum(["source", "pending", "translated"]);
/** Numeric field that may hold the PENDING marker until the value is known. */
const numberOrPending = z.union([z.number().nonnegative(), pending]);

/** An image always carries alt text (WCAG 1.1.1). */
const picture = ({ image }: SchemaContext) => z.object({ src: image(), alt: text });

const titled = z.object({ title: text, description: text });

const products = defineCollection({
  loader: glob({ pattern: "*/*.md", base: "./src/content/products" }),
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
      cta: z
        .object({
          title: text,
          description: text,
          brochure: z.boolean().default(true),
          demo: z.boolean().default(true),
        })
        .optional(),
      seo: z
        .object({
          title: text.optional(),
          description: text.optional(),
          ogImage: ctx.image().optional(),
        })
        .optional(),
    }),
});

const solutions = defineCollection({
  loader: glob({ pattern: "*/*.md", base: "./src/content/solutions" }),
  schema: (ctx) =>
    z.object({
      translationStatus,
      draft: z.boolean().default(false),
      order: z.number().int(),
      domain: z.enum(DOMAINS),
      name: text,
      englishName: text,
      summary: text,
      image: picture(ctx).optional(),
    }),
});

/** Integrated training scenarios (MUM-T, Counter-UAS). Not products; no pages of their own. */
const scenarios = defineCollection({
  loader: glob({ pattern: "*/*.md", base: "./src/content/scenarios" }),
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

/** Copy for fixed page templates (one file per page per language). */
const pages = defineCollection({
  loader: glob({ pattern: "*/*.md", base: "./src/content/pages" }),
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
      cta: z.object({ title: text, description: text }).optional(),
    }),
});

/** Articles: only the fields the product page reverse lookup needs in phase 1. */
const article = (ctx: SchemaContext) =>
  z.object({
    translationStatus,
    draft: z.boolean().default(false),
    publishDate: z.coerce.date(),
    title: text,
    summary: text,
    cover: picture(ctx).optional(),
    tags: z.array(slug).default([]),
    relatedProducts: z.array(slug).default([]),
    relatedSolutions: z.array(slug).default([]),
  });

const insights = defineCollection({ loader: glob({ pattern: "*/*.md", base: "./src/content/insights" }), schema: article });
const news = defineCollection({ loader: glob({ pattern: "*/*.md", base: "./src/content/news" }), schema: article });
const caseStudies = defineCollection({ loader: glob({ pattern: "*/*.md", base: "./src/content/case-studies" }), schema: article });

export const collections = { products, solutions, scenarios, pages, insights, news, "case-studies": caseStudies };
