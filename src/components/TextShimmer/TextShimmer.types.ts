import { type ComponentProps, type ReactNode } from 'react';

export interface TextShimmerProps extends ComponentProps<'p'> {
  children: ReactNode;
  as?: React.ElementType;
  duration?: number;
  spread?: number;
  inverted?: boolean;
  active?: boolean;
}
