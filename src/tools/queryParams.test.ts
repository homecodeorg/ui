import { applyQueryParams } from './queryParams';

describe('applyQueryParams', () => {
  test('keeps a query that is already in the path', () => {
    expect(
      applyQueryParams('/storage?folder=f1&file=u%2Fclip.mp4', {})
    ).toBe('/storage?folder=f1&file=u%2Fclip.mp4');
  });

  test('query params override the path query', () => {
    expect(applyQueryParams('/storage?folder=f1&file=a', { file: 'b' })).toBe(
      '/storage?folder=f1&file=b'
    );
    expect(applyQueryParams('/storage?folder=f1', { folder: false })).toBe(
      '/storage'
    );
  });

  test('encodes values', () => {
    expect(applyQueryParams('/search', { q: 'a&b c' })).toBe(
      '/search?q=a%26b%20c'
    );
  });

  test('plain path stays as is', () => {
    expect(applyQueryParams('/storage', {})).toBe('/storage');
  });
});
