import { ThemeHelpers } from 'uilib';
import { createStore } from 'justorm/react';

import { config as themeConfig, colors } from '../../theme';

const initialThemeType = localStorage.getItem('theme') ?? 'dark';

function getInitialActiveColor() {
  return (
    localStorage.getItem('activeColor') ??
    themeConfig[initialThemeType]['active-color']
  );
}

function getThemeConfig(theme, activeColor) {
  return {
    ...themeConfig[theme],
    ...ThemeHelpers.colorsConfigToVars({
      ...colors,
      // @ts-ignore
      active: [activeColor, colors.active[1]],
    }),
  };
}

const initialActiveColor = getInitialActiveColor();

createStore('app', {
  theme: initialThemeType,
  currThemeConfig: getThemeConfig(initialThemeType, initialActiveColor),
  activeColor: initialActiveColor,

  setTheme(theme) {
    this.theme = theme;
    this.updateTheme(theme);

    localStorage.setItem('theme', theme);
  },

  setActiveColor(color) {
    this.activeColor = color;
    this.updateTheme();

    localStorage.setItem('activeColor', color);
  },

  updateTheme(theme = this.theme) {
    this.currThemeConfig = getThemeConfig(theme, this.activeColor);
  },
});
