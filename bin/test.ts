import { RefObject, ReactChild, ReactNode } from 'react';

import { Size } from '../../types';

import { InputProps } from '../Input/Input';
import { PopupProps } from '../Popup/Popup';

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

type Selected = { [id: string]: true | Id[] };

type GetInputValParams = {
  isFocused: boolean;
  searchVal: string;
  selected: Selected;
};

export type Props = Partial<
  Pick<InputProps, 'required' | 'error' | 'disabled'>
> & {
  className?: string;
  isOpen?: boolean;
  optionsClassName?: string;
  optionClassName?: string;
  name?: string;
  label?: string;
  additionalLabel?: ReactNode;
  size?: Size;
  options: Option[];
  limit?: number;
  selectTree?: any; // typeof OptionsTree
  isOnlyLeafs?: boolean; // select only leafs
  additionalOptions?: Option[];
  presets?: Preset[];
  clearButton?: boolean;
  selectAllButton?: boolean;
  sortBy?: string;
  groupBy?: string;
  value?: Id | Id[] | null;
  onApi?: (optionsTree: any) => void;
  getInputVal?: (params: GetInputValParams) => string;
  expandSelected?: boolean;
  onChange: (value: Id | Id[]) => void;
  onFocus?: InputProps['onFocus'];
  onBlur?: InputProps['onBlur'];
  onOpen?: () => void;
  onClose?: () => void;
  isSearchable?: boolean;
  inputProps?: Omit<
    InputProps,
    'value' | 'onChange' | 'onFocus' | 'onBlur' | 'size'
  >;
  disableTrigger?: boolean;
  triggerProps?: any;
  popupProps?: SelectPopupProps;
  hideRequiredStar?: boolean;
  hideErrorMessage?: boolean;
  independentSelection?: boolean;
  groupSelectedLeafs?: boolean;
};

export type State = {
  isFocused: boolean;
  isOpen: boolean;
  isSelectionLimited: boolean;
  selected: Selected;
  expanded: { [id: string]: boolean };
  searchVal: string;
  options: Option[];
  labelClipPath: string;
  optionsTreeUpd: number; // store in state to receive updates
};

export type OptionElemProps = {
  className: string;
  key: Option['id'];
  onMouseDown: () => void;
  onMouseUp: () => void;
  ref?: RefObject<HTMLDivElement>;
};
