import cn from 'classnames';

import { Size } from 'uilib/types';

import S from './Shimmer.styl';

type ShimmerProps = {
  className?: string;
  size?: Size;
};

const Shimmer = ({ className, size = 'm' }: ShimmerProps) => (
  <div className={cn(S.root, className, S[`size-${size}`])}>
    <div className={S.inner} />
  </div>
);

export default Shimmer;
