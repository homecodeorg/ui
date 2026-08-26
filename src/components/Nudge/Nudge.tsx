import cn from 'classnames';
import { type HTMLAttributes, type ReactNode } from 'react';

import S from './Nudge.styl';

export type NudgeProps = HTMLAttributes<HTMLDivElement> & {
  className?: string;
  children?: ReactNode;
};

export type NudgeTextProps = HTMLAttributes<HTMLParagraphElement> & {
  className?: string;
  children?: ReactNode;
};

export type NudgeErrorProps = HTMLAttributes<HTMLParagraphElement> & {
  className?: string;
  children?: ReactNode;
};

export function Nudge({ className, children, ...props }: NudgeProps) {
  return (
    <div className={cn(S.root, className)} {...props}>
      {children}
    </div>
  );
}

export function NudgeText({ className, children, ...props }: NudgeTextProps) {
  return (
    <p className={cn(S.text, className)} {...props}>
      {children}
    </p>
  );
}

export function NudgeError({ className, children, ...props }: NudgeErrorProps) {
  return (
    <p className={cn(S.error, className)} {...props}>
      {children}
    </p>
  );
}
