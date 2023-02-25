import { Theme, ThemeDefaults, ThemeHelpers } from 'uilib';

const { getColors, getConfig } = ThemeDefaults;
const { colorsConfigToVars } = ThemeHelpers;

const colorsConfig = getColors({ active: '#00ff00' });
const theme = {
  ...getConfig(),
  ...colorsConfigToVars(colorsConfig),
};

export default () => <Theme config={theme} />;
