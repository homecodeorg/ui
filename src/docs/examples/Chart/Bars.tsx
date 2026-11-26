import { Chart } from 'chart';

// Category charts: x is a label. A dashed series is drawn lighter (a plan).
export default () => (
  <div style={{ maxWidth: 640 }}>
    <Chart
      kind="bar"
      title="Revenue"
      unit="EUR"
      series={[
        {
          name: '2025',
          points: [
            ['Q1', 120000],
            ['Q2', 154000],
            ['Q3', 171000],
            ['Q4', 198000],
          ],
        },
        {
          name: '2026 plan',
          style: 'dashed',
          points: [
            ['Q1', 160000],
            ['Q2', 180000],
            ['Q3', 200000],
            ['Q4', 230000],
          ],
        },
      ]}
    />
  </div>
);
