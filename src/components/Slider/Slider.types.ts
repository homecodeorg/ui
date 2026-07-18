import {
  ReactNode,
  ChangeEvent,
  FormEvent,
  InputHTMLAttributes,
  Ref,
} from 'react';

import { Size, ComponentType } from '../../types';
import { TooltipProps } from 'uilib';

export type SliderMarker = {
  key?: string;
  value: number;
  label?: ReactNode;
};

export type Props = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'size' | 'onChange' | 'value' | 'defaultValue'
> &
  ComponentType & {
    /** Controlled value. Omit for uncontrolled (DOM-driven) mode. */
    value?: number;
    defaultValue?: number;
    /** Ref to the underlying range input (for DOM-direct updates). */
    inputRef?: Ref<HTMLInputElement>;
    min?: number;
    max?: number;
    step?: number;
    size?: Size;
    disabled?: boolean;
    showGhost?: boolean;
    /** Vertical orientation; fills parent height. Default horizontal. */
    vertical?: boolean;
    label?: ReactNode;
    markers?: SliderMarker[];
    markerClassName?: string;
    markerTooltipProps?: Partial<TooltipProps>;
    onMarkerClick?: (value: number) => void;
    onChange?: (
      value: number,
      e: ChangeEvent<HTMLInputElement> | FormEvent<HTMLInputElement>
    ) => void;
  };
