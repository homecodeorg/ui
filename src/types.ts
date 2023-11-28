import { ChangeEvent } from 'react';

export type Size = 's' | 'm' | 'l';

export type Variant = 'clean' | 'default' | 'outlined';

export type ComponentType = {
  className?: string;
};

export type FormFieldChangeHandler = (
  e: ChangeEvent | null,
  value: any
) => void | boolean;

export type FormControl<T> = {
  value: T;
  onChange?: (e: ChangeEvent | null, value: T) => void | boolean;
  required?: boolean;
  disabled?: boolean;
  error?: string | boolean;
  name?: string;
  label?: string;
};

export type Date = {
  year: number;
  month: number;
  day?: number;
  // ISO 8601 string representation of date (YYYY-MM-DD)
  ISO?: string;
};
