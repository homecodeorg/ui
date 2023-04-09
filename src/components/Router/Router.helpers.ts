export const replaceParamsInPath = (
  path: string,
  params: Record<string, string>
) => {
  if (path === '/') return '';
  return Object.keys(params).reduce((updatedPath, paramKey) => {
    return updatedPath.replace(`:${paramKey}`, params[paramKey]);
  }, path);
};

export function parsePath(
  currPath: string,
  routePath: string,
  exact = false
): Record<string, string> | null {
  const pathParts = currPath.split('/');
  const routePathParts = routePath.split('/');
  let matched = true;

  if (exact && routePathParts.length !== pathParts.length) {
    return null;
  }

  const params: Record<string, string> = {};

  for (let i = 0; i < routePathParts.length; i++) {
    const routeToken = routePathParts[i];
    const currentPathToken = pathParts[i];

    if (currentPathToken && routeToken.startsWith(':')) {
      const paramName = routeToken.slice(1);
      params[paramName] = currentPathToken;
    } else if (routeToken !== currentPathToken) {
      matched = false;
      break;
    }
  }

  if (!matched) return null;

  return params;
}
