import { createStore } from 'justorm/react';

import { colorsConfig, getThemeConfig } from '../../theme';

const initialThemeType =
  (localStorage.getItem('theme') as 'light' | 'dark') ?? 'dark';

function getInitialActiveColor() {
  return (
    localStorage.getItem('activeColor') ??
    colorsConfig[initialThemeType]['active-color']
  );
}

const initialActiveColor = getInitialActiveColor();

export default createStore('app', {
  isMenuOpen: false,
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

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  },
});
