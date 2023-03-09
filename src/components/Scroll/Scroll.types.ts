import { ReactNode, HTMLAttributes } from 'react';

import type { ComponentType, Size } from '../../types';

type OffsetAxis = { before?: number; after?: number };

type Offset = { x?: OffsetAxis; y?: OffsetAxis };

export type Props = ComponentType &
  HTMLAttributes<HTMLDivElement> & {
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
    // Scrollbars size.
    size?: Size;
    // Enables scroll-behavior smooth (default false).
    smooth?: boolean;
    // Whether to automatically hide the scrollbar when not in use (default false).
    autoHide?: boolean;
    // Offset to apply to the scrollbar.
    offset?: Offset;
    // Called when the <Scroll> component is scrolled.
    onScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
    children: ReactNode;
  };
