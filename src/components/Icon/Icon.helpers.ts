import { capitalize } from '../../tools/string';

export function createFaName(name) {
  const capitalized = name
    .split('-')
    .map(capitalize)
    .join('');

  return `fa${capitalized}`;
}
