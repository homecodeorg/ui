import { useEffect, useRef } from 'react';

import { scrollIntoView } from '../../tools/scroll';

import S from './Heading.styl';
import * as T from './Heading.types';

export function Heading({ id, text }: T.Props) {
  const domElem = useRef(null);
  const hash = `#${id}`;

  useEffect(() => {
    if (location.hash === hash) scrollIntoView(domElem.current);
  }, []);

  return (
    <h2 className={S.root} ref={domElem}>
      <a name={id} href={`${location.pathname}${hash}`} className={S.link}>
        #
      </a>
      {text}
    </h2>
  );
}
