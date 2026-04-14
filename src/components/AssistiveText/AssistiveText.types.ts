import { ReactNode, HTMLAttributes } from 'react';

import type { Size } from 'uilib/types';

export type Props = HTMLAttributes<HTMLDivElement> & {
  className?: string;
  size?: Size;
  variant?: 'default' | 'danger';
  children: ReactNode;
};
