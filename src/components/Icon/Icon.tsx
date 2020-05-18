import React from 'react';
import cn from 'classnames';

import * as FaIcons from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@aduh95/preact-fontawesome';

import CUSTOM_ICONS from './icons';

import S from './Icon.styl';
import * as H from './Icon.helpers';
import * as T from './Icon.types';

function Icon(props: T.Props) {
  const { className, type, size, ...rest } = props;
  const iconProps = {
    className: cn(S.root, S[`size-${size}`], className),
    role: 'img',
    ...rest,
  };
  const CustomIcon = CUSTOM_ICONS[type];

  if (CustomIcon) return <CustomIcon {...iconProps} />;

  const iconName = H.createFaName(type);

  return <FontAwesomeIcon {...iconProps} icon={FaIcons[iconName]} />;
}

Icon.defaultProps = {
  size: 's' as T.IconSize,
};

export default Icon;
