import { ReactNode } from 'react';

import type { Props as ButtonProps } from '../Button/Button.types';
import type { Props as PopupProps } from '../Popup/Popup.types';

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
