import cn from 'classnames';

import S from './Icon.styl';
import * as T from './Icon.types';

import * as icons from './icons';

export type { IconType } from './Icon.types';

export function Icon(props: T.Props) {
  const { className, icon: CustomIcon, type, size = 'm', ...rest } = props;

  const iconProps = {
    className: cn(S.root, S[`size-${size}`], className),
    role: 'img',
    ...rest,
  };

  if (CustomIcon) return <CustomIcon {...iconProps} />;

  const LibIcon = icons[type];
  if (LibIcon) return <LibIcon {...iconProps} />;

  return null;
}
