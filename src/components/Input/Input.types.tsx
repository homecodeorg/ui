import { ReactChild, HTMLProps, ChangeEvent } from 'react';

export type Size = 's' | 'm' | 'l' | 'xl';

export type ControlProps = HTMLProps<HTMLInputElement>;
export type Value = string | number;
export type Props = Omit<ControlProps, 'ref'> & {
  className?: string;
  name?: string;
  size?: Size;
  label?: ReactChild;
  forceLabelOnTop?: boolean;
  error?: string | boolean;
  clear?: boolean; // render without borders and outline
  placeholder?: string;
  adornmentLeft?: string | JSX.Element;
  adornmentRight?: string | JSX.Element;
  adornmentRightClassName?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>, value: Value) => void | boolean;
  controlProps?: ControlProps & { className?: string };
  checkAutofill?: boolean;
};
