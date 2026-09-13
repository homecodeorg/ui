import * as T from './Resizer.types';

export type ParsedMin =
  | { kind: 'pct'; value: number }
  | { kind: 'px'; value: number };

export function parseMinWidth(
  value: T.SizeValue | undefined
): ParsedMin | null {
  if (value == null || value === '') return null;
  if (typeof value === 'number') {
    return Number.isFinite(value) && value > 0 ? { kind: 'pct', value } : null;
  }
  const s = String(value).trim().toLowerCase();
  const n = parseFloat(s);
  if (!Number.isFinite(n) || n <= 0) return null;
  if (s.endsWith('px')) return { kind: 'px', value: n };
  return { kind: 'pct', value: n };
}

export function isPxMin(value: T.SizeValue | undefined) {
  return parseMinWidth(value)?.kind === 'px';
}

export function minToPct(value: T.SizeValue | undefined, totalPx: number) {
  const parsed = parseMinWidth(value);
  if (!parsed) return 0;
  if (parsed.kind === 'pct') return parsed.value;
  return totalPx > 0 ? (parsed.value / totalPx) * 100 : 0;
}

export function clampPair(
  nextLeft: number,
  combined: number,
  minLeft: number,
  minRight: number
) {
  const maxLeft = combined - minRight;
  if (minLeft > maxLeft) return null;
  return Math.min(Math.max(nextLeft, minLeft), maxLeft);
}

export function clampAll(sizes: number[], mins: number[]) {
  const next = sizes.slice();
  const minSum = mins.reduce((sum, n) => sum + n, 0);
  if (minSum >= 100 && minSum > 0) {
    return mins.map(n => (n / minSum) * 100);
  }

  for (let i = 0; i < next.length; i++) {
    const deficit = mins[i] - next[i];
    if (deficit <= 0) continue;
    let need = deficit;
    for (let j = 0; j < next.length && need > 0; j++) {
      if (j === i) continue;
      const slack = next[j] - mins[j];
      if (slack <= 0) continue;
      const take = Math.min(slack, need);
      next[j] -= take;
      need -= take;
    }
    next[i] += deficit - need;
  }

  return next;
}
