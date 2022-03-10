import { createStore } from 'justorm/preact';

import { addUniq, spliceWhere } from '../../tools/array';

const LISTENERS = [];

const STORE = createStore('router', {
  path: location.pathname,
  params: {},
  on(cb) {
    addUniq(LISTENERS, cb);
  },
  un(cb) {
    spliceWhere(LISTENERS, cb);
  },
  go(href, { replace }: { replace?: boolean } = {}) {
    history[replace ? 'replaceState' : 'pushState']({}, '', href);
    this.path = href;
  },
  back() {
    history.back();
  },
  replaceState(href, { quiet }: { quiet?: boolean } = {}) {
    history.replaceState({}, '', href);
    if (!quiet) this.path = href;
  },
});

function updateRouteState() {
  const { pathname } = window.location;

  if (STORE.path === pathname) return;

  STORE.path = pathname;
  LISTENERS.forEach(cb => cb(pathname));
}

window.addEventListener('popstate', updateRouteState);
window.addEventListener('pushstate', updateRouteState);

export default STORE;
