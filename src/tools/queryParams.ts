import { isBrowser } from './env';

const SSRQueryParams = {};

export function parseQueryParams(qs?: string): Record<string, string> {
  const queryString = qs || isBrowser ? location?.search : '';

  if (!queryString) return {};

  return [...new URLSearchParams(queryString).entries()].reduce(
    (acc, [key, value]) => {
      acc[key] = value;
      return acc;
    },
    {}
  );
}

export function stringifyQueryParams(params: Record<string, string>): string {
  return Object.entries(params)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    )
    .join('&');
}

/**
 * Path with `queryParams` applied. A query already in `path`
 * (`go('/storage?folder=1')`) is kept; `queryParams` override its keys.
 */
export function applyQueryParams(
  path,
  queryParams: Record<string, any> | string
): string {
  if (typeof queryParams === 'string') return queryParams;

  const [clearPath, pathQuery = ''] = path.split('?');
  const query = {
    ...Object.fromEntries(new URLSearchParams(pathQuery)),
    ...queryParams,
  };

  Object.entries(query).forEach(([key, value]) => {
    if (value === false) delete query[key];
    else query[key] = value;
  });

  if (Object.keys(query).length === 0) return clearPath;

  return `${clearPath}?${stringifyQueryParams(query)}`;
}

export const setSSRQueryParams = (params): void => {
  Object.assign(SSRQueryParams, params);
};

export const queryParams: Record<string, string> = isBrowser
  ? parseQueryParams()
  : SSRQueryParams;
