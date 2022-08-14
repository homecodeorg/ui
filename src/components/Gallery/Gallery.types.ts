import type { ComponentType, Size } from 'uilib/types';

export type Props = ComponentType & {
  // Items to be displayed in the gallery.
  items: string[];
  size?: Size;
  // Whether to enable animation when transitioning between items in the gallery.
  animation?: boolean;
  // Index of the item to display first in the gallery.
  //
  // If no index is provided, the first item in the items array will be displayed.
  startIndex?: number;
  // Called when the active item in the gallery changes.
  onChange?: (item: string) => void;
};
