import * as T from './Theme.types';

function buildVar(name: string, val: string) {
  return `--${name}: ${val};`;
}

export function Theme({ config = {} }: T.Props) {
  const vars = Object.entries(config)
    .map(([name, val]) => buildVar(name, val as string))
    .join('\n');

  return <style>{`:root {${vars}}`}</style>;
}

export * as ThemeHelpers from './Theme.helpers';
export * as ThemeDefaults from './Theme.defaults';
