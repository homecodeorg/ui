import { RefObject, ReactNode, HTMLAttributes } from 'react';

import type { FormControl, Size } from 'uilib/types';

import { InputProps } from '../Input/Input';
import { PopupProps } from '../Popup/Popup';

export type Id = string | number;

export type Option = {
  id: Id;
  isGroupHeader?: boolean;
  parentId?: Id;
  label: string;
  sortingKey?: string | number;
  children?: Option[];
  render?: (label: string) => string;
};

type Preset = {
  label: string;
  ids: Id[];
};

export type PresetButtonProps = {
  key: string;
  children: ReactNode;
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

type Selected = Record<string, true | Id[]>;

export type Value = Id | Id[] | null;

type InheritedInputProps = Partial<Pick<InputProps, 'onFocus' | 'onBlur'>>;

export type Props = FormControl<Value> &
  InheritedInputProps & {
    className?: string;
    // Use this prop to control the open state
    isOpen?: boolean;
    // Whether to close the popup when an option is selected
    closeOnSelect?: boolean;
    // CSS class for styling the list items wrapper
    optionsClassName?: string;
    // CSS class that will be applied to every list options
    optionClassName?: string;
    // ReactNode that will be added to to label
    additionalLabel?: ReactNode;
    size?: Size;
    variant?: 'default' | 'outlined';
    // Show the number of selected items in the label
    showSelectedCount?: boolean;
    // Disabled label rendering
    disableLabel?: boolean;
    // Applies a blur effect to the options list
    blur?: boolean;
    // An array of options
    options: Option[];
    // Options that would be added to the top of the list
    additionalOptions?: Option[];
    // Presets are a set of options that can be selected with a single click
    presets?: Preset[];
    // Show clear button
    clearButton?: boolean;
    // Show select all button
    selectAllButton?: boolean;
    // Id(s) of selected item(s)
    //
    // Pass array for multiple selection
    value?: Value;
    // Control search input value
    searchValue?: string;
    // Expand selected items on first open
    expandSelected?: boolean;
    onChange: (value: Value) => void;
    onSearchChange?: (value: string) => void;
    onOpen?: () => void;
    onClose?: () => void;
    // Whether to show the search input field
    isSearchable?: boolean;
    // Props for the search <Input> component
    inputProps?: Omit<
      InputProps,
      'value' | 'onChange' | 'onFocus' | 'onBlur' | 'size'
    >;
    round?: boolean;
    // Custom trigger element
    trigger?: ReactNode;
    triggerProps?: any;
    popupProps?: SelectPopupProps;
    // Hide the required star symbol
    hideRequiredStar?: boolean;
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
  optionsUpdated: number;
  focusedItemIndex: number;
};

export type OptionElemProps = HTMLAttributes<HTMLDivElement> & {
  className: string;
  ref?: RefObject<HTMLDivElement>;
};
