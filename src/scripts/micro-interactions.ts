/** One controller per document, including when a router re-executes the entry script. */
declare global { interface Window { bxrMotionDispose?: () => void } }
export function installMotion() {
  window.bxrMotionDispose?.();
  const events = new AbortController();
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const selector = '.section-head, .section-grid > header, h2:not(.visually-hidden), .page-hero .copy';
  let epoch = 0;
  let main: HTMLElement | null = null;
  let registered = new WeakSet<Element>();
  let intersection: IntersectionObserver | undefined;
  let mutations: MutationObserver | undefined;
  const clear = () => {
    epoch++;
    intersection?.disconnect();
    mutations?.disconnect();
    intersection = undefined;
    mutations = undefined;
    document.querySelectorAll('.motion-enter').forEach(el => el.classList.remove('motion-enter'));
    main = null;
    registered = new WeakSet();
  };
  const register = (root: Element) => {
    const candidates = [...(root.matches(selector) ? [root] : []), ...root.querySelectorAll(selector)];
    for (const el of candidates) {
      // Animate a heading group once, never its nested heading a second time.
      if (el.matches('h2') && el.closest('.section-head, .section-grid > header')) continue;
      if (!main?.contains(el) || registered.has(el)) continue;
      registered.add(el);
      if (!el.contains(document.activeElement)) intersection?.observe(el);
    }
  };
  const initialize = () => {
    const next = document.querySelector<HTMLElement>('main');
    if (next && next === main) return;
    clear();
    if (!next || preference.matches || !('IntersectionObserver' in window)) return;
    main = next;
    const generation = epoch;
    intersection = new IntersectionObserver(entries => {
      if (generation !== epoch || preference.matches) return;
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        intersection?.unobserve(entry.target);
        if (entry.target.isConnected && !entry.target.contains(document.activeElement)) entry.target.classList.add('motion-enter');
      }
    }, { threshold: 0.15 });
    register(main);
    // Observe insertions only: animation classes and unrelated attribute changes never rescan.
    mutations = new MutationObserver(records => {
      for (const record of records) {
        for (const node of record.removedNodes) if (node instanceof Element) {
          intersection?.unobserve(node);
          node.querySelectorAll(selector).forEach(el => intersection?.unobserve(el));
        }
        for (const node of record.addedNodes) if (node instanceof Element) register(node);
      }
    });
    mutations.observe(main, { childList: true, subtree: true });
  };
  document.addEventListener('animationend', event => {
    if (event.animationName === 'bxr-enter') (event.target as Element).classList.remove('motion-enter');
  }, { signal: events.signal });
  document.addEventListener('focusin', event => {
    const group = (event.target as Element).closest(selector);
    if (group) { intersection?.unobserve(group); group.classList.remove('motion-enter'); }
  }, { signal: events.signal });
  preference.addEventListener('change', () => { clear(); initialize(); }, { signal: events.signal });
  window.addEventListener('pagehide', clear, { signal: events.signal });
  window.addEventListener('pageshow', event => {
    if (event.persisted) clear();
    initialize();
  }, { signal: events.signal });
  document.addEventListener('astro:before-swap', clear, { signal: events.signal });
  document.addEventListener('astro:page-load', initialize, { signal: events.signal });
  window.bxrMotionDispose = () => { clear(); events.abort(); };
  initialize();
}
