import {
  isExternalHref,
  isNativeDocumentHref,
  isRootRelativeHref,
} from './linkHref';

describe('isRootRelativeHref', () => {
  test('single slash is same-origin', () => {
    expect(isRootRelativeHref('/api/files/content?filePath=a.pdf')).toBe(true);
    expect(isRootRelativeHref('/demo')).toBe(true);
  });

  test('double slash stays an in-app route', () => {
    expect(isRootRelativeHref('//agents')).toBe(false);
  });
});

describe('isNativeDocumentHref', () => {
  test('file content URLs load in the browser', () => {
    expect(
      isNativeDocumentHref(
        '/api/files/content?filePath=user%2Fdoc.pdf&chatId=1',
      ),
    ).toBe(true);
    expect(isNativeDocumentHref('/files/report.pdf')).toBe(true);
  });

  test('in-app routes stay on the router', () => {
    expect(isNativeDocumentHref('/demo')).toBe(false);
    expect(isNativeDocumentHref('/components/Theme')).toBe(false);
    expect(isNativeDocumentHref('/search?q=foo.bar')).toBe(false);
    expect(isNativeDocumentHref('//agents?id=1')).toBe(false);
  });
});

describe('isExternalHref', () => {
  test('a dot in the query does not make an in-app route external', () => {
    expect(isExternalHref('//storage?folder=f1&file=u%2Fclip.mp4')).toBe(false);
    expect(isExternalHref('/api/files/content?filePath=a.pdf')).toBe(false);
    expect(isExternalHref('search?q=foo.bar')).toBe(false);
  });

  test('hosts and http URLs are external', () => {
    expect(isExternalHref('https://example.com')).toBe(true);
    expect(isExternalHref('example.com/page?x=1')).toBe(true);
    expect(isExternalHref('//cdn.example.com/a.js')).toBe(true);
  });
});
