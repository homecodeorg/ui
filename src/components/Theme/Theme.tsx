import { getRGB } from './Theme.helpers';

type ThemeConfig = {
  [name: string]: string;
};

function buildVar(name: string, val: string) {
  return `--${name}: ${val};`;
}

export function Theme({ config = {} }) {
  const vars = Object.entries(config)
    .map(([name, val]) => buildVar(name, val as string))
    .join('\n');

  return <style>{`:root {${vars}}`}</style>;
}

export * as ThemeHelpers from './Theme.helpers';
