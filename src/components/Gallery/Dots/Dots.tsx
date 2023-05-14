import cn from 'classnames';

import S from './Dots.styl';

export default function Dots({ index, count }) {
  return (
    <div className={S.root}>
      <div className={S.inner}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className={cn(S.item, i === index && S.active)} />
        ))}
      </div>
    </div>
  );
}
