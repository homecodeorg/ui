import { Size } from '../Input/Input.types';
import { InputProps } from '../Input/Input';
import { PopupProps } from '../Popup/Popup';

export type Id = string | number;

export type Option = {
  id: Id;
  isGroupHeader?: boolean;
  parentId?: Id;
  label: any;
  children?: Option[];
  render?: (label: string) => string;
};

type Preset = {
  label: string;
  ids: Id[];
};

export type PresetButtonProps = {
  key: string;
  children: JSX.Element;
  onClick: () => void;
};

type SelectPopupProps = Omit<
  PopupProps,
  | 'disabled'
  | 'direction'
  | 'autoClose'
  | 'onOpen'
  | 'onClose'
  | 'trigger'
  | 'content'
> &
  Partial<{ direction: PopupProps['direction'] }>;

export type Props = {
  className?: string;
  name?: string;
  label?: string;
  size?: Size;
  options: Option[];
  additionalOptions?: Option[];
  presets?: Preset[];
  clearButton?: boolean;
  selectAllButton?: boolean;
  sortBy?: string;
  groupBy?: string;
  value?: Id | Id[] | null;
  onChange: (value: Id | Id[]) => void;
  onFocus?: InputProps['onFocus'];
  onBlur?: InputProps['onBlur'];
  onOpen?: () => void;
  onClose?: () => void;
  inputProps?: Omit<
    InputProps,
    'value' | 'onChange' | 'onFocus' | 'onBlur' | 'size'
  >;
  popupProps?: SelectPopupProps;
  hideRequiredStart?: boolean;
} & Pick<InputProps, 'required' | 'error'>;

export type State = {
  isFocused: boolean;
  isOpen: boolean;
  selected: { [id: string]: true | Id[] };
  expanded: { [id: string]: boolean };
  searchVal: string;
};

export type OptionElemProps = {
  className: string;
  key: Option['id'];
  onMouseDown: () => void;
  onMouseUp: () => void;
  ref?: Ref<HTMLDivElement>;
};
