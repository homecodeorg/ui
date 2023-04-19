import { useContext, useEffect, useMemo } from 'react';
import { withStore } from 'justorm/react';

import STORE from './store';
import Context from './context';
import { parsePath, replaceParamsInPath } from './Router.helpers';

import * as T from './Router.types';

export const Router = withStore({
  router: ['path'],
})((props: T.Props) => {
  const {
    children,
    single,
    basePath = '',
    store: { router },
  } = props;
  const ctx = useContext(Context);
  const fullPath = ctx.basePath + basePath;

  useEffect(() => {
    const onPopState = () => {
      STORE.go(window.location.pathname, { replace: true });
    };

    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const matchedRoutes = useMemo(() => {
    const childs: React.ReactNode[] = [];
    let isRouteMatched = false;

    for (const child of React.Children.toArray(children)) {
      if (!React.isValidElement(child)) {
        childs.push(child);
        continue;
      }

      const { path, exact, component: Component, ...rest } = child.props;

      if (!path) {
        childs.push(child);
        continue;
      }

      if (single && isRouteMatched) {
        continue;
      }

      const tailPath = fullPath && path === '/' ? '' : path;
      const routePath = fullPath + tailPath;
      const params = parsePath(router.path, routePath, exact);

      if (params) {
        const routeBasePath = fullPath + replaceParamsInPath(path, params);
        const matchedRoute = (
          <Context.Provider value={{ basePath: routeBasePath }} key={path}>
            <Component {...rest} pathParams={params} />
          </Context.Provider>
        );

        isRouteMatched = true;
        childs.push(matchedRoute);
      }
    }

    return childs;
  }, [children, router.path, fullPath, single]);

  return <>{matchedRoutes}</>;
});

Router.displayName = 'Router';

export * from './Route';
export * from './Redirect';
export * from './Link/Link';
export const RouterStore = STORE;
export const RouterContext = Context;
