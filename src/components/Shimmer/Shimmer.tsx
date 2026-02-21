import S from './Shimmer.styl';
import { Size } from 'uilib/types';
import cn from 'classnames';

export type ShimmerProps = {
  className?: string;
  size?: Size;
  round?: boolean;
  children?: React.ReactNode;
};

export const Shimmer = ({
  className,
  size = 'm',
  round = false,
  children,
}: ShimmerProps) => (
  <div className={cn(S.root, className, S[`size-${size}`], round && S.round)}>
    <div className={S.inner}>{children}</div>
  </div>
);
