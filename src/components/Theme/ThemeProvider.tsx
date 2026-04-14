import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import LS from 'uilib/tools/localStorage';

import { Theme } from './Theme';

export type ThemeProviderProps = {
  children: ReactNode;
  getThemeConfig: (
    theme: 'light' | 'dark',
    activeColor: string
  ) => Record<string, string>;
  initialTheme?: 'light' | 'dark';
  initialActiveColor: string;
};

export type ThemeContextValue = {
  currThemeConfig: Record<string, string>;
  theme: 'light' | 'dark';
  isDarkTheme: boolean;
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setActiveColor: (color: string) => void;
  activeColor: string;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({
  children,
  getThemeConfig,
  initialTheme = 'dark',
  initialActiveColor,
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<'light' | 'dark'>(initialTheme);
  const [activeColor, setActiveColorState] = useState(initialActiveColor);

  const currThemeConfig = useMemo(
    () => getThemeConfig(theme, activeColor),
    [theme, activeColor, getThemeConfig]
  );

  const setTheme = useCallback((t: 'light' | 'dark') => {
    setThemeState(t);
    LS.set('theme', t);
  }, []);

  const setActiveColor = useCallback((color: string) => {
    setActiveColorState(color);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('activeColor', color);
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState(t => {
      const next = t === 'dark' ? 'light' : 'dark';
      LS.set('theme', next);
      return next;
    });
  }, []);

  useLayoutEffect(() => {
    document.body.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const value: ThemeContextValue = {
    currThemeConfig,
    theme,
    isDarkTheme: theme === 'dark',
    toggleTheme,
    setTheme,
    setActiveColor,
    activeColor,
  };

  return (
    <ThemeContext.Provider value={value}>
      <Theme config={currThemeConfig} />
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return ctx;
}
