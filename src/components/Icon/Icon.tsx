import cn from 'classnames';

import S from './Icon.styl';
import * as T from './Icon.types';
import * as ICONS from './icons';

export function Icon(props: T.Props) {
  const { className, type, size, ...rest } = props;
  const iconProps = {
    className: cn(S.root, S[`size-${size}`], className),
    role: 'img',
    ...rest,
  };
  const LocalIcon = ICONS[type];

  if (!LocalIcon) {
    console.warn(`Icon: type="${type}" is unknown`);
    return null;
  }

  return <LocalIcon {...iconProps} />;
}

Icon.defaultProps = {
  size: 's' as T.IconSize,
};
