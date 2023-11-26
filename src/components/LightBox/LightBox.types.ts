import { ReactNode } from 'react';

export type Props = {
  className?: string;
  // Whether the lightbox is open.
  isOpen?: boolean;
  // Called when the lightbox is closed.
  //
  // By default it closed by pressing Esc key.
  onClose?: () => void;
  // The content to display in the lightbox.
  children: ReactNode;
  // Applies a blur effect to the background.
  blur?: boolean;
};
