import { Component, cloneElement, ReactNode } from 'react';
import { withStore } from 'justorm/react';

import STORE from './store';
import Context from './context';
import { parseRouteParams, getWeightestRoute } from './Router.helpers';

type Props = {
  store?: any;
  children: ReactNode;
  rootPath?: string;
};

let isFirstMonted = false;

@withStore({ router: ['path'] })
export class Router extends Component<Props> {
  store;
  routes;
  rootPath = '';

  static defaultProps = { rootPath: '' };

  constructor(props) {
    super(props);

    const {
      rootPath,
      store: { router },
    } = props;

    this.rootPath = rootPath;

    if (!isFirstMonted) {
      isFirstMonted = true;
    } else if (!rootPath) this.rootPath = router.path;

    this.rebuildRoutes(props.children);
  }

  shouldComponentUpdate(nextProps) {
    this.rebuildRoutes(nextProps.children);
    return true;
  }

  getPath = () => this.props.store.router.path;

  rebuildRoutes(items) {
    this.routes = parseRouteParams(items);
  }

  getRoute() {
    const currPath = this.getPath();
    const currPathWithoutRoot = currPath.replace(
      new RegExp(`^${this.rootPath}\/`),
      '/'
    );
    const notExactRoutes = [];

    // const sorted = this.routes.sort((a, b) =>
    //   a.exact && !b.exact ? -1 : b.exact && !a.exact ? 1 : 0
    // );
    const routes = this.routes.filter(route => {
      const { path = '', exact, parsed } = route;
      const fullPath = `${this.rootPath}${path}`;
      const sourceTested = parsed && new RegExp(parsed.source).test(currPath);

      if (parsed) {
        const currLocalPath = currPathWithoutRoot
          .split('/')
          .slice(0, path.split('/').length)
          .join('/');
        route.params = parsed.test(currLocalPath);
        if (sourceTested) return true;
      } else {
        if (exact && currPath === fullPath) return true;
      }

      if (!exact) notExactRoutes.push(route);

      return false;
    });
    const weightestRoute = getWeightestRoute(routes, currPathWithoutRoot);
    const route = weightestRoute || notExactRoutes[0];

    return route;
  }

  render() {
    const route = this.getRoute();

    if (!route) return null;

    const { Elem, params } = route;
    const { rootPath } = this;

    return (
      <Context.Provider value={{ rootPath }}>
        {cloneElement(Elem, { ...params, router: STORE })}
      </Context.Provider>
    );
  }
}

export * from './Link/Link';
export * from './Redirect';
export const RouterStore = STORE;
