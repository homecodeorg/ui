import moment from 'moment';
import { useStore } from 'justorm/react';

import { store as i18nStore } from 'uilib/services/i18n';

import * as T from './DateTime.types';

// App language codes that differ from moment's locale ids.
const MOMENT_LOCALE_ALIASES: Record<string, string> = {
  ua: 'uk',
  jp: 'ja',
  zh: 'zh-cn',
  cn: 'zh-cn',
  gr: 'el',
  cz: 'cs',
  dk: 'da',
};

/** Moment locale id for an app language code ("ua" -> "uk"). */
export function toMomentLocale(lang?: string | null | void) {
  if (!lang) return 'en';
  const code = lang.toLowerCase();
  return MOMENT_LOCALE_ALIASES[code] ?? code;
}

export function formatDate({
  value,
  format,
  locale,
}: {
  value?: T.Props['value'];
  format?: string;
  locale?: string;
}) {
  // Moment keeps English when the locale's data isn't loaded by the app.
  const d = moment(value).locale(locale ?? toMomentLocale(i18nStore.lang));

  if (format) {
    if (d[format]) return d[format]();
    return d.format(format);
  }

  return d.toString();
}

export function DateTime({ value = new Date(), format, locale }: T.Props) {
  // Re-render on a language switch when no explicit locale is given.
  useStore({ i18n: ['lang'] });

  return <>{formatDate({ value, format, locale })}</>;
}
