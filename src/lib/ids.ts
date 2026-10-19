let n = 0;
/** Unique id for aria-describedby / aria-controls pairs within a build. */
export function uid(prefix: string): string {
  n += 1;
  return `${prefix}-${n}`;
}
