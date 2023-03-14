import { ReactNode, HTMLAttributes } from 'react';

export type Props = HTMLAttributes<HTMLDivElement> & {
  className?: string;
  size?: 's' | 'm' | 'l';
  variant?: 'default' | 'danger';
  children: ReactNode;
};
