import type { Size } from 'uilib/types';

export type Props = {
  className?: string;
  items: string[];
  size?: Size;
  animation?: boolean;
  startIndex?: number;
  onChange?: (item: string) => void;
};
