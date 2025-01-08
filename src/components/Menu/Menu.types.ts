import { ReactNode } from 'react';

import { Size } from 'uilib/types';

export interface MenuProps {
  children: ReactNode;
  className?: string;
  size?: Size;
}

export interface MenuItemProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  selected?: boolean;
  focused?: boolean;
  disabled?: boolean;
  level?: number;
  size?: Size;
}

export interface MenuGroupProps {
  children: ReactNode;
  className?: string;
  label: string;
  size?: Size;
}
