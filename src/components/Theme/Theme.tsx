import { getRGB } from './Theme.helpers';

function buildVar(name, val) {
  return `--${name}: ${val};`;
}

export function Theme({ config = {} }) {
export function Theme({ config = {} }) {
  const vars = Object.entries(config)
    .map(([name, val]) => buildVar(name, val))
    .join('\n');

  return <style>{`:root {${vars}}`}</style>;
}

export * as ThemeHelpers from './Theme.helpers';
