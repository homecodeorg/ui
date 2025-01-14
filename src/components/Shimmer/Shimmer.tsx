import S from './Shimmer.styl';
import { Size } from 'uilib/types';
import cn from 'classnames';

export type ShimmerProps = {
  className?: string;
  size?: Size;
};

export const Shimmer = ({ className, size = 'm' }: ShimmerProps) => (
  <div className={cn(S.root, className, S[`size-${size}`])}>
    <div className={S.inner} />
  </div>
);
