import { ReactNode, HTMLAttributes } from 'react';
import { Size, ComponentType } from '../../types';

export type Props = HTMLAttributes<HTMLInputElement> &
  ComponentType & {
    // Used to associate the toggle with its label
    label?: ReactNode;
    // Whether the toggle is currently selected
    checked?: boolean;
    // Whether the toggle is disabled
    disabled?: boolean;
    // Defines an error message or error status for the toggle
    error?: string | boolean;
    // Size of the toggle
    size?: Size;
    // Variant style for the toggle
    variant?: 'default' | 'outlined';
  };
