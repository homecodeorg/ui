import { ReactNode, HTMLAttributes } from 'react';

import { Size, ComponentType } from '../../types';

export type RadioGroupContextValue = {
  name: string;
  value: string | number | undefined;
  onChange: (value: string | number) => void;
  size: Size;
  variant: 'default' | 'outlined';
  error?: string | boolean;
  disabled?: boolean;
};

export type Props = Omit<HTMLAttributes<HTMLFieldSetElement>, 'onChange'> &
  ComponentType & {
    children: ReactNode;
    /** Current value when controlled */
    value?: string | number;
    /** Initial value when uncontrolled */
    defaultValue?: string | number;
    /** Called when the selected option changes */
    onChange?: (value: string | number) => void;
    /** Shared `name` for native radio inputs; generated if omitted */
    name?: string;
    /** Group heading; renders as `legend` */
    label?: ReactNode;
    /** Size passed to `RadioButton` children via context */
    size?: Size;
    variant?: 'default' | 'outlined';
    error?: string | boolean;
    disabled?: boolean;
    orientation?: 'vertical' | 'horizontal';
  };
