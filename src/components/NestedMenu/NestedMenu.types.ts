import { ReactNode } from 'react';

export type NestedMenuItem = {
  id: string;
  label: ReactNode;
  icon?: ReactNode;
  hint?: ReactNode;
  /** Wrap long hint/label onto additional lines instead of clipping. */
  wrap?: boolean;
  submenu?: ReactNode;
  onSubmenuOpen?: () => void;
  onClick?: () => void;
  danger?: boolean;
  disabled?: boolean;
  className?: string;
};

export type Props = {
  trigger: ReactNode;
  items: NestedMenuItem[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  align?: 'start' | 'end';
  className?: string;
};

export type NestedMenuProps = Props;

export type NestedMenuRowProps = {
  children: ReactNode;
  className?: string;
  danger?: boolean;
  disabled?: boolean;
  href?: string;
  target?: string;
  rel?: string;
  onClick?: () => void;
};

export type NestedMenuLabelProps = {
  children: ReactNode;
  className?: string;
};
