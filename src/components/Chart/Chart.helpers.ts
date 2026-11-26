import type {
  ChartBand,
  ChartBandPoint,
  ChartPoint,
  ChartSeries,
  Props,
} from './Chart.types';

/** One row per x for recharts: `x`, `s<i>` per series, `b<i>` per band. */
export type ChartRow = { x: number | string } & Record<
  string,
  number | string | [number, number] | null
>;

export const seriesKey = (i: number) => `s${i}`;
export const bandKey = (i: number) => `b${i}`;

export const DEFAULT_COLORS = [
  'var(--active-color)',
  '#e5a50a',
  '#3584e4',
  '#c061cb',
  '#2ec27e',
  '#e66100',
];

export function defaultXType(kind: Props['kind']): 'time' | 'category' {
  return kind === 'bar' || kind === 'pie' ? 'category' : 'time';
}

function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
}

/**
 * The series a dashed series or a band carries on from: the named one, else
 * the only solid series, else none (it starts on its own first point).
 */
function continuedSeries(
  series: ChartSeries[],
  continues: string | undefined,
  self?: ChartSeries
): ChartSeries | undefined {
  if (continues) {
    return series.find(s => s.name === continues && s !== self);
  }
  const solid = series.filter(s => s.style !== 'dashed' && s !== self);
  return solid.length === 1 ? solid[0] : undefined;
}

const xNum = (x: number | string) => Number(x);

/**
 * Series and bands with their joins: a continuing series starts at its
 * history's last point, a band starts there at zero width (the cone).
 */
export function withJoins(
  series: ChartSeries[],
  bands: ChartBand[] = [],
  xType: 'time' | 'category' = 'time'
): { series: ChartSeries[]; bands: ChartBand[] } {
  if (xType !== 'time') return { series, bands };

  const joinedSeries = series.map(s => {
    if (s.style !== 'dashed' && !s.continues) return s;
    const from = continuedSeries(series, s.continues, s);
    const last = from?.points[from.points.length - 1];
    const first = s.points[0];
    if (!last || !first || xNum(last[0]) >= xNum(first[0])) return s;
    return { ...s, points: [last, ...s.points] as ChartPoint[] };
  });

  const joinedBands = bands.map(b => {
    const from = continuedSeries(series, b.continues);
    const last = from?.points[from.points.length - 1];
    const first = b.points[0];
    if (!last || !first || xNum(last[0]) >= xNum(first[0])) return b;
    const cone: ChartBandPoint = [last[0], last[1], last[1]];
    return { ...b, points: [cone, ...b.points] };
  });

  return { series: joinedSeries, bands: joinedBands };
}

/**
 * Rows for a shared x axis. Category charts join by label in first-seen order.
 * Time charts merge x values closer than half a typical step (sources rarely
 * share timestamps exactly, e.g. two coins fetched a few seconds apart).
 */
export function chartRows(
  series: ChartSeries[],
  bands: ChartBand[] = [],
  xType: 'time' | 'category' = 'time'
): ChartRow[] {
  type Entry = { x: number | string; key: string; value: ChartRow[string] };
  const entries: Entry[] = [];
  series.forEach((s, i) =>
    s.points.forEach(([x, y]) =>
      entries.push({ x, key: seriesKey(i), value: y })
    )
  );
  bands.forEach((b, i) =>
    b.points.forEach(([x, low, high]) =>
      entries.push({
        x,
        key: bandKey(i),
        value: [Math.min(low, high), Math.max(low, high)],
      })
    )
  );

  if (xType === 'category') {
    const rows = new Map<string, ChartRow>();
    for (const { x, key, value } of entries) {
      const label = String(x);
      const row = rows.get(label) ?? { x: label };
      row[key] = value;
      rows.set(label, row);
    }
    return [...rows.values()];
  }

  const longest = [...series.map(s => s.points), ...bands.map(b => b.points)]
    .map(points => points.map(p => xNum(p[0])).sort((a, b) => a - b))
    .reduce<number[]>((a, b) => (b.length > a.length ? b : a), []);
  const steps = longest.slice(1).map((x, i) => x - longest[i]);
  const tolerance = Math.max(median(steps) / 2, 0);

  const xs = [...new Set(entries.map(e => xNum(e.x)))].sort((a, b) => a - b);
  // Each x maps to the first x of its cluster.
  const clusterOf = new Map<number, number>();
  let start = Number.NEGATIVE_INFINITY;
  for (const x of xs) {
    if (x - start > tolerance) start = x;
    clusterOf.set(x, start);
  }

  const rows = new Map<number, ChartRow>();
  for (const { x, key, value } of entries) {
    const at = clusterOf.get(xNum(x)) as number;
    const row = rows.get(at) ?? { x: at };
    row[key] = value;
    rows.set(at, row);
  }
  return [...rows.values()].sort((a, b) => xNum(a.x) - xNum(b.x));
}

const DAY = 86_400_000;

/** Axis/tooltip label for a time x, detailed enough for the chart's span. */
export function timeFormatter(
  rows: ChartRow[],
  locale?: string
): (x: number, detailed?: boolean) => string {
  const xs = rows.map(r => xNum(r.x));
  const span = xs.length ? Math.max(...xs) - Math.min(...xs) : 0;
  const axis: Intl.DateTimeFormatOptions =
    span <= 2 * DAY
      ? { hour: '2-digit', minute: '2-digit' }
      : span <= 400 * DAY
        ? { month: 'short', day: 'numeric' }
        : { month: 'short', year: 'numeric' };
  const detail: Intl.DateTimeFormatOptions =
    span <= 2 * DAY
      ? { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
      : { year: 'numeric', month: 'short', day: 'numeric' };
  const axisFmt = new Intl.DateTimeFormat(locale, axis);
  const detailFmt = new Intl.DateTimeFormat(locale, detail);
  return (x, detailed) => (detailed ? detailFmt : axisFmt).format(new Date(x));
}

/** Value with its unit; `compact` shortens big axis numbers (78K, 1.2M). */
export function formatValue(
  value: number,
  unit?: string,
  compact = false,
  locale?: string
): string {
  const abs = Math.abs(value);
  const short = compact && abs >= 10_000;
  const text = new Intl.NumberFormat(locale, {
    ...(short ? { notation: 'compact' as const } : {}),
    maximumFractionDigits: short ? 1 : abs >= 100 ? 0 : abs >= 1 ? 2 : 6,
  }).format(value);
  if (!unit) return text;
  if (unit === '%') return `${text}%`;
  if (unit === 'USD' || unit === '$') return `$${text}`;
  if (unit === 'EUR' || unit === '€') return `€${text}`;
  return `${text} ${unit}`;
}
