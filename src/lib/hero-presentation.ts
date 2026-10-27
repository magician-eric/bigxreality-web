export type HeroVariant = 'split' | 'scene' | 'equipment' | 'interface';
/** All supplied product/solution Hero images share the approved SUT scene treatment. */
export function heroPresentation(_collection: 'products' | 'solutions', _slug: string, hasImage: boolean): HeroVariant {
 return hasImage ? 'scene' : 'split';
}

/** Preserve complete equipment/interface subjects while keeping the shared background composition. */
export function heroSceneFit(collection: 'products' | 'solutions', slug: string): 'cover' | 'contain' {
 return (collection === 'products' && slug === 'sut') || (collection === 'solutions' && ['military','police'].includes(slug)) ? 'cover' : 'contain';
}
