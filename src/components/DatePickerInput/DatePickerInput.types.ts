import type { Date, Size, Variant } from 'uilib/types';
import type { Props as PopupProps } from 'uilib/components/Popup/Popup.types';

export type Value = string | [string, string];

export type Props = {
  className?: string;
  size?: Size;
  // Format to display in input field.
  //
  // See [DateTime](//components/DateTime) component for more details.
  displayFormat?: string;
  value: Value;
  onChange: (value: Value) => void;
  variant?: Variant;
  popupProps?: PopupProps;
};
