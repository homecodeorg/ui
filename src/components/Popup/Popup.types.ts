import { DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';
import { Size } from '../../types';

export type TriggerPropsType = DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  className?: string;
};

export type WrapperPropsType = DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  className?: string;
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
  hoverControl?: boolean; // open/close popup on pointer over/out
  disabled?: boolean;
  outlined?: boolean;
  inline?: boolean;
  flat?: boolean;
  paranja?: boolean;
  size?: Size;
  elevation?: 1 | 2;
  direction: Direction;
  trigger?: ReactNode;
  triggerProps?: TriggerPropsType;
  content: ReactNode;
  contentProps?: any;
  wrapperProps?: WrapperPropsType;
  onOpen?: () => void;
  onClose?: () => void;
  onTriggerFocus?: (e: FocusEvent) => void;
  onTriggerBlur?: (e: FocusEvent) => void;
  hookBeforeOpen?: () => boolean | void;
  hookBeforeClose?: () => boolean | void;
};

export type State = {
  isOpen: boolean;
  isContentVisible: boolean;
};
