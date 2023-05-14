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
  // Whether to display arrows to navigate between items in the gallery.
  showArrows?: boolean;
  // Whether to display dots indicating the number of items in the gallery and which item is currently active.
  showDots?: boolean;
  // Whether to play a bounce animation on initialize.
  initialBounce?: boolean;
  // Item will be displayed as cover, which means it will be stretched to cover the whole height and width of the gallery.
  cover: true;
  // Called when the active item in the gallery changes.
  onChange?: (index: number, item: string) => void;
};
