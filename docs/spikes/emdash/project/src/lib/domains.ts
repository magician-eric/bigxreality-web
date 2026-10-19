/** Market domains used by products, solutions and filters. Kept outside content.config.ts
 * so page code never imports the content configuration at runtime. */
export const DOMAINS = ["military", "police", "fire-rescue", "smart-city"] as const;
export type Domain = (typeof DOMAINS)[number];
