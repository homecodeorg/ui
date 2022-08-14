export type ThemeConfig = Record<string, string> & {
  colors?: Record<string, string>;
};

export type Props = {
  // Theme configuration
  config?: ThemeConfig;
};
