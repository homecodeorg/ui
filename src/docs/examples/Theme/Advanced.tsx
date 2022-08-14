import { useState } from 'react';
import { Theme, ThemeHelpers, ThemeDefaults, Checkbox } from 'uilib';

const { colorsConfigToVars } = ThemeHelpers;
const { colors, getColors, getConfig } = ThemeDefaults;

const activeColor = '#00ff00';
const defaultColors = getColors();
const defaultConfig = getConfig();

const colorsConfig = {
  light: {
    ...colorsConfigToVars({
      ...getColors({
        accent: colors.dark,
        decent: colors.light,
      }),
    }),
  },
  dark: {
    ...colorsConfigToVars({
      ...getColors({
        accent: colors.light,
        decent: colors.dark,
      }),
    }),
  },
};

const getThemeConfig = (theme, activeColor) => ({
  ...defaultConfig,
  ...colorsConfig[theme],
  ...colorsConfigToVars({
    active: {
      color: activeColor, // update activeColor
      mods: defaultColors.active.mods, // save activeColor mods
    },
  }),
});

const getThemeName = isDark => (isDark ? 'dark' : 'light');

export default () => {
  const [isDark, setIsDark] = useState(true);
  const [config, setConfig] = useState(
    getThemeConfig(getThemeName(isDark), activeColor)
  );

  const toggle = () => {
    const themeName = getThemeName(!isDark);
    setConfig(getThemeConfig(themeName, activeColor));
    setIsDark(!isDark);
  };

  return (
    <>
      <Theme config={config} />
      <Checkbox label="Dark theme" onChange={toggle} checked={isDark} />
    </>
  );
};
