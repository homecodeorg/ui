import { memo, useEffect } from 'react';

import S from './Heading.styl';
import * as T from './Heading.types';

let subscribersCount = 0;
const idTmpl = (id: string) => `heading-${id}`;

function onClick(e) {
  const href = e.target?.getAttribute('href');
  if (!href || !/#/.test(href)) return;
  const [path, hash] = href.split('#');
  const heading = document.getElementById(idTmpl(hash));

  if (heading) {
    heading.scrollIntoView({ behavior: 'smooth' });
    e.stopPropagation();
  }
}

function subscribe() {
  if (subscribersCount === 0) {
    console.log('subscribed');
    window.addEventListener('click', onClick, true);
  }
  subscribersCount++;
}

function unsubscribe() {
  if (--subscribersCount === 0) {
    console.log('UNsubscribed');
    window.removeEventListener('click', onClick, true);
  }
}

export const Heading = memo(function Heading({ id, text }: T.Props) {
  const hash = `#${id}`;

  useEffect(() => {
    subscribe();
    return unsubscribe;
  });

  return (
    <h2 className={S.root} id={idTmpl(id)}>
      <a href={`${location.pathname}${hash}`} className={S.link}>
        #
      </a>
      {text}
    </h2>
  );
});
