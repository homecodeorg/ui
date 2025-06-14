import { memo } from 'react';
import { nanoid } from 'nanoid';
import { useStore, createStore } from 'justorm/react';
import _i18n from 'roddeh-i18n';

import LS from 'uilib/tools/localStorage';
import { queryParams } from 'uilib/tools/queryParams';

type LangLoader = () => Promise<{ default: object }>;
type RegisterConfig = {
  [lang: string]: LangLoader;
};

type I18NProps = {
  id?: string;
  children?: React.ReactNode;
  props?: number | Record<string, any>; // should be: plural, params, context
};

const DEFAULT_LANG = 'en';
const modules = {};
const queryLang = queryParams.lang;

if (queryLang) LS.set('lang', queryLang);

export const store = createStore('i18n', {
  lang: LS.get('lang') ?? DEFAULT_LANG,
  async changeLang(lang) {
    // TODO: use WebWorker for requests?
    const requests = modules[lang].map(loader => loader());
    await Promise.all(requests);
    modules[lang] = [];

    this.lang = lang;
    LS.set('lang', lang);
  },
});

export function init(config: RegisterConfig) {
  const langs = Object.keys(config);
  const texts = langs.reduce(
    (acc, lang) => ({ ...acc, [lang]: _i18n.create({ values: {} }) }),
    {}
  );

  const _getText = (lang, key, props) => {
    if (texts[lang]?.translator.data.values[key]) {
      return texts[lang](key, ...props);
    }

    return null;
  };

  function getTrans(key, props: any[] = []) {
    return _getText(store.lang, key, props) || key;
  }

  const storeName = `i18n-${nanoid()}`;
  const componentStore = createStore(storeName, { _updated: '' });

  const callLoader = async (loader, lang) => {
    const values =
      typeof loader === 'function' ? (await loader()).default : loader;

    texts[lang].translator.add({ values });
    componentStore._updated = nanoid();
  };

  Object.entries(config).forEach(([lang, loader]) => {
    if (!modules[lang]) modules[lang] = [];
    if (lang === store.lang) return callLoader(loader, lang);
    modules[lang].push(() => callLoader(loader, lang));
  });

  // TODO: revert ability to register modules

  return {
    storeName,
    componentStore,

    // hook (update when componentStore._updated changed)
    withI18N: Component => props => {
      useStore({ [storeName]: [] });
      return <Component {...props} />;
    },

    i18n: (key, props?) => getTrans(key, props),

    I18N: memo(function I18N({ id, children, props }: I18NProps) {
      useStore({
        i18n: ['lang'], // subscribe to lang changes
        [storeName]: [],
      });

      const key = id ?? children;

      // @ts-ignore
      return <>{getTrans(key, props)}</>;
    }),
  };
}

export type I18NStore = typeof store;