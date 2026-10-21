/**
 * Data for the home page's case-study and news blocks. Both read the published
 * resource-center collections (drafts, future dates and unapproved cases never
 * arrive here; see lib/content.ts), so the home page updates with them.
 */
import type { Lang } from "../i18n";
import { getArticles, type Article } from "./articles";
import { toViews, type CaseView } from "./cases";
import { homeConfig } from "../data/home";

/** Pinned slugs first (in their order), then the newest published cases. */
export function pickFeatured<T extends { slug: string }>(newestFirst: readonly T[], pinned: readonly string[], limit: number): T[] {
  const first = pinned.flatMap((slug) => newestFirst.filter((a) => a.slug === slug));
  const rest = newestFirst.filter((a) => !pinned.includes(a.slug));
  return [...first, ...rest].slice(0, Math.max(0, limit));
}

export async function featuredCases(lang: Lang, limit: number = homeConfig.caseCount): Promise<CaseView[]> {
  const all = (await getArticles("case-studies", lang)).filter((a) => !a.pendingTranslation);
  return toViews(pickFeatured(all, homeConfig.featuredCases, limit), lang);
}

/** Newest published news in this language, by publishDate. */
export async function latestNews(lang: Lang, limit: number = homeConfig.newsCount): Promise<Article[]> {
  return (await getArticles("news", lang)).filter((a) => !a.pendingTranslation).slice(0, Math.max(0, limit));
}
