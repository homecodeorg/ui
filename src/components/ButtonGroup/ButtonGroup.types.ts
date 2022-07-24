import { HTMLAttributes } from 'react';

export type Props = HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
  className?: string;
};
