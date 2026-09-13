import { ReactNode } from 'react';

export type Props = {
  // Flex column when true (height), row when false (width).
  vertical?: boolean;
  // Resizable panes. A drag handle is rendered between each pair.
  content: ReactNode[];
  // Initial pane sizes in % (same order as content). Defaults to equal split.
  sizes?: number[];
  // Persist pane % sizes in localStorage under this key (namespaced).
  rememberKey?: string;
  className?: string;
};
