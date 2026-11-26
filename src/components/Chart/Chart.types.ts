export type ChartKind = 'line' | 'area' | 'bar' | 'pie';

// x is epoch ms for time charts, a label for category charts
export type ChartPoint = [x: number | string, y: number];

// One step of a band: the low and high value at x (e.g. the p10 and p90 quantiles)
export type ChartBandPoint = [x: number | string, low: number, high: number];

export type ChartSeries = {
  name: string;
  points: ChartPoint[];
  // dashed: a forecast or projection
  style?: 'solid' | 'dashed';
  // Name of the series this one carries on from: the line starts at that
  // series' last point. Defaults to the only solid series for a dashed one.
  continues?: string;
  // Any CSS color; defaults to the palette
  color?: string;
};

export type ChartBand = {
  name: string;
  points: ChartBandPoint[];
  // Series the band surrounds (its color), e.g. the forecast. Defaults to the
  // first dashed series.
  of?: string;
  // Series the band fans out from: it starts at zero width on that series'
  // last point (a cone). Defaults like ChartSeries.continues.
  continues?: string;
  color?: string;
};

export type ChartSource = {
  name: string;
  url?: string;
};

export type Props = {
  // Default line
  kind?: ChartKind;
  // time: x is epoch ms; category: x is a label. Default time for line and
  // area, category for bar and pie.
  xType?: 'time' | 'category';
  title?: React.ReactNode;
  // Unit of the values: "USD", "EUR" and "%" get a sign, others a suffix
  unit?: string;
  series: ChartSeries[];
  // Ranges drawn as shaded areas (line and area charts)
  bands?: ChartBand[];
  // Shown under the chart, linked when it has a url
  source?: ChartSource;
  // Plot height in px (default 260, 210 on narrow screens)
  height?: number;
  // Locale for numbers and dates (default: the browser's)
  locale?: string;
  // Series colors in order (CSS colors); the first defaults to --active-color
  colors?: string[];
  // Drag across the plot to zoom into a time range, double-click to reset
  // (time charts; default true)
  zoom?: boolean;
  // Text of the button that resets the zoom (shown while zoomed)
  resetZoomLabel?: string;
  className?: string;
};
