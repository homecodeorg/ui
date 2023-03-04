import { HTMLProps, MouseEvent } from 'react';

import { ComponentType } from 'uilib/types';

export type Props = HTMLProps<HTMLAnchorElement> &
  ComponentType & {
    store?: any;
    // CSS class name that will be added to the link when it is active.
    exactClassName?: string;
    // Whether the link should be considered active if the current URL partially matches the link's destination URL.
    isPartialExact?: boolean;
    // Whether the link should be disabled and unclickable.
    isDisabled?: boolean;
    // Whether the link should be rendered without underline.
    isClear?: boolean;
    // Whether the link should be rendered without paddings.
    inline?: boolean;
    // Called when the link is clicked.
    onClick?: (e: MouseEvent<HTMLAnchorElement>, href: string) => void;
  };
