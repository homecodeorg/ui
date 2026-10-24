import { MouseEvent, ReactNode } from 'react';

import { Props as PopupProps } from 'uilib/components/Popup/Popup.types';
import { Size } from 'uilib/types';

export type NestedMenuItem = {
  id: string;
  label: ReactNode;
  icon?: ReactNode;
  hint?: ReactNode;
  /** Allow long hint/label text to wrap inside the text column. */
  wrap?: boolean;
  submenu?: ReactNode;
  onSubmenuOpen?: () => void;
  onClick?: (e: MouseEvent) => void;
  /** When false, item click does not close the menu. Default true. */
  closeOnClick?: boolean;
  danger?: boolean;
  disabled?: boolean;
  className?: string;
  /** Text matched by the search field when `label` is not a plain string. */
  searchText?: string;
};

export type Props = {
  trigger: ReactNode;
  items: NestedMenuItem[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onItemClick?: (id: string) => void;
  align?: 'start' | 'end';
  size?: Size;
  className?: string;
  popupProps?: Partial<PopupProps>;
  /** Show a search field above the items that filters them by label. */
  searchable?: boolean;
  searchPlaceholder?: string;
  /** Shown when nothing matches the search. */
  searchEmpty?: ReactNode;
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
