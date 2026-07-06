import { useRef, useState } from 'react';

import { Tooltip } from '../Tooltip/Tooltip';
import S from './TextWithDeferTooltip.styl';
import type { TextWithDeferTooltipProps } from './TextWithDeferTooltip.types';

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

    const isOverflowingHorizontally =
      ref.current.scrollWidth - ref.current.clientWidth > 3;
    const isOverflowingVertically =
      ref.current.scrollHeight - ref.current.clientHeight > 3;

    if (isOverflowingHorizontally || isOverflowingVertically) {
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
