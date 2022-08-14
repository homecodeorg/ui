import { ChangeEvent } from 'react';

export type Size = 's' | 'm' | 'l';

export type Variant = 'clear' | 'default' | 'primary';

export type ComponentType = {
  className?: string;
};

export type FormControl<T> = {
  value: T;
  onChange?: (e: ChangeEvent | null, value: T) => void | boolean;
  required?: boolean;
  disabled?: boolean;
  error?: string | boolean;
  name?: string;
  label?: string;
};
