import { ReactNode, HTMLProps, InputHTMLAttributes } from 'react';

import { ComponentType, FormControl, Size } from '../../types';

export type ControlProps = HTMLProps<HTMLInputElement>;
export type Value = string | number;
export type Props = Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> &
  Omit<ControlProps, 'ref'> &
  FormControl<Value> & {
    name?: string;
    size?: Size;
    label?: string;
    variant?: 'default' | 'outlined';
    // For label to be on top of the input,
    // even if there is no value/placeholder and not focused
    forceLabelOnTop?: boolean;
    // Defines an error message or error status for the input field
    error?: string | boolean;
    // Whether the input field should include a clear button that clears the input value when clicked
    hasClear?: boolean;
    // Whether the onChange event should be triggered only when the user finishes typing (focus lost) or immediately after each keystroke (default)
    changeOnEnd?: boolean;
    // Adornment to be displayed to the left of the input field
    adornmentLeft?: string | ReactNode;
    adornmentLeftClassName?: string;
    // Adornment to be displayed to the right of the input field
    adornmentRight?: string | ReactNode;
    adornmentRightClassName?: string;
    // A callback function that is called when the input field's value is cleared using the clear button (if hasClear is true)
    onClear?: () => void;
    // Additional props for the underlying HTML input element
    controlProps?: ControlProps & ComponentType;
    // Whether to check for autofill values and update the input field's value accordingly
    checkAutofill?: boolean;
  };
