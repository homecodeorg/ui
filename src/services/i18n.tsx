import { memo } from 'react';
import { nanoid } from 'nanoid';
import { createStore, withStore } from 'justorm/react';
import _i18n from 'roddeh-i18n';

import LS from 'uilib/tools/localStorage';
import { queryParams } from 'uilib/tools/queryParams';

type LangLoader = () => Promise<{ default: object }>;
type RegisterConfig = {
  [lang: string]: LangLoader;
};

const DEFAULT_LANG = 'en';
const modules = {};
const queryLang = queryParams.lang;

if (queryLang) LS.set('lang', queryLang);

const store = createStore('i18n', {
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

  function getTrans(key, props: any[] = []) {
    const langsOrder = Array.from(new Set([store.lang, ...langs])); // prioritize current lang
    let res;

    langsOrder.some(l => {
      if (texts[l]?.translator.data.values[key]) {
        res = texts[l](key, ...props);
        return true;
      }

      return false;
    });

    return res ?? key;
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

    // hook (update when componentStore._updated changed)
    withI18N: Component => withStore(storeName)(Component),

    i18n: (key, props?) => getTrans(key, props),

    I18N: memo(
      withStore({
        i18n: ['lang'], // subscribe to lang changes
        [storeName]: true,
      })(function I18N({ id, children, props }) {
        const key = id ?? children;

        return <>{getTrans(key, props)}</>;
      })
    ),
  };
}
