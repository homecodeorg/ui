import { isNativeDocumentHref, isRootRelativeHref } from './linkHref';

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
