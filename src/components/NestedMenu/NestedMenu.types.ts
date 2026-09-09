import { MouseEvent, ReactNode } from 'react';

import { Props as PopupProps } from 'uilib/components/Popup/Popup.types';
import { Size } from 'uilib/types';

export type NestedMenuItem = {
  id: string;
  label: ReactNode;
  icon?: ReactNode;
  hint?: ReactNode;
  /** Wrap long hint/label onto additional lines instead of clipping. */
  wrap?: boolean;
  submenu?: ReactNode;
  onSubmenuOpen?: () => void;
  onClick?: (e: MouseEvent) => void;
  /** When false, item click does not close the menu. Default true. */
  closeOnClick?: boolean;
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
  size?: Size;
  className?: string;
  popupProps?: Partial<PopupProps>;
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
