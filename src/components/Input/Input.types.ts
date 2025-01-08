import { ReactNode, HTMLProps, InputHTMLAttributes, ChangeEvent } from 'react';

import type { ComponentType, FormControl, Size, Variant } from '../../types';
import type { Props as ScrollProps } from '../Scroll/Scroll.types';

export type ControlProps = HTMLProps<HTMLInputElement>;
export type Value = string | number;
export type Props = Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> &
  Omit<ControlProps, 'ref' | 'onChange'> &
  FormControl<Value, HTMLInputElement> & {
    name?: string;
    // Step value for number inputs
    step?: number;
    size?: Size;
    label?: string;
    variant?: Variant;
    // Hide the required star symbol
    hideRequiredStar?: boolean;
    // For label to be on top of the input,
    // even if there is no value/placeholder and not focused
    forceLabelOnTop?: boolean;
    // Defines an error message or error status for the input field
    error?: string | boolean;
    // Whether the input field should include a clear button that clears the input value when clicked
    hasClear?: boolean;
    // Whether the onChange event should be triggered only when the user finishes typing (focus lost) or immediately after each keystroke (default)
    changeOnEnd?: boolean;
    // Addon to be displayed to the left of the input field
    addonLeft?: string | ReactNode;
    addonLeftClassName?: string;
    // Addon to be displayed to the right of the input field
    addonRight?: string | ReactNode;
    addonRightClassName?: string;
    // A callback function that is called when the input field's value is cleared using the clear button (if hasClear is true)
    onClear?: () => void;
    // Additional props for the underlying HTML input element
    controlProps?: ControlProps & ComponentType;
    // Whether to check for autofill values and update the input field's value accordingly
    checkAutofill?: boolean;
    // In case of type=textarea, you can pass props for [Scroll|//components/Scroll] component
    scrollProps?: Partial<ScrollProps>;
  };
