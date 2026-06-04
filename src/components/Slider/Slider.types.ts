import { ReactNode, ChangeEvent, FormEvent, InputHTMLAttributes } from 'react';

import { Size, ComponentType } from '../../types';
import { TooltipProps } from 'uilib';

export type SliderMarker = {
  key?: string;
  value: number;
  label?: ReactNode;
};

export type Props = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'size' | 'onChange' | 'value'
> &
  ComponentType & {
    value: number;
    min?: number;
    max?: number;
    step?: number;
    size?: Size;
    disabled?: boolean;
    showGhost?: boolean;
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
