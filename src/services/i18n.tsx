import { memo } from 'react';
import { nanoid } from 'nanoid';
import { useStore, createStore } from 'justorm/react';
import _i18n from 'roddeh-i18n';

import LS from 'uilib/tools/localStorage';
import { queryParams } from 'uilib/tools/queryParams';

import * as T from './i18n.types';

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

export function init(config: T.RegisterConfig) {
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

  function getTrans(key, props?) {
    // Handle different prop formats according to roddeh-i18n
    if (!props) {
      return _getText(store.lang, key, []) || key;
    }

    // If props is a number, it's for pluralization
    if (typeof props === 'number') {
      return _getText(store.lang, key, [props]) || key;
    }

    // If props is an object, handle different cases
    if (typeof props === 'object') {
      const args = [];

      // For plural forms with parameters
      if ('plural' in props) {
        args.push(props.plural);
      }

      // For parameters/formatting
      if ('params' in props) {
        args.push(props.params);
      } else if ('plural' in props && 'params' in props) {
        // If we have both plural and params, params comes second
      } else if (!('plural' in props) && !('context' in props)) {
        // If it's just a plain object without our special keys, treat it as params
        args.push(props);
      }

      // Context comes last
      if ('context' in props) {
        // If we don't have params but have context, add empty params
        if (!('params' in props) && !('plural' in props)) {
          args.push({});
        }
        args.push(props.context);
      }

      return _getText(store.lang, key, args) || key;
    }

    // For backward compatibility with array format
    if (Array.isArray(props)) {
      return _getText(store.lang, key, props) || key;
    }

    return key;
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

  // TODO: bring back the ability to register modules

  return {
    storeName,
    componentStore,

    // hook (update when componentStore._updated changed)
    withI18N: Component => props => {
      useStore({ [storeName]: ['_updated'] });
      return <Component {...props} />;
    },

    i18n: (key, props?) => getTrans(key, props),

    I18N: memo(function I18N({ id, children, props }: T.I18NProps) {
      useStore({
        i18n: ['lang'], // subscribe to lang changes
        [storeName]: ['_updated'], // explicitly subscribe to _updated
      });

      const key = id ?? children;

      // @ts-ignore
      return <>{getTrans(key, props)}</>;
    }),
  };
}

export const useI18N = (fields: keyof T.I18NStore = 'lang') =>
  useStore({ i18n: [fields] }).i18n;
