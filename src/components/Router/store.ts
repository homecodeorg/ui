import { createStore } from 'justorm/react';

import { addUniq, spliceWhere } from 'uilib/tools/array';
import { applyQueryParams, parseQueryParams } from 'uilib/tools/queryParams';
import { env } from 'uilib/tools';

const LISTENERS = [];

type GoParams = {
  replace?: boolean;
};

type ReplaceStateParams = {
  quiet?: boolean;
};

const STORE = createStore('router', {
  path: env.isBrowser && location.pathname,
  params: {},
  query: parseQueryParams(),
  queryString: env.isBrowser && location.search,
  on(cb) {
    addUniq(LISTENERS, cb);
  },
  un(cb) {
    spliceWhere(LISTENERS, cb);
  },
  go(
    path = this.path,
    query: Record<string, any> | string = {},
    params: GoParams = {}
  ) {
    if (path === this.path && !query) return;

    const { replace } = params;
    const pathStr = applyQueryParams(path ?? this.path, query);
    const action = replace ? 'replaceState' : 'pushState';

    console.log('Router.go', query, pathStr);

    history[action]({}, '', pathStr);
    onRouteChange(pathStr);
  },
  setParams(queryParams: Record<string, any>) {
    this.query = queryParams;
    this.queryString = applyQueryParams(this.path, queryParams);
    onRouteChange();
  },
  addQuery(query: Record<string, any>) {
    this.query = { ...this.query, ...query };
    this.queryString = applyQueryParams(this.path, this.query);
    onRouteChange();
  },
  removeQuery(fields: string[]) {
    const newQuery = { ...this.query };

    for (const field of fields) delete newQuery[field];

    this.query = newQuery;
    this.queryString = applyQueryParams(this.path, newQuery);
    onRouteChange();
  },
  back() {
    history.back();
    onRouteChange();
  },
  replaceState(href: string, params: ReplaceStateParams = {}) {
    history.replaceState({}, '', href);
    if (!params.quiet) onRouteChange(href);
  },
});

function onRouteChange(path = window.location.pathname) {
  STORE.queryString = location.search;
  STORE.query = parseQueryParams();
  STORE.path = path.replace(/\?.+/, '') || '/';

  LISTENERS.forEach(cb => cb(STORE.path, STORE.query));
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

export type RouterStore = typeof STORE;

export default STORE as RouterStore;
// window.routerStore = STORE;
