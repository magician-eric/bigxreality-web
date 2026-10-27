export type HeroVariant = 'split' | 'scene' | 'equipment' | 'interface';
/** Opt-in after inspecting existing sources; absent/unfit media keeps the text/image layout. */
export function heroPresentation(collection: 'products' | 'solutions', slug: string, hasImage: boolean): HeroVariant {
 if (!hasImage) return 'split';
 if (collection === 'solutions') return ['military','police'].includes(slug) ? 'scene' : slug === 'smart-city' ? 'interface' : 'split';
 if (slug === 'sut') return 'scene';
 return slug === 'wargaming-table' ? 'interface' : 'equipment';
}
