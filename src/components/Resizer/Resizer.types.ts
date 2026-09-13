import { ReactNode } from 'react';

// Number or "20%" = percent of the container. "200px" = pixels.
export type SizeValue = number | string;

export type Props = {
  // Flex column when true (height), row when false (width).
  vertical?: boolean;
  // Resizable panes. A drag handle is rendered between each pair.
  content: ReactNode[];
  // Initial pane sizes in % (same order as content). Defaults to equal split.
  sizes?: number[];
  // Min size per pane along the resize axis. Number or `%` is percent; `px` is pixels.
  minWidths?: SizeValue[];
  // Persist pane % sizes in localStorage under this key (namespaced).
  rememberKey?: string;
  className?: string;
};
