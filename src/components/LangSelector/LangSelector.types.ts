import { Props as SelectProps } from '../Select/Select.types';

export interface LangOption {
  id: string;
  label: string;
}

export interface LangSelectorProps
  extends Omit<SelectProps, 'value' | 'onChange' | 'options'> {
  options: LangOption[];
}
