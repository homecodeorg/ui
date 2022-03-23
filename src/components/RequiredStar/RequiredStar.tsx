import cn from 'classnames';
import S from './RequiredStar.styl';
import { Icon } from '../Icon/Icon';

export function RequiredStar({ className = '', ...props }) {
  return (
    <Icon {...props} type="requiredStar" className={cn(S.root, className)} />
  );
}
