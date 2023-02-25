import { createStore } from 'justorm/react';

import { addUniq, spliceWhere } from 'uilib/tools/array';
import { parseQueryParams } from 'uilib/tools/queryParams';
import { env } from 'uilib/tools';

const LISTENERS = [];

const STORE = createStore('router', {
  path: env.isBrowser && location.pathname,
  params: {},
  query: {},
  queryString: env.isBrowser && location.search,
  on(cb) {
    addUniq(LISTENERS, cb);
  },
  un(cb) {
    spliceWhere(LISTENERS, cb);
  },
  go(href, { replace }: { replace?: boolean } = {}) {
    history[replace ? 'replaceState' : 'pushState']({}, '', href);
    onRouteChange(href);
  },
  back() {
    history.back();
    onRouteChange();
  },
  replaceState(href, { quiet }: { quiet?: boolean } = {}) {
    history.replaceState({}, '', href);
    if (!quiet) onRouteChange(href);
  },
});

function onRouteChange(href = window.location.pathname) {
  STORE.queryString = location.search;
  STORE.query = parseQueryParams();
  STORE.path = href.replace(/\?.+/, '') || '/';

  LISTENERS.forEach(cb => cb(STORE.path));
}

function updateRouteState() {
  if (
    STORE.path !== window.location.pathname ||
    STORE.queryString !== location.search
  )
    onRouteChange();
}

if (env.isBrowser) {
  window.addEventListener('popstate', updateRouteState);
  window.addEventListener('pushstate', updateRouteState);
}

export default STORE;
