import type { Size } from 'uilib/types';
import type { Props as PopupProps } from 'uilib/components/Popup/Popup.types';
import type { Props as DatePickerProps } from 'uilib/components/DatePicker/DatePicker.types';

export type Value = string | [string, string];

export type Props = DatePickerProps & {
  className?: string;
  size?: Size;
  popupProps?: PopupProps;
};
