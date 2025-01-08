import { FormControl, Size } from 'uilib/types';

import { Props as InputProps } from 'uilib/components/Input/Input.types';
import { Props as PopupProps } from 'uilib/components/Popup/Popup.types';

export type Option = {
  id: string;
  label: string;
};

export type Value = string;

export type Props = FormControl<Value, HTMLInputElement> & {
  className?: string;
  inputWrapperClassName?: string;
  size?: Size;
  value: Value;
  getOptions: (value: Value) => Promise<Option[]>;
  onSelect: (value: Value) => void;
  debounceDelay?: number;
  inputProps?: Partial<InputProps>;
  popupProps?: Partial<PopupProps>;
};
