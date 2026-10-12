import { ReactNode } from 'react';
import { Size } from 'uilib/types';

export type Props = {
  // Label or content inside the chip
  children: ReactNode;
  // CSS class name(s) applied to the root
  className?: string;
  // Selected appearance
  selected?: boolean;
  // Called when the chip is clicked
  onClick?: () => void;
  // Called when the remove control is clicked. Renders the remove control when set
  onRemove?: () => void;
  // Tooltip for the remove control
  removeTooltip?: ReactNode;
  // Size of the chip
  size?: Size;
};
