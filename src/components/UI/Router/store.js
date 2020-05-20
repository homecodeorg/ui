import { createStore } from 'justorm/preact';

export default createStore('router', {
  path: location.pathname,
  params: {},
  navigate(href, { replace } = {}) {
    history[replace ? 'replaceState' : 'pushState']({}, '', href);
    this.path = href;
  },
  replaceState(href, { quiet } = {}) {
    history.replaceState({}, '', href);
    if (!quiet) this.path = href;
  },
});
