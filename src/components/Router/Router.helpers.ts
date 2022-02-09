import { Path } from 'path-parser';

export function parseRouteParams(routes) {
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
      parsed: new Path(path),
    });
  }

  parse(routes);

  return [...exactItems, ...items];
}
