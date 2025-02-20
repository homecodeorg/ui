import S from './Shimmer.styl';
import { Size } from 'uilib/types';
import cn from 'classnames';

export type ShimmerProps = {
  className?: string;
  size?: Size;
  round?: boolean;
};

export const Shimmer = ({
  className,
  size = 'm',
  round = false,
}: ShimmerProps) => (
  <div className={cn(S.root, className, S[`size-${size}`], round && S.round)}>
    <div className={S.inner} />
  </div>
);
