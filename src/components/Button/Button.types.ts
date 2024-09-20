import { ButtonHTMLAttributes, ReactNode } from 'react';
import { Size } from 'uilib/types';

export type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  // CSS class name(s) to be applied to the component
  className?: string;
  // Text or child elements to be displayed inside the button
  children: ReactNode;
  // Style variant of the button
  variant?: 'text' | 'clear' | 'default' | 'outlined' | 'primary';
  // Size of the button
  size?: Size;
  // Whether the button should be in a loading state
  loading?: boolean;
  // Whether the button should be in a checked state
  checked?: boolean;
  // Whether the button should have a square shape
  square?: boolean;
  // Whether the button should have a round corners
  round?: boolean;
  // Element to be prepended to the children
  prefixElem?: ReactNode;
  // Element to be appended to the children
  postfixElem?: ReactNode;
  // Callback to get the button's ref
  onRef?: (ref: HTMLButtonElement) => void;
};
