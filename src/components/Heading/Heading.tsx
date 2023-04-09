import { memo, useEffect } from 'react';
import { scrollIntoView } from 'uilib/tools/scroll';

import S from './Heading.styl';
import * as T from './Heading.types';

let subscribersCount = 0;

function onClick(e) {
  const href = e.target?.getAttribute('href');
  if (!href || !/#/.test(href)) return;
  const [path, hash] = href.split('#');
  const heading = document.getElementById(hash);

  if (heading) {
    scrollIntoView(heading);
    e.stopPropagation();
  }
}

function subscribe() {
  if (subscribersCount === 0) {
    window.addEventListener('click', onClick, true);
  }
  subscribersCount++;
}

function unsubscribe() {
  if (--subscribersCount === 0) {
    window.removeEventListener('click', onClick, true);
  }
}

export const Heading = memo(function Heading({ id, text }: T.Props) {
  useEffect(() => {
    subscribe();
    return unsubscribe;
  });

  return (
    <h2 className={S.root} id={id}>
      <a href={`${location.pathname}#${id}`} className={S.link}>
        #
      </a>
      {text}
    </h2>
  );
});
