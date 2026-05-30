import { ReactNode, ChangeEvent, FormEvent, InputHTMLAttributes } from 'react';

import { Size, ComponentType } from '../../types';

export type Props = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'size' | 'onChange' | 'value'
> &
  ComponentType & {
    value: number;
    min?: number;
    max?: number;
    step?: number;
    size?: Size;
    disabled?: boolean;
    showGhost?: boolean;
    label?: ReactNode;
    onChange?: (
      value: number,
      e: ChangeEvent<HTMLInputElement> | FormEvent<HTMLInputElement>
    ) => void;
  };
