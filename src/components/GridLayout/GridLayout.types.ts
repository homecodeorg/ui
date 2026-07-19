import type { ElementType, ReactNode } from 'react';

export type Props = {
  children: ReactNode;
  // Min column width in px before items wrap to a new row. Default 300.
  colWidth?: number;
  // CSS gap value. Default `var(--p-2)`.
  gap?: string;
  className?: string;
  // Polymorphic root element. Default `div`.
  as?: ElementType;
};
