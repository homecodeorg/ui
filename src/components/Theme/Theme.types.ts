export type ThemeConfig = Record<string, string> & {
  colors?: Record<string, string>;
};

export type Props = {
  config?: Record<string, string>;
};
