import { ReactNode, UIEvent } from 'react';

export type Props = {
  // Header row, or a render fn that receives the current folded state
  trigger: ReactNode | ((isFolded: boolean) => ReactNode);
  children?: ReactNode;
  // Uncontrolled initial state
  defaultFolded?: boolean;
  className?: string;
  // Controlled folded state
  folded?: boolean;
  hideFoldButton?: boolean;
  onFoldedChange?: (folded: boolean) => void;
  onScrollInnerRef?: (el: HTMLDivElement | null) => void;
  onScrollInner?: (e: UIEvent<HTMLDivElement>) => void;
  // When false, render children inline without a scroll container
  contentScrolling?: boolean;
  // `clear` drops the rail/gutter and toggles on any non-interactive click
  variant?: 'default' | 'clear';
  showChevron?: boolean;
};
