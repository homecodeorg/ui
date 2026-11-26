import { Chart } from 'chart';

// A pie uses the first series; each point is a slice.
export default () => (
  <div style={{ maxWidth: 420 }}>
    <Chart
      kind="pie"
      title="Portfolio"
      unit="USD"
      series={[
        {
          name: 'Value',
          points: [
            ['BTC', 52000],
            ['ETH', 21000],
            ['SOL', 9000],
            ['Cash', 6000],
          ],
        },
      ]}
    />
  </div>
);
