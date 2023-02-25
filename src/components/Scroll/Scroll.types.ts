import { HTMLProps, HTMLAttributes } from 'react';

import type { Size } from '../../types';

type OffsetAxis = { before?: number; after?: number };
export type Props = Omit<HTMLProps<HTMLDivElement>, 'size'> & {
  className?: string;
  innerClassName?: string;
  thumbClassName?: string;
  innerProps?: HTMLAttributes<HTMLDivElement>;
  extraWide?: boolean;
  x?: boolean;
  y?: boolean;
  size?: Size;
  smooth?: boolean; // smooth scroll
  autoHide?: boolean;
  offset?: { x?: OffsetAxis; y?: OffsetAxis };
  onScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
};
