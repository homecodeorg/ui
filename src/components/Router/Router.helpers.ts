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

const getRouteWeight = route => route.path.split('/').length;

export function getWeightestRoute(routes, currPath) {
  const exactMatch = routes.find(({ path }) => path === currPath);

  if (exactMatch) return exactMatch;

  const strictMatch = routes.find(({ path }) =>
    new RegExp(`^${path}/`).test(currPath)
  );

  if (strictMatch) return strictMatch;

  const liberalMatch = routes.find(({ source }) =>
    new RegExp(source).test(currPath)
  );

  if (liberalMatch) return liberalMatch;

  return routes.sort((a, b) =>
    getRouteWeight(a) > getRouteWeight(b)
      ? -1
      : getRouteWeight(b) > getRouteWeight(a)
      ? 1
      : 0
  )[0];
}
