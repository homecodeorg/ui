import { Size } from 'uilib/types';

export interface CommonProgressProps {
  value: number;
  showPercentage?: boolean;
  size?: Size;
}

export interface ProgressProps extends CommonProgressProps {
  alignText?: 'left' | 'center' | 'right';
}
