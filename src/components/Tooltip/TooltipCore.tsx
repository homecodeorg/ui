/// <reference path="./types.d.ts" />
import { useRef } from 'react';
import S from './Tooltip.styl';
import cn from 'classnames';

export interface TooltipPositionSetupOptions {
  triggerRef: React.RefObject<HTMLDivElement | null>;
  tooltipRef: React.RefObject<HTMLDivElement | null>;
  content?: React.ReactNode;
  delay: number;
  direction: 'top' | 'bottom' | 'left' | 'right';
}

export interface TooltipCoreProps {
  className?: string;
  contentClassName?: string;
  children: React.ReactNode;
  content?: React.ReactNode;
  delay?: number;
  direction?: 'top' | 'bottom' | 'left' | 'right';
  blur?: boolean;
  tooltipExtraClass?: string;
  dataDirection?: 'top' | 'bottom' | 'left' | 'right';
  usePositionSetup: (options: TooltipPositionSetupOptions) => void;
}

export const TooltipCore = ({
  className,
  contentClassName,
  children,
  content,
  delay = 0,
  direction = 'top',
  blur = false,
  tooltipExtraClass,
  dataDirection = direction,
  usePositionSetup,
}: TooltipCoreProps) => {
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  usePositionSetup({
    triggerRef,
    tooltipRef,
    content,
    delay,
    direction,
  });

  return (
    <>
      <div ref={triggerRef} className={cn(S.trigger, className)}>
        {children}
      </div>
      <div
        ref={tooltipRef}
        popover="manual"
        className={cn(
          S.tooltip,
          blur && S.blur,
          tooltipExtraClass,
          contentClassName
        )}
        data-direction={dataDirection}
      >
        {content}
      </div>
    </>
  );
};
