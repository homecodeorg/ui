import { ReactChild, ChangeEvent, HTMLProps, InputHTMLAttributes } from 'react';

import { Size } from '../../types';

export type ControlProps = HTMLProps<HTMLInputElement>;
export type Value = string | number;
export type Props = Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> &
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
    onChange?: (e: ChangeEvent | null, value: Value) => void | boolean;
    onClear?: () => void;
    controlProps?: ControlProps & { className?: string };
    checkAutofill?: boolean;
  };
