import { ButtonHTMLAttributes, ReactNode } from 'react';

export type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string;
  children: ReactNode;
  variant?: 'clear' | 'default' | 'primary';
  size?: 's' | 'm' | 'l';
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  loading?: boolean;
  checked?: boolean;
  square?: boolean;
  tabIndex?: number;
  prefixElem?: JSX.Element;
  postfixElem?: JSX.Element;
  style?: Partial<CSSStyleDeclaration>;
};
