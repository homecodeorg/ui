import * as T from './Theme.types';
import { colorsConfigToVars } from './Theme.helpers';

export const baseConfig = {
  'indent-s': '10px',
  'indent-m': '20px',
  'indent-l': '30px',
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
      mods: { alpha: [100, 300, 500, 800] /* mix: [['accent', 300]] */ },
    },
    warning: {
      color: warning,
      mods: { alpha: [100, 300, 500] },
    },
    danger: {
      color: danger,
      mods: { alpha: [100, 300, 500] },
    },
    disabled,
    link,
    accent: {
      color: accent,
      mods: { alpha: colorsAlphaModes },
    },
    decent: {
      color: decent,
      mods: { alpha: colorsAlphaModes },
    },
  };
}

export const getConfig = (cfg: T.ThemeConfig = {}) => ({
  // @ts-ignore
  ...colorsConfigToVars(getColors(cfg.colors)),
  ...baseConfig,
  // @ts-ignore
  ...cfg.rest,
});
