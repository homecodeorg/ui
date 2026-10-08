/** In-app routes use `//path`. A single leading slash is a same-origin URL. */
export function isRootRelativeHref(href: string): boolean {
  return href.startsWith('/') && !href.startsWith('//');
}

/**
 * Browser should request this URL. `/api/…` and paths with a file extension
 * are documents, not router paths. A dot only in the query (`?q=a.b`) stays
 * an in-app route.
 */
export function isNativeDocumentHref(href: string): boolean {
  const path = href.split(/[?#]/)[0] ?? '';
  if (!path.startsWith('/') || path.startsWith('//')) return false;
  if (path === '/api' || path.startsWith('/api/')) return true;
  return path.includes('.');
}
