import { plain } from './text.ts';
/** Stored base titles retain their own separators; only terminal brand suffixes are removed. */
export function seoTitle(title: string): string {
  let base = plain(title);
  const suffix = /\s*[|｜]\s*(?:Big\s*x\s*Reality|BXR)\s*$/i;
  while (suffix.test(base)) base = base.replace(suffix, '').trim();
  return `${base} | Big x Reality`;
}
