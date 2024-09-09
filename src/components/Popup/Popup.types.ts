import { DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';
import { ComponentType, Size } from '../../types';

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

export type Props = ComponentType & {
  // Sets the initial open state (default is false)
  isOpen?: boolean;
  // Wether to animate open/close state
  animated?: boolean;
  // Toggle open/close state on pointerover/pointerout
  hoverControl?: boolean;
  // Toggle open/close state on focus/blur
  //
  // Also by pressing Enter/Space keys, when focus on trigger
  focusControl?: boolean;
  // Disable rendering and listening events
  disabled?: boolean;
  // Adds an outline
  outlined?: boolean;
  // Renders inline with its trigger element
  inline?: boolean;
  // Adds a backdrop behind
  paranja?: boolean;
  // Applies a blur effect to the background.
  blur?: boolean;
  // Set corresponding paddings and border-radius
  size?: Size;
  // Adds a shadow
  elevation?: 1 | 2;
  // Direction to open.
  //
  // If not specified, it will be automatically calculated.
  //
  // Also when size of content changes, it will be recalculated.
  direction?: Direction;
  // Target element to attach to
  trigger?: ReactNode;
  triggerProps?: TriggerPropsType;
  // Props for element that wraps content
  wrapperProps?: WrapperPropsType;
  // Content to render inside popup
  content: ReactNode;
  contentProps?: any;
  // Function called when the popup is opened
  onOpen?: () => void;
  // Function called when the popup is closed
  onClose?: () => void;
};

export type State = {
  rootPopupId: number | null;
  isOpen: boolean;
  isContentVisible: boolean;
  animating: boolean;
  direction: Direction;
  triggerBounds: DOMRect | null;
};
