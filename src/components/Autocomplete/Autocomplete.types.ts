import { FormControl, Size } from 'uilib/types';

import { Props as InputProps } from 'uilib/components/Input/Input.types';
import { Props as PopupProps } from 'uilib/components/Popup/Popup.types';
import { MenuProps } from 'uilib/components/Menu/Menu.types';

export type Option = {
  id: string;
  label: string;
  render?: (option: Option) => React.ReactNode;
};

export type Value = string;

export type Props = FormControl<Value, HTMLInputElement> & {
  className?: string;
  inputWrapperClassName?: string;
  size?: Size;
  value: Value;
  isOpen?: boolean;
  getOptions: (filter: string, offset: number) => Promise<Option[]>;
  onSelect: (option: Option) => void;
  items?: Option[];
  itemHeight?: number;
  pageSize?: number;
  debounceDelay?: number;
  inputProps?: Partial<InputProps>;
  popupProps?: Partial<PopupProps>;
  menuProps?: Partial<MenuProps>;
  round?: boolean;
  blur?: boolean;
  renderItem?: (props: RenderItemProps) => React.ReactElement;
};

export type RenderItemProps = {
  option: Option;
  key: number;
  className?: string;
  style?: React.CSSProperties;
  focused: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
};
