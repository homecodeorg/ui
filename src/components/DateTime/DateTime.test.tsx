import 'moment/locale/uk';

import { formatDate, toMomentLocale } from './DateTime';

// justorm v3 is ESM-only, which this jest setup doesn't transform; the
// subscription itself is covered by the app's browser checks.
jest.mock('justorm/react', () => ({ useStore: () => ({}) }));
jest.mock('uilib/services/i18n', () => ({ store: { lang: 'en' } }));

// eslint-disable-next-line @typescript-eslint/no-var-requires
const mockI18nStore = require('uilib/services/i18n').store;

const VALUE = new Date(2026, 9, 31, 10, 0);

describe('DateTime', () => {
  afterEach(() => {
    mockI18nStore.lang = 'en';
  });

  test('maps app language codes to moment locales', () => {
    expect(toMomentLocale('ua')).toBe('uk');
    expect(toMomentLocale('jp')).toBe('ja');
    expect(toMomentLocale('zh')).toBe('zh-cn');
    expect(toMomentLocale('de')).toBe('de');
    expect(toMomentLocale(undefined)).toBe('en');
  });

  test('formats in the active language', () => {
    expect(formatDate({ value: VALUE, format: 'D MMMM' })).toBe('31 October');
    mockI18nStore.lang = 'ua';
    expect(formatDate({ value: VALUE, format: 'D MMMM' })).toBe('31 жовтня');
  });

  test('an explicit locale wins over the active language', () => {
    mockI18nStore.lang = 'ua';
    expect(formatDate({ value: VALUE, format: 'D MMMM', locale: 'en' })).toBe(
      '31 October'
    );
  });
});
