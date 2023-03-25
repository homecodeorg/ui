import { isBrowser } from './env';

const SSRQueryParams = {};

export function parseQueryParams(): any {
  if (!location?.search) return {};
  return [...new URLSearchParams(location.search).entries()].reduce(
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

export const queryParams = isBrowser ? parseQueryParams() : SSRQueryParams;
