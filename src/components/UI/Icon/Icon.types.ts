import { IconName } from '@fortawesome/fontawesome-svg-core';

import CUSTOM_ICONS from './icons';

export type IconSize = 's' | 'm' | 'l';

export type IconType = keyof typeof CUSTOM_ICONS | IconName;

export type Props = {
  className?: string;
  type: IconType;
  size: IconSize;
};
