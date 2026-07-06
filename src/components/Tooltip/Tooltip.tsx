/// <reference path="./types.d.ts" />
import { Suspense, lazy } from 'react';

import { TooltipSimple } from './TooltipSimple';

export interface TooltipProps {
  className?: string;
  contentClassName?: string;
  children: React.ReactNode;
  content?: React.ReactNode;
  delay?: number;
  direction?: 'top' | 'bottom' | 'left' | 'right';
  blur?: boolean;
  disabled?: boolean;
  overTrigger?: boolean;
}

declare module 'react' {
  interface HTMLAttributes<T> {
    popover?: string;
  }
}

const LazyTooltipOverTrigger = lazy(() => import('./TooltipOverTrigger'));

export const Tooltip = ({
  className,
  contentClassName,
  children,
  content,
  delay = 0,
  direction = 'top',
  blur = false,
  disabled = false,
  overTrigger = false,
}: TooltipProps) => {
  if (disabled || !content) return <>{children}</>;

  if (overTrigger) {
    return (
      <Suspense fallback={<>{children}</>}>
        <LazyTooltipOverTrigger
          className={className}
          contentClassName={contentClassName}
          content={content}
          delay={delay}
          direction={direction}
          blur={blur}
        >
          {children}
        </LazyTooltipOverTrigger>
      </Suspense>
    );
  }

  return (
    <TooltipSimple
      className={className}
      contentClassName={contentClassName}
      content={content}
      delay={delay}
      direction={direction}
      blur={blur}
    >
      {children}
    </TooltipSimple>
  );
};
