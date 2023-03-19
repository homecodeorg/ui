import { ReactNode } from 'react';

export type Props = {
  children?: ReactNode;
  className?: string;
  visible?: boolean;
  // Disable render to portal
  inline?: boolean;
  // Applies a blur effect to the background.
  blur?: boolean;
};
