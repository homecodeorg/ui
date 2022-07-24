import { ReactNode } from 'react';
import type { ButtonProps, PopupProps } from 'uilib';

export type Item = Pick<ButtonProps, 'onClick'> & {
  id: string;
  title: ReactNode;
  className?: string;
};

export type Props = Omit<PopupProps, 'content'> & {
  trigger: ReactNode;
  items: Item[];
  onClose?: () => void;
};
