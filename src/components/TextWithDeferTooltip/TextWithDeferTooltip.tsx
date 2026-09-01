import { useRef, useState } from 'react';

import { Tooltip } from '../Tooltip/Tooltip';
import S from './TextWithDeferTooltip.styl';
import type { TextWithDeferTooltipProps } from './TextWithDeferTooltip.types';

function clipsOverflow(style: CSSStyleDeclaration, axis: 'x' | 'y') {
  const overflow = axis === 'x' ? style.overflowX : style.overflowY;
  if (overflow === 'hidden' || overflow === 'auto' || overflow === 'scroll') {
    return true;
  }
  if (axis === 'x' && style.textOverflow === 'ellipsis') return true;
  if (
    axis === 'y' &&
    style.webkitLineClamp &&
    style.webkitLineClamp !== 'none'
  ) {
    return true;
  }
  return false;
}

function isNodeOverflowing(node: HTMLElement) {
  const style = getComputedStyle(node);
  if (clipsOverflow(style, 'x') && node.scrollWidth - node.clientWidth > 1) {
    return true;
  }
  if (clipsOverflow(style, 'y') && node.scrollHeight - node.clientHeight > 1) {
    return true;
  }
  return false;
}

function isTextOverflowing(root: HTMLElement) {
  if (isNodeOverflowing(root)) return true;
  for (const child of root.querySelectorAll<HTMLElement>('*')) {
    if (isNodeOverflowing(child)) return true;
  }
  return false;
}

function TextWithDeferTooltip({
  className,
  children,
  width,
  maxWidth,
  side = 'bottom',
  overTrigger = false,
  ...props
}: TextWithDeferTooltipProps) {
  const [withTooltip, setWithTooltip] = useState(false);
  const [tooltipWidth, setTooltipWidth] = useState<number>();
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseLeave = () => setWithTooltip(false);

  const handleMouseEnter = () => {
    if (!ref.current) return;

    if (isTextOverflowing(ref.current)) {
      if (width != null) {
        setTooltipWidth(width);
      } else {
        setTooltipWidth(ref.current.getBoundingClientRect().width);
      }
      setWithTooltip(true);
    }
  };

  const tooltipContent =
    maxWidth != null || tooltipWidth != null ? (
      <div
        style={{
          ...(maxWidth != null && { maxWidth: `${maxWidth}px` }),
          ...(tooltipWidth != null &&
            !overTrigger && { width: `${tooltipWidth}px` }),
        }}
      >
        {children}
      </div>
    ) : (
      children
    );

  return (
    <Tooltip
      className={S.tooltipTrigger}
      content={tooltipContent}
      contentClassName={
        (maxWidth != null || tooltipWidth != null) && !overTrigger
          ? S.tooltipShell
          : undefined
      }
      disabled={!withTooltip}
      direction={overTrigger ? 'bottom' : side}
      overTrigger={overTrigger}
    >
      <div
        ref={ref}
        className={className}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {children}
      </div>
    </Tooltip>
  );
}

export { TextWithDeferTooltip };
