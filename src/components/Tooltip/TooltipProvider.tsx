/// <reference path="./types.d.ts" />
import { useEffect, useRef } from 'react';
import S from './Tooltip.styl';

let tooltipElement: HTMLDivElement | null = null;
let currentTarget: HTMLElement | null = null;
let showTimeout: number | null = null;
let hideTimeout: number | null = null;

const DELAY = 300;
const HIDE_DELAY = 100;

function createTooltipElement() {
  if (tooltipElement) return tooltipElement;

  tooltipElement = document.createElement('div');
  tooltipElement.setAttribute('popover', 'manual');
  tooltipElement.className = S.tooltip;
  document.body.appendChild(tooltipElement);

  return tooltipElement;
}

function positionTooltip(
  tooltip: HTMLElement,
  target: HTMLElement,
  direction: string
) {
  const rect = target.getBoundingClientRect();
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
    default: // top by default
      top = rect.top - tooltipRect.height - 8;
      left = rect.left + rect.width / 2 - tooltipRect.width / 2;
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
  tooltip.setAttribute('data-direction', direction);
}

function showTooltip(target: HTMLElement) {
  const content = target.getAttribute('data-tooltip');
  if (!content || target === currentTarget) return;

  clearTimeout(hideTimeout!);
  currentTarget = target;

  showTimeout = window.setTimeout(() => {
    const tooltip = createTooltipElement();
    tooltip.textContent = content;

    // Apply blur class if needed
    const hasBlur = target.hasAttribute('data-tooltip-blur');
    if (hasBlur) {
      tooltip.classList.add(S.blur);
    } else {
      tooltip.classList.remove(S.blur);
    }

    // Show tooltip first to get its dimensions
    try {
      tooltip.showPopover?.();
    } catch (e) {
      // Fallback for browsers without popover support
      tooltip.style.display = 'block';
    }

    // Then position it
    const direction = target.getAttribute('data-tooltip-direction') || 'top';
    positionTooltip(tooltip, target, direction);
  }, DELAY);
}

function hideTooltip() {
  clearTimeout(showTimeout!);

  hideTimeout = window.setTimeout(() => {
    if (tooltipElement) {
      try {
        tooltipElement.hidePopover?.();
      } catch (e) {
        tooltipElement.style.display = 'none';
      }
    }
    currentTarget = null;
  }, HIDE_DELAY);
}

export function TooltipProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.hasAttribute('data-tooltip')) {
        showTooltip(target);
      }
    };

    const handleMouseLeave = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.hasAttribute('data-tooltip')) {
        hideTooltip();
      }
    };

    const handleFocus = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (target.hasAttribute('data-tooltip')) {
        showTooltip(target);
      }
    };

    const handleBlur = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (target.hasAttribute('data-tooltip')) {
        hideTooltip();
      }
    };

    document.addEventListener('mouseenter', handleMouseEnter, true);
    document.addEventListener('mouseleave', handleMouseLeave, true);
    document.addEventListener('focus', handleFocus, true);
    document.addEventListener('blur', handleBlur, true);

    return () => {
      document.removeEventListener('mouseenter', handleMouseEnter, true);
      document.removeEventListener('mouseleave', handleMouseLeave, true);
      document.removeEventListener('focus', handleFocus, true);
      document.removeEventListener('blur', handleBlur, true);

      clearTimeout(showTimeout!);
      clearTimeout(hideTimeout!);

      if (tooltipElement) {
        tooltipElement.remove();
        tooltipElement = null;
      }
    };
  }, []);

  return <>{children}</>;
}
