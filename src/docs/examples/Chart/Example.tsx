import { Chart } from 'chart';

const DAY = 86400000;
const start = Date.UTC(2026, 5, 1);

// 180 daily prices: x is epoch ms, y the value
let price = 68000;
const points = Array.from({ length: 180 }, (_, i) => {
  price *= 1 + Math.sin(i / 9) * 0.012 + Math.cos(i / 3.7) * 0.006;
  return [start + i * DAY, Math.round(price)];
});

export default () => (
  <div style={{ maxWidth: 640 }}>
    <Chart
      title="BTC, last 6 months"
      unit="USD"
      series={[{ name: 'BTC', points }]}
      source={{ name: 'CoinGecko', url: 'https://www.coingecko.com' }}
    />
  </div>
);
