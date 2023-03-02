import { HTMLProps, HTMLAttributes } from 'react';

import type { ComponentType, Size } from '../../types';

type OffsetAxis = { before?: number; after?: number };

type Offset = { x?: OffsetAxis; y?: OffsetAxis };

export type Props = Omit<HTMLProps<HTMLDivElement>, 'size'> &
  ComponentType & {
    // CSS class to apply to the inner container element
    innerClassName?: string;
    // CSS class to apply to the scrollbar thumb element
    thumbClassName?: string;
    // Additional HTML attributes to apply to the inner container element
    innerProps?: HTMLAttributes<HTMLDivElement>;
    // Whether to display an extra-wide scrollbar thumb.
    extraWide?: boolean;
    // Whether to enable horizontal scrolling.
    x?: boolean;
    // Whether to enable vertical scrolling.
    y?: boolean;
    size?: Size;
    // Enables scroll-behavior smooth (default false).
    smooth?: boolean;
    // Whether to automatically hide the scrollbar when not in use (default false).
    autoHide?: boolean;
    offset?: Offset;
    // Called when the <Scroll> component is scrolled.
    onScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
  };
