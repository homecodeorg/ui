import {
  clampAll,
  clampPair,
  minToPct,
  parseMinWidth,
} from './Resizer.helpers';

describe('parseMinWidth', () => {
  test('treats numbers as %', () => {
    expect(parseMinWidth(20)).toEqual({ kind: 'pct', value: 20 });
  });

  test('parses % strings', () => {
    expect(parseMinWidth('15%')).toEqual({ kind: 'pct', value: 15 });
    expect(parseMinWidth('15')).toEqual({ kind: 'pct', value: 15 });
  });

  test('parses px strings', () => {
    expect(parseMinWidth('200px')).toEqual({ kind: 'px', value: 200 });
    expect(parseMinWidth('200PX')).toEqual({ kind: 'px', value: 200 });
  });

  test('ignores empty and non-positive values', () => {
    expect(parseMinWidth(undefined)).toBeNull();
    expect(parseMinWidth('')).toBeNull();
    expect(parseMinWidth(0)).toBeNull();
    expect(parseMinWidth('-10px')).toBeNull();
  });
});

describe('minToPct', () => {
  test('converts px using container size', () => {
    expect(minToPct('200px', 1000)).toBe(20);
    expect(minToPct('20%', 1000)).toBe(20);
    expect(minToPct(10, 800)).toBe(10);
  });
});

describe('clampPair', () => {
  test('keeps a pane at its min and the neighbor above its min', () => {
    expect(clampPair(-10, 60, 20, 15)).toBe(20);
    expect(clampPair(80, 60, 20, 15)).toBe(45);
  });

  test('returns null when both mins cannot fit in the pair', () => {
    expect(clampPair(40, 50, 30, 30)).toBeNull();
  });
});

describe('clampAll', () => {
  test('grows a pane up to min by taking slack from others', () => {
    expect(clampAll([10, 50, 40], [20, 10, 10])).toEqual([20, 40, 40]);
  });

  test('scales mins when they exceed 100%', () => {
    expect(clampAll([50, 50], [80, 40])).toEqual([
      (80 / 120) * 100,
      (40 / 120) * 100,
    ]);
  });
});
