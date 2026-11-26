import { Chart } from 'chart';

const DAY = 86400000;
const start = Date.UTC(2026, 0, 1);

let value = 100;
const history = Array.from({ length: 120 }, (_, i) => {
  value += Math.sin(i / 8) * 2 + 0.3;
  return [start + i * DAY, Math.round(value * 100) / 100];
});
const [lastX, lastY] = history[history.length - 1];

// The forecast and its quantiles start after the last real point. Chart joins
// them to it: the dashed line starts there and the bands fan out from it.
const days = Array.from({ length: 60 }, (_, i) => i + 1);
const median = days.map(d => [lastX + d * DAY, lastY + d * 0.35]);
const band = spread =>
  median.map(([x, y], i) => [
    x,
    y - spread * Math.sqrt(i + 1),
    y + spread * 1.2 * Math.sqrt(i + 1),
  ]);

export default () => (
  <div style={{ maxWidth: 640 }}>
    <Chart
      title="Demand, 60-day forecast"
      unit="t"
      series={[
        { name: 'Actual', points: history },
        { name: 'Forecast', style: 'dashed', points: median },
      ]}
      bands={[
        { name: 'p10–p90', points: band(1.6) },
        { name: 'p25–p75', points: band(0.8) },
      ]}
    />
    <p style={{ opacity: 0.7, fontSize: 13 }}>
      Drag across the chart to zoom in, double-click to reset.
    </p>
  </div>
);
