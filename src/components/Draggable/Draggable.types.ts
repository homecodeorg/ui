import { ReactNode } from 'react';

export type Props = {
  items: string[];
  itemClassName?: string;
  renderItem: (id: string, isActive: boolean) => ReactNode;
  // mode: 'swap' | 'push'
  onChange: (items: string[]) => void;
};
