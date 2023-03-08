import { ReactNode, HTMLAttributes } from 'react';

import { Size, ComponentType } from '../../types';

export type Props = HTMLAttributes<HTMLInputElement> &
  ComponentType & {
    // Used to associate the checkbox with its label.
    // This allows users to click on the label instead of the small checkbox,
    // which can be especially helpful for users with mobility or vision impairments.
    //
    // It can also improve the SEO of the page,
    // as search engines can use the label text to better understand the content of the page.
    label?: ReactNode;
    // Whether the checkbox is currently selected
    checked?: boolean;
    // Defines an error message or error status for the input field
    error?: string | boolean;
    // Size of the checkbox
    size?: Size;
    variant?: 'default' | 'outlined';
  };
