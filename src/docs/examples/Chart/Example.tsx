import { Chart } from 'chart';

const DAY = 86400000;
const start = Date.UTC(2026, 0, 1);

let value = 100;
const history = Array.from({ length: 120 }, (_, i) => {
  value += Math.sin(i / 8) * 2 + 0.3;
  return [start + i * DAY, Math.round(value * 100) / 100];
});
const last = history[history.length - 1];
const forecast = Array.from({ length: 45 }, (_, i) => [
  last[0] + (i + 1) * DAY,
  Math.round((last[1] + (i + 1) * 0.4) * 100) / 100,
]);
const band = forecast.map(([x, y], i) => [x, y - (i + 1) * 0.5, y + (i + 1) * 0.6]);

export default () => (
  <div style={{ maxWidth: 640, display: 'grid', gap: 16 }}>
    <Chart
      title="Price with a 45-day forecast"
      unit="USD"
      series={[
        { name: 'Price', points: history },
        { name: 'Forecast', style: 'dashed', points: forecast },
      ]}
      bands={[{ name: 'p10–p90', points: band }]}
      source={{ name: 'Demo data' }}
    />
    <Chart
      kind="bar"
      title="Revenue"
      unit="EUR"
      series={[
        { name: '2025', points: [['Q1', 120000], ['Q2', 154000], ['Q3', 171000], ['Q4', 198000]] },
        { name: '2026 plan', style: 'dashed', points: [['Q1', 160000], ['Q2', 180000], ['Q3', 200000], ['Q4', 230000]] },
      ]}
    />
    <Chart
      kind="pie"
      title="Portfolio"
      unit="USD"
      series={[{ name: 'Value', points: [['BTC', 52000], ['ETH', 21000], ['SOL', 9000], ['Cash', 6000]] }]}
    />
  </div>
);
