/** Market domains used by products, solutions and filters. Kept outside content.config.ts
 * so page code never imports the content configuration at runtime. */
export const DOMAINS = ["military", "police", "fire-rescue", "smart-city"] as const;
export type Domain = (typeof DOMAINS)[number];
/** Product categories: the fields the twelve products actually belong to. Smart City is a
 * solution category only and must never become a product category or filter. */
export const PRODUCT_DOMAINS = ["military", "police", "fire-rescue"] as const;
export type ProductDomain = (typeof PRODUCT_DOMAINS)[number];
/** Case studies can also be filed under "other". */
export const CASE_DOMAINS = [...DOMAINS, "other"] as const;
export type CaseDomain = (typeof CASE_DOMAINS)[number];
