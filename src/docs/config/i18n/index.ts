import { init } from 'uilib/services/i18n';

const api = init({
  en: {}, // English texts already in source code
  ua: () => import('./ua.json'),
});

export const i18n = api.i18n;
export const I18N = api.I18N;
export const withI18N = api.withI18N;
