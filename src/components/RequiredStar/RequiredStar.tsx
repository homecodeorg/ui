import cn from 'classnames';
import { Icon } from 'uilib';

import S from './RequiredStar.styl';
import * as T from './RequiredStar.types';

export function RequiredStar(props: T.Props) {
  const { className, inline, ...rest } = props;
  const classes = cn(S.root, className, inline && S.inline);

  return <Icon {...rest} type="requiredStar" className={classes} />;
}
