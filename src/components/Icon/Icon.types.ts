import { ComponentType, Size } from 'uilib/types';

import CUSTOM_ICONS from './icons';

export type IconSize = 'xs' | Size;

// full list of icons here - https://github.com/foreverido/uilib/tree/master/src/components/Icon/icons
export type IconType = keyof typeof CUSTOM_ICONS;

export type Props = ComponentType & {
  type: IconType;
  size: IconSize;
};
