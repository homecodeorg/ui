import { ReactNode } from 'react';

export type Props = {
  items: string[];
  className?: string;
  itemClassName?: string;
  // Callback to render each item
  // - id: The id from items array
  // - isActive: Whether the item is being dragged
  renderItem: (id: string, isActive: boolean) => ReactNode;
  // mode: 'swap' | 'push'
  // Called when dragging starts
  onDragStart?: (id: string) => void;
  // Called when dragging ends
  onDragEnd?: (id: string) => void;
  // Called when the order of items changes
  onChange: (items: string[]) => void;
};
