import { ThemeHelpers } from 'uilib';

const { colorsConfigToVars } = ThemeHelpers;

const colorsAlphaModes = [0, 50, 100, 200, 500, 800, 900];
const darkColor = ['#171717', { alpha: colorsAlphaModes }];
const lightColor = ['#e6e6e6', { alpha: colorsAlphaModes }];

export const colors = {
  active: [
    '#6d447f',
    { alpha: [100, 300, 500, 800] /* mix: [['accent', 300]] */ },
  ],
  warning: ['#ffa31a', { alpha: [100, 200, 500] }],
  danger: ['#da3749', { alpha: [100, 300, 500] }],
  disable: '#f1f1f2',
  link: '#3089fe',
};

const defaultConfig = {
  'indent-s': '10px',
  'indent-m': '20px',
  'indent-l': '30px',
  'border-radius-s': '2px',
  'border-radius-m': '4px',
  'border-radius-l': '6px',
};

export const config = {
  light: {
    ...defaultConfig,
    ...colorsConfigToVars({ ...colors, accent: darkColor, decent: lightColor }),
  },
  dark: {
    ...defaultConfig,
    ...colorsConfigToVars({ ...colors, accent: lightColor, decent: darkColor }),
  },
};

function getColorsByTheme(theme: 'dark' | 'light') {
  if (theme === 'dark') return { accent: lightColor, decent: darkColor };
  return { accent: darkColor, decent: lightColor };
}

export function getThemeConfig(theme: 'dark' | 'light', additionalColors = {}) {
  const currColorsConfig = {
    ...colors,
    ...additionalColors,
    ...getColorsByTheme(theme),
  };

  return {
    ...defaultConfig,
    // @ts-ignore
    ...colorsConfigToVars(currColorsConfig),
  };
}
