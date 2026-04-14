import type { CSSProperties, ReactNode } from 'react';

export type Props = {
  open: boolean;
  disabled?: boolean;
  onOpenChange: (isOpen: boolean) => void;
  trigger?: ReactNode;
  triggerClassName?: string;
  title?: ReactNode;
  titleClassName?: string;
  subtitle?: ReactNode;
  subtitleClassName?: string;
  icon?: ReactNode;
  content?: ReactNode;
  contentClassName?: string;
  footer?: ReactNode;
  footerClassName?: string;
  footerAlignment?: 'left' | 'center' | 'right';
  size?: 'login' | 'wide' | 'default';
  className?: string;
  noScroll?: boolean;
  autoScrollBottom?: boolean;
  maxHeight?: CSSProperties['maxHeight'];
  width?: CSSProperties['width'];
};
