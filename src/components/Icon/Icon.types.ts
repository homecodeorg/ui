import * as CUSTOM_ICONS from './icons';

export type IconSize = 's' | 'm' | 'l';

export type IconType = keyof typeof CUSTOM_ICONS;

export type Props = {
  className?: string;
  type: IconType;
  size: IconSize;
};
