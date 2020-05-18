export type WrapperPropsType = {
  className?: string;
  style?: CSSStyleDeclaration & {
    height?: number;
    width?: number;
  };
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
  disabled?: boolean;
  outlined?: boolean;
  inline?: boolean;
  flat?: boolean;
  clearTargetMargin?: boolean;
  direction: Direction;
  trigger?: JSX.Element | JSX.Element[];
  content: JSX.Element | JSX.Element[];
  contentProps?: any;
  wrapperProps?: WrapperPropsType;
  onOpen?: () => void;
  onClose?: () => void;
  hookBeforeOpen?: () => boolean | void;
  hookBeforeClose?: () => boolean | void;
  onTriggerFocus?: (e?: any) => boolean;
  onTriggerBlur?: (e?: any) => boolean;
};

export type State = {
  isOpen: boolean;
  isContentVisible: boolean;
};
