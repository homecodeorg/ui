import { createRoot } from 'react-dom/client';

import LS from 'uilib/tools/localStorage';
import { ThemeProvider } from 'uilib';

import App from './App/App';
import { colorsConfig, getThemeConfig } from './theme';

const initialTheme = (LS.get('theme') as 'light' | 'dark') ?? 'dark';
const initialActiveColor =
  (typeof localStorage !== 'undefined' &&
    localStorage.getItem('activeColor')) ||
  colorsConfig[initialTheme]['active-color'];

const elem = document.getElementById('app-root') as HTMLElement;
const root = createRoot(elem);

root.render(
  <ThemeProvider
    getThemeConfig={getThemeConfig}
    initialTheme={initialTheme}
    initialActiveColor={initialActiveColor}
  >
    <App />
  </ThemeProvider>
);
