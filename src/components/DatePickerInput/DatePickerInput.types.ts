import type { Props as PopupProps } from 'uilib/components/Popup/Popup.types';
import type { Props as DatePickerProps } from 'uilib/components/DatePicker/DatePicker.types';
import type { Props as ButtonProps } from 'uilib/components/Button/Button.types';

export type Value = string | [string, string];

export type Props = DatePickerProps & {
  variant?: string;
  displayFormat: string;
  popupProps?: PopupProps;
  buttonProps?: Omit<ButtonProps, 'children'>;
};
