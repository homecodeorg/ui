import cn from 'classnames';

import { Icon } from '../Icon/Icon';

import S from './RequiredStar.styl';
import * as T from './RequiredStar.types';

export function RequiredStar({ className = '', ...props }: T.Props) {
  return (
    <Icon {...props} type="requiredStar" className={cn(S.root, className)} />
  );
}
