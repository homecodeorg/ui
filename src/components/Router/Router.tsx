import { useContext, useEffect, useMemo } from 'react';
import { useStore } from 'justorm/react';

import STORE from './store';
import type { RouterStore as RouterStoreType } from './store';
import Context from './context';
import { parsePath, replaceParamsInPath } from './Router.helpers';

import * as T from './Router.types';

type Store = { router: RouterStoreType };

export const Router = (props: T.Props) => {
  const { router } = useStore<Store>({ router: ['path'] });
  const { children, single, basePath = '' } = props;
  const ctx = useContext(Context);
  const fullPath = ctx.basePath + basePath;

  useEffect(() => {
    const onPopState = () => {
      STORE.go(window.location.pathname, STORE.query, { replace: true });
    };

    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const matchedRoutes = useMemo(() => {
    const childs: React.ReactNode[] = [];
    let noMatchRoute;
    let isRouteMatched = false;

    for (const child of React.Children.toArray(children)) {
      if (!React.isValidElement(child)) {
        childs.push(child);
        continue;
      }

      // @ts-ignore
      const isRouteComponent = child.type.displayName === 'Route';
      const {
        path,
        queryParam,
        exact,
        component: Component,
        ...rest
      } = child.props;

      if (!path) {
        const isMatched = queryParam
          ? router.query[queryParam]
          : isRouteComponent && Component;

        if (isMatched) {
          noMatchRoute = <Component {...rest} />;
          continue;
        }

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

    if (childs.length === 0 && noMatchRoute) {
      return noMatchRoute;
    }

    return childs;
  }, [children, router.path, fullPath, single]);

  return <>{matchedRoutes}</>;
};

Router.displayName = 'Router';

export * from './Route';
export * from './Redirect';
export * from './Link/Link';
export const RouterStore = STORE;
export const RouterContext = Context;
export type RouterStore = RouterStoreType;
