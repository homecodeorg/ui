import { createStore, withStore } from 'justorm/preact';
import { Theme, ThemeHelpers } from 'components/Theme/Theme';

import { clone } from 'tools/object';

const { colorsConfigToVars } = ThemeHelpers;

const colors = {
  bg: ['#eee', { alpha: [200] }],
  accent: ['#222', { alpha: [500, 900] }],
  active: [
    '#ebb74a',
    {
      alpha: [100, 300, 500, 900],
      mix: [['accent', 300]],
    },
  ],
  danger: '#d53041',
  warning: '#ffa31a',
  link: '#3089fe',
};

export const STORE = createStore('theme', {
  'border-radius-s': '2px',
  'border-radius-m': '4px',
  'border-radius-l': '6px',
  'indent-s': '10px',
  'indent-m': '20px',
  'indent-l': '30px',
  tablet: '500px',
  desktop: '1200px',
  ...colorsConfigToVars(colors),
});

export default withStore({ theme: true })(function ThemeProvider({ store }) {
  const { theme } = store;
  const config = clone(theme.originalObject);

  return <Theme config={config} />;
});
