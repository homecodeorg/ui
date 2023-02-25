import { ChangeEvent } from 'react';

// sizes
export type Size = 's' | 'm' | 'l';

export type Variant = 'clear' | 'default' | 'primary';

export type ComponentType = {
  className?: string;
};

export type FormControl<T> = {
  value: T;
  onChange?: (e: ChangeEvent | null, value: T) => void | boolean;
};
