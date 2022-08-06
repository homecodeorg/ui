import { HTMLProps } from 'react';

export type Props = HTMLProps<HTMLAnchorElement> & {
  store?: any;
  className?: string;
  exactClassName?: string;
  isPartialExact?: boolean;
  isDisabled?: boolean;
  isClear?: boolean;
  inline?: boolean;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void;
};
