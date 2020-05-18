import cn from 'classnames';

import ICONS from './icons';

import S from './Icon.styl';
import * as T from './Icon.types';

export function Icon(props: T.Props) {
  const { className, type, size, ...rest } = props;
  const iconProps = {
    className: cn(S.root, S[`size-${size}`], className),
    role: 'img',
    ...rest,
  };
  const LocalIcon = ICONS[type];

  return <LocalIcon {...iconProps} />;
}

Icon.defaultProps = {
  size: 's' as T.IconSize,
};
