import { Chart } from 'chart';

const DAY = 86400000;
const start = Date.UTC(2026, 10, 1);
const temps = (base, amp) =>
  Array.from({ length: 30 }, (_, i) => [
    start + i * DAY,
    Math.round((base + Math.sin(i / 4) * amp) * 10) / 10,
  ]);

// `colors` replaces the palette; a series' own `color` wins over it.
// `height` sets the plot height, `zoom={false}` turns drag-to-zoom off.
export default () => (
  <div style={{ maxWidth: 640 }}>
    <Chart
      title="Daily high, November"
      unit="°C"
      height={200}
      zoom={false}
      colors={['#3584e4', '#e66100']}
      series={[
        { name: 'Lisbon', points: temps(18, 2) },
        { name: 'Kyiv', points: temps(4, 3) },
        { name: 'Average', color: 'var(--accent-color-alpha-500)', points: temps(11, 0.5) },
      ]}
    />
  </div>
);
