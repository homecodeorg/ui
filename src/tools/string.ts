export function capitalize(str = '') {
  if (typeof str !== 'string' || !str) return str;
  return `${str[0].toUpperCase()}${str.slice(1)}`;
}
