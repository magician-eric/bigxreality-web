export type HeroVariant = 'split' | 'scene' | 'equipment' | 'interface';
/** All supplied product/solution Hero images share the approved SUT scene treatment. */
export function heroPresentation(_collection: 'products' | 'solutions', _slug: string, hasImage: boolean): HeroVariant {
 return hasImage ? 'scene' : 'split';
}

/** Scene imagery fills the Hero; tall equipment/diagrams blend through a masked image layer. */
export function heroSceneFit(collection: 'products' | 'solutions', slug: string): 'cover' | 'contain' {
 const complete = collection === 'products' ? ['tactical-boat-simulator','fire-extinguisher-simulator','wargaming-table','full-scale-police-training'].includes(slug) : slug === 'fire-rescue';
 return complete ? 'contain' : 'cover';
}
/** Reviewed focal positions keep heads below the top crop and prone subjects in view. */
export function heroScenePosition(collection: 'products' | 'solutions', slug: string): string {
 if (collection === 'products') {
  if (slug === 'sniper-simulator') return '58% 90%';
  if (slug === 'machine-gun-simulator') return '58% 60%';
  if (slug === 'mortar-observation') return '58% 40%';
  if (slug === 'uav') return '62% 40%';
 }
 if (collection === 'solutions' && slug === 'smart-city') return '60% 45%';
 return '60% 0%';
}
export function heroSceneHeadroom(_collection: 'products' | 'solutions', _slug: string): number { return 24; }
