import { createStore } from 'justorm/react';

import { addUniq, spliceWhere } from 'uilib/tools/array';
import { parseQueryParams } from 'uilib/tools/queryParams';

const LISTENERS = [];

const STORE = createStore('router', {
  path: location.pathname,
  params: {},
  query: {},
  queryString: location.search,
  on(cb) {
    addUniq(LISTENERS, cb);
  },
  un(cb) {
    spliceWhere(LISTENERS, cb);
  },
  go(href, { replace }: { replace?: boolean } = {}) {
    history[replace ? 'replaceState' : 'pushState']({}, '', href);
    this.path = href.replace(/\?.+/, '') || '/';
    onRouteChange();
  },
  back() {
    history.back();
  },
  replaceState(href, { quiet }: { quiet?: boolean } = {}) {
    history.replaceState({}, '', href);
    if (!quiet) this.path = href;
  },
});

function onRouteChange() {
  STORE.queryString = location.search;
  STORE.query = parseQueryParams();
  LISTENERS.forEach(cb => cb(STORE.path));
}

function updateRouteState() {
  const { pathname } = window.location;

  if (STORE.path === pathname && STORE.queryString === location.search) return;

  STORE.path = pathname;
  onRouteChange();
}

window.addEventListener('popstate', updateRouteState);
window.addEventListener('pushstate', updateRouteState);

export default STORE;
