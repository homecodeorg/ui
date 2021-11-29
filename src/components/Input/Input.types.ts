import { ReactChild, HTMLProps, InputHTMLAttributes } from 'react';

export type Size = 's' | 'm' | 'l' | 'xl';

export type ControlProps = HTMLProps<HTMLInputElement>;
export type Value = string | number;
export type Props = InputHTMLAttributes<HTMLInputElement> &
  Omit<ControlProps, 'ref'> & {
    className?: string;
    name?: string;
    size?: Size;
    label?: ReactChild;
    forceLabelOnTop?: boolean;
    error?: string | boolean;
    clear?: boolean; // render without borders and outline
    hasClear?: boolean;
    isNullable?: boolean;
    changeOnEnd?: boolean;
    placeholder?: string;
    adornmentLeft?: string | JSX.Element;
    adornmentLeftClassName?: string;
    adornmentRight?: string | JSX.Element;
    adornmentRightClassName?: string;
    onChange?: (value: Value) => void | boolean;
    onClear?: () => void;
    controlProps?: ControlProps & { className?: string };
    checkAutofill?: boolean;
  };
