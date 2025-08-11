/// <reference path="./types.d.ts" />
import { useEffect, useRef } from 'react';
import S from './Tooltip.styl';
import cn from 'classnames';

export interface TooltipProps {
  className?: string;
  contentClassName?: string;
  children: React.ReactNode;
  content?: React.ReactNode;
  delay?: number;
  direction?: 'top' | 'bottom' | 'left' | 'right';
  blur?: boolean;
  disabled?: boolean;
}

declare module 'react' {
  interface HTMLAttributes<T> {
    popover?: string;
  }
}

/**
 * TooltipBase component contains the core tooltip functionality including:
 * - Positioning logic that calculates optimal tooltip placement based on direction
 * - Event handlers for mouse and keyboard interactions (hover, focus)
 * - Viewport boundary detection to keep tooltips visible
 * - Delay handling for show/hide animations
 * - Popover API integration for native browser tooltip behavior
 *
 * This component should only be used when the tooltip is enabled and has content.
 * For disabled tooltips, use the main Tooltip component which returns early.
 */
const TooltipBase = ({
  className,
  contentClassName,
  children,
  content,
  delay = 0,
  direction = 'top',
  blur = false,
}: Omit<TooltipProps, 'disabled'>) => {
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

  return (
    <>
      <div ref={triggerRef} className={cn(S.trigger, className)}>
        {children}
      </div>
      <div
        ref={tooltipRef}
        popover="manual"
        className={cn(S.tooltip, blur && S.blur, contentClassName)}
        data-direction={direction}
      >
        {content}
      </div>
    </>
  );
};

export const Tooltip = ({
  className,
  contentClassName,
  children,
  content,
  delay = 0,
  direction = 'top',
  blur = false,
  disabled = false,
}: TooltipProps) => {
  if (disabled || !content) return <>{children}</>;

  return (
    <TooltipBase
      className={className}
      contentClassName={contentClassName}
      children={children}
      content={content}
      delay={delay}
      direction={direction}
      blur={blur}
    />
  );
};
