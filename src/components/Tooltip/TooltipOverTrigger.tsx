/// <reference path="./types.d.ts" />
import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import S from './Tooltip.styl';
import { TooltipCore, TooltipPositionSetupOptions } from './TooltipCore';
import type { TooltipProps } from './Tooltip';
import {
  applyTriggerTextStyles,
  clearTriggerTextStyles,
  getTextStyleSource,
} from './tooltipTextStyles';

function parsePx(value: string) {
  return Number.parseFloat(value) || 0;
}

function applyOverTriggerStyles(
  contentEl: HTMLElement,
  triggerEl: HTMLElement
) {
  const rect = triggerEl.getBoundingClientRect();
  const contentComputed = window.getComputedStyle(contentEl);

  const paddingLeft = parsePx(contentComputed.paddingLeft);
  const paddingRight = parsePx(contentComputed.paddingRight);
  const paddingTop = parsePx(contentComputed.paddingTop);
  const borderLeft = parsePx(contentComputed.borderLeftWidth);
  const borderRight = parsePx(contentComputed.borderRightWidth);
  const borderTop = parsePx(contentComputed.borderTopWidth);

  contentEl.style.setProperty(
    'left',
    `${rect.left - paddingLeft - borderLeft}px`
  );
  contentEl.style.setProperty('top', `${rect.top - paddingTop - borderTop}px`);
  contentEl.style.setProperty('transform', 'none');
  contentEl.style.width = `${rect.width + paddingLeft + paddingRight + borderLeft + borderRight}px`;
  contentEl.style.boxSizing = 'border-box';
  applyTriggerTextStyles(contentEl, getTextStyleSource(triggerEl));
  // Trigger ancestors (e.g. menu items) often use nowrap for ellipsis; allow wrap here.
  contentEl.style.setProperty('white-space', 'normal');
  contentEl.style.setProperty('overflow-wrap', 'break-word');
}

function clearOverTriggerStyles(contentEl: HTMLElement | null) {
  if (!contentEl) return;

  contentEl.style.removeProperty('left');
  contentEl.style.removeProperty('top');
  contentEl.style.removeProperty('transform');
  contentEl.style.removeProperty('width');
  contentEl.style.removeProperty('box-sizing');
  contentEl.style.removeProperty('white-space');
  contentEl.style.removeProperty('overflow-wrap');
  clearTriggerTextStyles(contentEl);
}

const useOverTriggerPositionSetup = ({
  triggerRef,
  tooltipRef,
  content,
  delay,
}: TooltipPositionSetupOptions) => {
  const timeoutRef = useRef<number>();

  const updateOverTriggerPosition = useCallback(() => {
    const triggerEl = triggerRef.current;
    const contentEl = tooltipRef.current;
    if (!triggerEl || !contentEl) return;

    applyOverTriggerStyles(contentEl, triggerEl);
  }, [tooltipRef, triggerRef]);

  useLayoutEffect(() => {
    let frameId = 0;

    const tick = () => {
      updateOverTriggerPosition();
      frameId = requestAnimationFrame(tick);
    };

    tick();

    window.addEventListener('scroll', updateOverTriggerPosition, true);
    window.addEventListener('resize', updateOverTriggerPosition);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('scroll', updateOverTriggerPosition, true);
      window.removeEventListener('resize', updateOverTriggerPosition);
      clearOverTriggerStyles(tooltipRef.current);
    };
  }, [tooltipRef, updateOverTriggerPosition]);

  useEffect(() => {
    const trigger = triggerRef.current;
    const tooltip = tooltipRef.current;
    if (!trigger || !tooltip) return;

    const showTooltip = () => {
      timeoutRef.current = window.setTimeout(() => {
        tooltip.showPopover?.();
        updateOverTriggerPosition();
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
  }, [content, delay, tooltipRef, triggerRef, updateOverTriggerPosition]);
};

const TooltipOverTrigger = (
  props: Omit<TooltipProps, 'disabled' | 'overTrigger'>
) => (
  <TooltipCore
    usePositionSetup={useOverTriggerPositionSetup}
    tooltipExtraClass={S.tooltipOverTrigger}
    dataDirection={undefined}
    {...props}
  />
);

export default TooltipOverTrigger;
