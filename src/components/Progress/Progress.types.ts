import { Size } from 'uilib/types';

export interface CommonProgressProps {
  value: number;
  showPercentage?: boolean;
  size?: Size;
  className?: string;
}

export interface ProgressProps extends CommonProgressProps {
  alignText?: 'left' | 'center' | 'right';
}
