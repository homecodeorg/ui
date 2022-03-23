import { DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';
import { Size } from '../../types';

export type WrapperPropsType = DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  className?: string;
  // style?: CSSStyleDeclaration & {
  //   height?: number;
  //   width?: number;
  // };
};

export type Direction =
  | 'top'
  | 'top-right'
  | 'top-left'
  | 'right'
  | 'right-top'
  | 'right-bottom'
  | 'bottom'
  | 'bottom-right'
  | 'bottom-left'
  | 'left'
  | 'left-top'
  | 'left-bottom';

export type Props = {
  isOpen?: boolean;
  className?: string;
  autoClose?: boolean; // close popup when clicked
  controllable?: boolean; // disable handling focus and click events to update open state
  hoverControl?: boolean; // open/close popup on mouseover/mouseout
  disabled?: boolean;
  outlined?: boolean;
  inline?: boolean;
  flat?: boolean;
  paranja?: boolean;
  size?: Size;
  elevation?: 1 | 2;
  clearTargetMargin?: boolean;
  direction: Direction;
  trigger?: ReactNode;
  content: ReactNode;
  contentProps?: any;
  wrapperProps?: WrapperPropsType;
  onOpen?: () => void;
  onClose?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  hookBeforeOpen?: () => boolean | void;
  hookBeforeClose?: () => boolean | void;
  onTriggerFocus?: (e?: any) => boolean;
  onTriggerBlur?: (e?: any) => boolean;
};

export type State = {
  isOpen: boolean;
  isContentVisible: boolean;
};
