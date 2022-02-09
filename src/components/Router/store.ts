import { createStore } from 'justorm/react';

type NavigateParams = { replace?: boolean };
type ReplaceParams = { quiet?: boolean };

export default createStore('router', {
  path: location.pathname,
  params: {},
  navigate(href, { replace }: NavigateParams = {}) {
    history[replace ? 'replaceState' : 'pushState']({}, '', href);
    this.path = href;
  },
  replaceState(href, { quiet }: ReplaceParams = {}) {
    history.replaceState({}, '', href);
    if (!quiet) this.path = href;
  },
});
