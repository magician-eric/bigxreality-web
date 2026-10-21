/** Number of alternating-background sections LandingSections renders for a landing block (the values band is dark and not counted). */
export function alternatingSections(L: { challenge?: unknown; approach?: unknown; capabilities?: unknown; featured?: unknown; flow?: unknown; scenarios?: unknown; audience?: unknown }): number {
  return [L.challenge, L.approach, L.capabilities, L.featured, L.flow, L.scenarios, L.audience].filter(Boolean).length;
}
