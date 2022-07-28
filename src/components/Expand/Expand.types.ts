import { HTMLAttributes, ReactNode } from 'react';
import { Size, ComponentType } from 'uilib/types';

export type Props = {
  className?: string;
  size: Size;
  isOpen: boolean;
  header: ReactNode;
  headerClassName?: string;
  content: ReactNode;
  contentProps?: HTMLAttributes<HTMLDivElement> & { className?: string };
  onChange?: (isOpen: boolean) => void;
};
