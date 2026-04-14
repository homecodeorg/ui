import * as T from './Theme.types';
import { colorsConfigToVars, mixColor } from './Theme.helpers';

const pScale = Object.fromEntries(
  Array.from({ length: 20 }, (_, i) => {
    const n = i + 1;
    return [`p-${n}`, `${n * 4}px`];
  })
) as Record<string, string>;

export const baseConfig = {
  ...pScale,
  'border-radius-s': '2px',
  'border-radius-m': '4px',
  'border-radius-l': '6px',
};

const colorsAlphaModes = [0, 50, 100, 200, 300, 500, 800, 900];

export const colors = {
  light: '#e6e6e6',
  dark: '#1a1a1a',
};

type ColorConfig = {
  [key: string]: string | { color: string; mods: { alpha: number[] } };
};

export function getColors({
  accent = colors.light,
  decent = colors.dark,
  active = '#54b62b',
  warning = '#ffa31a',
  danger = '#da3749',
  disabled = '#f1f1f2',
  link = '#3089fe',
} = {}): ColorConfig {
  return {
    active: {
      color: active,
      mods: { alpha: colorsAlphaModes /* mix: [['accent', 300]] */ },
    },
    warning: {
      color: warning,
      mods: { alpha: colorsAlphaModes },
    },
    danger: {
      color: danger,
      mods: { alpha: colorsAlphaModes },
    },
    accent: {
      color: accent,
      mods: { alpha: colorsAlphaModes },
    },
    decent: {
      color: decent,
      mods: { alpha: colorsAlphaModes },
    },
    disabled,
    link,
    surface: mixColor(
      typeof decent === 'string' ? decent : colors.dark,
      typeof accent === 'string' ? accent : colors.light,
      0.12
    ),
  };
}

export const getConfig = (cfg: T.ThemeConfig = {}) => ({
  // @ts-ignore
  ...colorsConfigToVars(getColors(cfg.colors)),
  ...baseConfig,
  // @ts-ignore
  ...cfg.rest,
});
