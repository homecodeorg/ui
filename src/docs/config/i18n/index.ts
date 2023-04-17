import { init } from 'uilib/services/i18n';

const api = init({
  // en: () => import('./en.json'), // English texts already in source code
  ua: () => import('./ua.json'),
  ru: () => import('./ru.json'),
});

export const i18n = api.i18n;
export const I18N = api.I18N;
export const withI18N = api.withI18N;
