import { ButtonHTMLAttributes, ReactNode } from 'react';

export type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string;
  children: ReactNode;
  variant?: 'clear' | 'default' | 'primary';
  size?: 's' | 'm' | 'l';
  loading?: boolean;
  checked?: boolean;
  square?: boolean;
  tabIndex?: number;
  prefixElem?: JSX.Element; // Element to be prepended to the children
  postfixElem?: JSX.Element; // Element to be appended to the children
};
