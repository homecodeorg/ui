import { Component, cloneElement } from 'preact';
import { withStore } from 'justorm/preact';
import PathParser from 'path-parser';
import omit from 'lodash.omit';

import './store';

function parseRouteParams(routes) {
  const items = [];
  const exactItems = [];

  function parse(route) {
    if (!route) {
      return;
    }

    if (Array.isArray(route)) {
      route.forEach(parse);
      return;
    }

    const { path, exact, children } = route.props;

    if (children) {
      children.forEach(parse);
      return;
    }

    const defaultParams = { path, exact, Elem: route };

    if (!path) {
      exactItems.unshift(defaultParams);
      return;
    }

    (exact ? exactItems : items).push({
      ...defaultParams,
      parsed: new PathParser(path),
    });
  }

  parse(routes);

  return [...exactItems, ...items];
}

@withStore({ router: ['path'] })
class Router extends Component {
  constructor(props) {
    super(props);
    this.rebuildRoutes(props.children);
  }

  componentDidMount() {
    window.addEventListener('popstate', this.updateRouteState);
    window.addEventListener('pushstate', this.updateRouteState);
  }

  shouldComponentUpdate(nextProps) {
    this.rebuildRoutes(nextProps.children);
    return true;
  }

  componentWillUnmount() {
    window.removeEventListener('popstate', this.updateRouteState);
    window.removeEventListener('pushstate', this.updateRouteState);
  }

  updateRouteState = () => {
    const { router } = this.props.store;
    router.path = window.location.pathname;
  };

  rebuildRoutes(items) {
    this.routes = parseRouteParams(items);
  }

  getRoute() {
    let params;
    const { router } = this.props.store;
    const route =
      this.routes.find(({ path, exact, parsed }) => {
        if (exact && path === router.path) return true;
        if (parsed) params = parsed.test(router.path);
        return Boolean(params);
      }) || this.routes[0];

    return [route, params];
  }

  render() {
    const { router } = this.props.store;
    const [route, params] = this.getRoute();

    return cloneElement(route.Elem, { ...params, router });
  }
}

export default Router;
export * from './Link';
export { default as Redirect } from './Redirect';
