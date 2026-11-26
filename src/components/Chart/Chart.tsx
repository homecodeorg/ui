import cn from 'classnames';
import { useEffect, useMemo, useState } from 'react';
import {
  Area,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  Pie,
  PieChart,
  ReferenceArea,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import {
  DEFAULT_COLORS,
  bandKey,
  chartRows,
  defaultXType,
  formatValue,
  seriesKey,
  timeFormatter,
  withJoins,
} from './Chart.helpers';
import type { Props } from './Chart.types';
import S from './Chart.styl';

const LABEL_COLOR = 'var(--accent-color-alpha-700)';
const TICK = { fill: LABEL_COLOR, fontSize: 11 };
const TOOLTIP_STYLE = {
  background: 'var(--decent-color, #1a1a1a)',
  border: '1px solid var(--accent-color-alpha-100)',
  borderRadius: 8,
  fontSize: 12,
};
const MARGIN = { top: 8, right: 8, left: 0, bottom: 0 };

/**
 * Line, area, bar or pie chart from plain series, with optional dashed
 * forecasts and shaded bands (e.g. quantile ranges that fan out from the last
 * real point). Needs `recharts` (an optional peer dependency), so it is
 * imported from `@homecode/ui/chart`.
 */
export function Chart({
  kind = 'line',
  xType = defaultXType(kind),
  title,
  unit,
  series: rawSeries,
  bands: rawBands = [],
  source,
  height,
  locale,
  colors = DEFAULT_COLORS,
  zoom = true,
  resetZoomLabel = 'Reset zoom',
  className,
}: Props) {
  const isTime = xType === 'time';
  const bandsAllowed = kind === 'line' || kind === 'area';

  const { series, bands } = useMemo(
    () => withJoins(rawSeries, bandsAllowed ? rawBands : [], xType),
    [rawSeries, rawBands, bandsAllowed, xType]
  );
  const rows = useMemo(
    () => chartRows(series, bands, xType),
    [series, bands, xType]
  );

  // Zoom (time charts): drag across the plot to pick a range, double-click to reset.
  const canZoom = zoom && kind !== 'pie' && isTime;
  const [range, setRange] = useState<[number, number] | null>(null);
  const [drag, setDrag] = useState<{ from: number; to: number } | null>(null);
  // Reset only when the data really changes: hosts often pass new arrays with
  // the same points on every render (e.g. parsed from a message).
  const dataKey = `${rows.length}:${rows[0]?.x}:${rows[rows.length - 1]?.x}`;
  useEffect(() => {
    setRange(null);
    setDrag(null);
  }, [dataKey]);
  const visibleRows = useMemo(
    () => (range ? rows.slice(range[0], range[1] + 1) : rows),
    [rows, range]
  );
  const formatTime = useMemo(
    () => timeFormatter(visibleRows, locale),
    [visibleRows, locale]
  );

  type PointerState = { activeLabel?: string | number } | null;
  const rowIndex = (e: PointerState) => {
    if (e?.activeLabel === undefined || e.activeLabel === null) return -1;
    const label = String(e.activeLabel);
    return visibleRows.findIndex(r => String(r.x) === label);
  };
  const zoomHandlers = canZoom
    ? {
        onMouseDown: (e: PointerState) => {
          const i = rowIndex(e);
          if (i >= 0) setDrag({ from: i, to: i });
        },
        onMouseMove: (e: PointerState) => {
          if (!drag) return;
          const i = rowIndex(e);
          if (i >= 0 && i !== drag.to) setDrag({ ...drag, to: i });
        },
        onMouseUp: () => {
          if (!drag) return;
          const lo = Math.min(drag.from, drag.to);
          const hi = Math.max(drag.from, drag.to);
          setDrag(null);
          if (hi - lo < 1) return;
          const offset = range ? range[0] : 0;
          setRange([offset + lo, offset + hi]);
        },
        onMouseLeave: () => setDrag(null),
      }
    : {};
  const selection =
    drag && drag.from !== drag.to ? (
      <ReferenceArea
        key="selection"
        x1={visibleRows[drag.from].x}
        x2={visibleRows[drag.to].x}
        fill="var(--accent-color-alpha-200)"
        fillOpacity={1}
        strokeOpacity={0}
        ifOverflow="hidden"
      />
    ) : null;

  const color = (i: number) =>
    series[i]?.color ?? colors[i % colors.length] ?? DEFAULT_COLORS[0];
  const bandColor = (i: number) => {
    const band = bands[i];
    if (band.color) return band.color;
    const of = band.of
      ? series.findIndex(s => s.name === band.of)
      : series.findIndex(s => s.style === 'dashed');
    return color(of >= 0 ? of : 0);
  };

  const fmt = (v: number, compact = false) =>
    formatValue(v, unit, compact, locale);
  const xTick = (x: number | string) =>
    isTime ? formatTime(Number(x)) : String(x);
  const tooltipLabel = (x: number | string) =>
    isTime ? formatTime(Number(x), true) : String(x);
  // recharts passes the `name` prop as the second argument
  const tooltipValue = (value: number | [number, number], name: string) => [
    Array.isArray(value)
      ? `${fmt(Number(value[0]))} – ${fmt(Number(value[1]))}`
      : fmt(Number(value)),
    name,
  ];

  const axes = [
    <CartesianGrid
      key="grid"
      stroke="var(--accent-color-alpha-100)"
      vertical={false}
    />,
    <XAxis
      key="x"
      dataKey="x"
      type={isTime ? 'number' : 'category'}
      scale={isTime ? 'time' : 'auto'}
      domain={isTime ? ['dataMin', 'dataMax'] : undefined}
      tickFormatter={xTick}
      tick={TICK}
      tickLine={false}
      axisLine={false}
      minTickGap={28}
    />,
    <YAxis
      key="y"
      tick={TICK}
      tickFormatter={v => fmt(Number(v), true)}
      tickLine={false}
      axisLine={false}
      width={56}
      domain={kind === 'bar' ? [0, 'auto'] : ['auto', 'auto']}
    />,
    <Tooltip
      key="tooltip"
      contentStyle={TOOLTIP_STYLE}
      labelStyle={{ color: LABEL_COLOR }}
      labelFormatter={tooltipLabel}
      formatter={tooltipValue}
      cursor={
        kind === 'bar'
          ? { fill: 'var(--accent-color-alpha-100)' }
          : { stroke: 'var(--accent-color-alpha-300)' }
      }
    />,
  ];

  let body: React.ReactElement;
  if (kind === 'pie') {
    const slices = (series[0]?.points ?? []).map(([x, y]) => ({
      name: isTime ? formatTime(Number(x), true) : String(x),
      value: y,
    }));
    body = (
      <PieChart>
        <Pie
          data={slices}
          dataKey="value"
          nameKey="name"
          innerRadius="45%"
          outerRadius="80%"
          stroke="none"
          label={({ name }) => name}
          labelLine={false}
          fontSize={11}
          isAnimationActive={false}
        >
          {slices.map((s, i) => (
            <Cell key={s.name} fill={colors[i % colors.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={TOOLTIP_STYLE}
          formatter={(value: number, name: string) => [
            fmt(Number(value)),
            name,
          ]}
        />
      </PieChart>
    );
  } else if (kind === 'bar') {
    body = (
      <BarChart data={visibleRows} margin={MARGIN} {...zoomHandlers}>
        {axes}
        {selection}
        {series.map((s, i) => (
          <Bar
            key={seriesKey(i)}
            dataKey={seriesKey(i)}
            name={s.name}
            fill={color(i)}
            fillOpacity={s.style === 'dashed' ? 0.5 : 1}
            radius={[4, 4, 0, 0]}
            isAnimationActive={false}
          />
        ))}
      </BarChart>
    );
  } else {
    body = (
      <ComposedChart data={visibleRows} margin={MARGIN} {...zoomHandlers}>
        {axes}
        {selection}
        {bands.map((b, i) => (
          <Area
            key={bandKey(i)}
            dataKey={bandKey(i)}
            name={b.name}
            type="monotone"
            stroke="none"
            fill={bandColor(i)}
            fillOpacity={0.18}
            connectNulls
            activeDot={false}
            isAnimationActive={false}
          />
        ))}
        {series.map((s, i) => {
          const dashed = s.style === 'dashed';
          const common = {
            dataKey: seriesKey(i),
            name: s.name,
            type: 'monotone' as const,
            stroke: color(i),
            strokeWidth: 2,
            strokeDasharray: dashed ? '6 4' : undefined,
            connectNulls: true,
            isAnimationActive: false,
          };
          return kind === 'area' && !dashed ? (
            <Area
              key={seriesKey(i)}
              {...common}
              fill={color(i)}
              fillOpacity={series.length > 1 ? 0.15 : 0.3}
            />
          ) : (
            <Line
              key={seriesKey(i)}
              {...common}
              dot={visibleRows.length <= 24}
            />
          );
        })}
      </ComposedChart>
    );
  }

  const legend =
    kind === 'pie'
      ? []
      : series.length + bands.length > 1 || series[0]?.name
        ? [
            ...series.map((s, i) => ({
              name: s.name,
              color: color(i),
              dashed: s.style === 'dashed',
              band: false,
            })),
            ...bands.map((b, i) => ({
              name: b.name,
              color: bandColor(i),
              dashed: false,
              band: true,
            })),
          ]
        : [];

  return (
    <figure className={cn(S.root, className)}>
      {(title || legend.length > 0) && (
        <figcaption className={S.header}>
          {title && <span className={S.title}>{title}</span>}
          {legend.length > 0 && (
            <span className={S.legend}>
              {legend.map(item => (
                <span key={item.name} className={S.legendItem}>
                  <i
                    className={cn(
                      S.swatch,
                      item.dashed && S.dashed,
                      item.band && S.band
                    )}
                    style={{ color: item.color }}
                  />
                  {item.name}
                </span>
              ))}
            </span>
          )}
        </figcaption>
      )}
      <div
        className={cn(S.plot, canZoom && S.zoomable)}
        style={height ? { height } : undefined}
        onDoubleClick={canZoom ? () => setRange(null) : undefined}
      >
        {range && (
          <button
            type="button"
            className={S.resetZoom}
            onClick={() => setRange(null)}
          >
            {resetZoomLabel}
          </button>
        )}
        <ResponsiveContainer width="100%" height="100%">
          {body}
        </ResponsiveContainer>
      </div>
      {source && (
        <div className={S.source}>
          {source.url ? (
            <a href={source.url} target="_blank" rel="noreferrer">
              {source.name}
            </a>
          ) : (
            source.name
          )}
        </div>
      )}
    </figure>
  );
}
