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

export const setSSRQueryParams = (params): void => {
  Object.assign(SSRQueryParams, params);
};

export const queryParams: Record<string, string> = isBrowser
  ? parseQueryParams()
  : SSRQueryParams;
