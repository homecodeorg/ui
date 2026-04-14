import { Toggle, useTheme } from 'uilib';

/**
 * Theme CSS variables come from `<Theme config={...} />`, which `ThemeProvider`
 * renders at the app root together with `getThemeConfig` (see docs `index.tsx`).
 * Use `useTheme()` to read or toggle the active theme.
 */
export default function ThemeDemo() {
  const { isDarkTheme, toggleTheme } = useTheme();

  return (
    <Toggle label="Dark theme" onChange={toggleTheme} checked={isDarkTheme} />
  );
}
