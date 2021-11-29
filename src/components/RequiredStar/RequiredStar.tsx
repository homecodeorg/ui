import cn from 'classnames';
import S from './RequiredStar.styl';

export function RequiredStar({ className = '', size }) {
  return <div className={cn(S.root, S[`size-${size}`], className)} />;
}
