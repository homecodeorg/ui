import cn from 'classnames';

import { Lazy } from 'uilib/components/Lazy/Lazy';

import S from './Icon.styl';
import * as T from './Icon.types';
import ICONS from './icons';

export const icons = ICONS;

export type { IconType } from './Icon.types';

export function Icon(props: T.Props) {
  const { className, type, size, ...rest } = props;
  const iconProps = {
    className: cn(S.root, S[`size-${size}`], className),
    role: 'img',
    ...rest,
  };
  const localIcon = ICONS[type];

  if (!localIcon) {
    console.warn(`Icon: type="${type}" is unknown`);
    return null;
  }

  // @ts-ignore
  return <Lazy loader={localIcon} hideSpinner {...iconProps} />;
}

Icon.defaultProps = {
  size: 'm' as T.IconSize,
};
