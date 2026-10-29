export type HeroVariant = 'split' | 'scene' | 'equipment' | 'interface';
/** All supplied product/solution Hero images share the approved SUT scene treatment. */
export function heroPresentation(_collection: 'products' | 'solutions', _slug: string, hasImage: boolean): HeroVariant {
 if (!hasImage) return 'split';
 if (_collection === 'products' && ['uav','usv','wargaming-table'].includes(_slug)) return 'interface';
 if (_collection === 'products' && ['tactical-boat-simulator','hmmwv-simulator','full-scale-police-training'].includes(_slug)) return 'equipment';
 return 'scene';
}
/** Complete scenes retain heads, shoulders and equipment; background extension blends the edges. */
export function heroSceneFit(_collection: 'products'|'solutions', _slug:string): 'contain' { return 'contain'; }
export function heroScenePosition(collection:'products'|'solutions',slug:string):string {
 if(collection==='products'&&slug==='sniper-simulator')return '100% 80%';
 if(collection==='solutions'&&slug==='police')return '100% 40%';
 return '100% 50%';
}
export function heroSceneHeadroom(_collection:'products'|'solutions',_slug:string):number { return 16; }
