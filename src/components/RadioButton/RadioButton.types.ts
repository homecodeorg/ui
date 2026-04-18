import { ReactNode, InputHTMLAttributes } from 'react';

import { Size, ComponentType } from '../../types';

export type Props = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size' | 'type' | 'value'
> &
  ComponentType & {
    label?: ReactNode;
    /** Option value; compared to the group’s `value` when inside `RadioGroup` */
    value: string | number;
    checked?: boolean;
    disabled?: boolean;
    error?: string | boolean;
    size?: Size;
    variant?: 'default' | 'outlined';
  };
