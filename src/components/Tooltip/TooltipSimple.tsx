/// <reference path="./types.d.ts" />
import { useEffect, useRef } from 'react';
import { TooltipCore, TooltipPositionSetupOptions } from './TooltipCore';
import type { TooltipProps } from './Tooltip';

const useSimplePositionSetup = ({
  triggerRef,
  tooltipRef,
  content,
  delay,
  direction,
}: TooltipPositionSetupOptions) => {
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
  }, [content, delay, direction, tooltipRef, triggerRef]);
};

export const TooltipSimple = (
  props: Omit<TooltipProps, 'disabled' | 'overTrigger'>
) => <TooltipCore usePositionSetup={useSimplePositionSetup} {...props} />;
