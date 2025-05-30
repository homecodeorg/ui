/// <reference path="./types.d.ts" />
import { useEffect, useRef } from 'react';
import S from './Tooltip.styl';
import cn from 'classnames';

export interface TooltipProps {
  children: React.ReactNode;
  content?: React.ReactNode;
  delay?: number;
  direction?: 'top' | 'bottom' | 'left' | 'right';
  blur?: boolean;
}

declare module 'react' {
  interface HTMLAttributes<T> {
    popover?: string;
  }
}

export const Tooltip = ({
  children,
  content,
  delay = 0,
  direction = 'top',
  blur = false,
}: TooltipProps) => {
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<number>();

  useEffect(() => {
    const trigger = triggerRef.current;
    const tooltip = tooltipRef.current;
    if (!trigger || !tooltip) return;

    const positionTooltip = () => {
      const rect = trigger.getBoundingClientRect();
      const tooltipRect = tooltip.getBoundingClientRect();

      let top = 0;
      let left = 0;

      switch (direction) {
        case 'top':
          top = rect.top - tooltipRect.height - 8;
          left = rect.left + rect.width / 2 - tooltipRect.width / 2;
          break;
        case 'bottom':
          top = rect.bottom + 8;
          left = rect.left + rect.width / 2 - tooltipRect.width / 2;
          break;
        case 'left':
          top = rect.top + rect.height / 2 - tooltipRect.height / 2;
          left = rect.left - tooltipRect.width - 8;
          break;
        case 'right':
          top = rect.top + rect.height / 2 - tooltipRect.height / 2;
          left = rect.right + 8;
          break;
      }

      // Ensure tooltip stays within viewport
      const padding = 10;
      left = Math.max(
        padding,
        Math.min(left, window.innerWidth - tooltipRect.width - padding)
      );
      top = Math.max(
        padding,
        Math.min(top, window.innerHeight - tooltipRect.height - padding)
      );

      tooltip.style.left = `${left}px`;
      tooltip.style.top = `${top}px`;
    };

    const showTooltip = () => {
      timeoutRef.current = window.setTimeout(() => {
        tooltip.showPopover?.();
        positionTooltip();
      }, delay);
    };

    const hideTooltip = () => {
      clearTimeout(timeoutRef.current);
      tooltip.hidePopover?.();
    };

    trigger.addEventListener('mouseenter', showTooltip);
    trigger.addEventListener('mouseleave', hideTooltip);
    trigger.addEventListener('focus', showTooltip);
    trigger.addEventListener('blur', hideTooltip);

    return () => {
      clearTimeout(timeoutRef.current);
      trigger.removeEventListener('mouseenter', showTooltip);
      trigger.removeEventListener('mouseleave', hideTooltip);
      trigger.removeEventListener('focus', showTooltip);
      trigger.removeEventListener('blur', hideTooltip);
    };
  }, [content, delay, direction]);

  if (!content) return <>{children}</>;

  return (
    <>
      <div ref={triggerRef} className={S.trigger}>
        {children}
      </div>
      <div
        ref={tooltipRef}
        popover="manual"
        className={cn(S.tooltip, blur && S.blur)}
        data-direction={direction}
      >
        {content}
      </div>
    </>
  );
};
