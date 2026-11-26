import { fireEvent, render } from '@testing-library/react';

import { Chart } from './Chart';
import {
  chartRows,
  formatValue,
  timeFormatter,
  withJoins,
} from './Chart.helpers';
import type { ChartBand, ChartSeries } from './Chart.types';

const DAY = 86_400_000;
const T0 = Date.UTC(2026, 4, 1);
const t = (i: number) => T0 + i * DAY;

describe('Chart helpers', () => {
  const history: ChartSeries = {
    name: 'History',
    points: [
      [t(0), 10],
      [t(1), 12],
    ],
  };
  const forecast: ChartSeries = {
    name: 'Forecast',
    style: 'dashed',
    points: [
      [t(2), 13],
      [t(3), 15],
    ],
  };
  const band: ChartBand = {
    name: 'p10–p90',
    points: [
      [t(2), 11, 15],
      [t(3), 18, 12],
    ],
  };

  test('a forecast starts at the last real point and its band fans out from it', () => {
    const { series, bands } = withJoins([history, forecast], [band]);
    expect(series[0]).toBe(history);
    expect(series[1].points[0]).toEqual([t(1), 12]);
    expect(bands[0].points[0]).toEqual([t(1), 12, 12]);

    expect(chartRows(series, bands)).toEqual([
      { x: t(0), s0: 10 },
      { x: t(1), s0: 12, s1: 12, b0: [12, 12] },
      { x: t(2), s1: 13, b0: [11, 15] },
      { x: t(3), s1: 15, b0: [12, 18] },
    ]);
  });

  test('no join when the history to continue is ambiguous', () => {
    const other = { ...history, name: 'Other' };
    const { series } = withJoins([history, other, forecast]);
    expect(series[2]).toBe(forecast);
    const named = withJoins([
      history,
      other,
      { ...forecast, continues: 'Other' },
    ]);
    expect(named.series[2].points[0]).toEqual([t(1), 12]);
  });

  test('time points a few seconds apart share a row', () => {
    const rows = chartRows([
      { name: 'BTC', points: [0, 1, 2].map(i => [t(i), 10 + i]) },
      { name: 'ETH', points: [0, 2].map(i => [t(i) + 5_000, 20 + i]) },
    ]);
    expect(rows).toEqual([
      { x: t(0), s0: 10, s1: 20 },
      { x: t(1), s0: 11 },
      { x: t(2), s0: 12, s1: 22 },
    ]);
  });

  test('category rows join by label in first-seen order', () => {
    expect(
      chartRows(
        [
          {
            name: 'A',
            points: [
              ['Q1', 1],
              ['Q2', 2],
            ],
          },
          {
            name: 'B',
            points: [
              ['Q2', 5],
              ['Q3', 6],
            ],
          },
        ],
        [],
        'category'
      )
    ).toEqual([
      { x: 'Q1', s0: 1 },
      { x: 'Q2', s0: 2, s1: 5 },
      { x: 'Q3', s1: 6 },
    ]);
  });

  test('formats values and dates for the span', () => {
    expect(formatValue(78123.4, 'USD', false, 'en-US')).toBe('$78,123');
    expect(formatValue(78123.4, 'USD', true, 'en-US')).toBe('$78.1K');
    expect(formatValue(-3.456, '%', false, 'en-US')).toBe('-3.46%');
    expect(formatValue(21.5, '°C', false, 'en-US')).toBe('21.5 °C');
    const halfYear = timeFormatter([{ x: T0 }, { x: T0 + 180 * DAY }], 'en-US');
    expect(halfYear(T0)).toBe('May 1');
    expect(halfYear(T0, true)).toBe('May 1, 2026');
    const years = timeFormatter([{ x: T0 }, { x: T0 + 900 * DAY }], 'en-US');
    expect(years(T0)).toBe('May 2026');
  });
});

describe('Chart', () => {
  test('renders the title, legend and source', () => {
    const { container, getByText } = render(
      <Chart
        title="BTC"
        unit="USD"
        series={[
          {
            name: 'History',
            points: [
              [T0, 1],
              [t(1), 2],
            ],
          },
          { name: 'Forecast', style: 'dashed', points: [[t(2), 3]] },
        ]}
        bands={[{ name: 'Range', points: [[t(2), 2, 4]] }]}
        source={{ name: 'CoinGecko', url: 'https://www.coingecko.com' }}
      />
    );
    expect(getByText('BTC')).toBeTruthy();
    expect(getByText('Forecast')).toBeTruthy();
    expect(getByText('Range')).toBeTruthy();
    expect(getByText('CoinGecko').getAttribute('href')).toBe(
      'https://www.coingecko.com'
    );
    expect(container.querySelector('figure')).toBeTruthy();
  });

  test('legend items toggle their series off and on', () => {
    const { getByText } = render(
      <Chart
        series={[
          {
            name: 'A',
            points: [
              [T0, 1],
              [t(1), 2],
            ],
          },
          {
            name: 'B',
            points: [
              [T0, 3],
              [t(1), 4],
            ],
          },
        ]}
      />
    );
    const a = getByText('A').closest('button')!;
    expect(a.getAttribute('aria-pressed')).toBe('true');
    fireEvent.click(a);
    expect(a.getAttribute('aria-pressed')).toBe('false');
    fireEvent.click(a);
    expect(a.getAttribute('aria-pressed')).toBe('true');
  });
});
