import { useEffect } from 'react';

import STORE from './store';

import * as T from './Router.types';

export const Redirect = (props: T.RedirectProps) => {
  useEffect(() => {
    STORE.replaceState(props.to, { replace: true });
  }, []);

  return null;
};

Redirect.displayName = 'Redirect';
