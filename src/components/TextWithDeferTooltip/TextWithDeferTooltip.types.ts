import { HTMLAttributes } from 'react';

export type TooltipSide = 'top' | 'bottom' | 'left' | 'right';

export type Props = HTMLAttributes<HTMLDivElement> & {
  // Explicit tooltip content width in px. Defaults to trigger width.
  width?: number;
  // Max width of the tooltip popover content, in px.
  maxWidth?: number;
  // Tooltip placement when not using overTrigger mode.
  side?: TooltipSide;
  // Expand tooltip over the trigger with matching typography.
  overTrigger?: boolean;
};

export type TextWithDeferTooltipProps = Props;
