import { Chart } from 'chart';

const DAY = 86400000;
const start = Date.UTC(2026, 5, 1);

// Points of different series don't have to share timestamps exactly:
// x values closer than half a step land on the same row.
const wave = (amp, period, drift, shift = 0) =>
  Array.from({ length: 120 }, (_, i) => [
    start + i * DAY + shift,
    Math.round((Math.sin(i / period) * amp + i * drift) * 100) / 100,
  ]);

export default () => (
  <div style={{ maxWidth: 640 }}>
    <Chart
      kind="area"
      title="Change since June 1"
      unit="%"
      series={[
        { name: 'BTC', points: wave(12, 9, 0.1) },
        { name: 'ETH', points: wave(18, 14, 0.05, 4000) },
        { name: 'SOL', points: wave(25, 6, -0.05, 9000) },
      ]}
    />
  </div>
);
