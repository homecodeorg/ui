import cn from 'classnames';
import { useCallback } from 'react';
import { isBrowser, Link } from 'uilib';

import S from './Text.styl';

const textToAnchorId = text => text.toLowerCase().split(' ').join('_');
const getPath = () => (isBrowser && location.pathname) ?? '/';
const scrollIntoHeader = id => document.getElementById(id)?.scrollIntoView();

function useAnchor(text) {
  if (typeof text !== 'string') return [];

  const id = textToAnchorId(text);
  const href = `${getPath()}#${id}`;

  const scrollUp = useCallback(() => scrollIntoHeader(id), [id]);

  return [
    id,
    <>
      &nbsp;
      <Link href={href} className={S.anchor} onClick={scrollUp}>
        #
      </Link>
    </>,
  ];
}

function H({ As, className, children, anchor, ...rest }) {
  const [id, anchorEl] = useAnchor(anchor ?? children);

  return (
    <As {...rest} className={cn(S.heading, className)} id={id}>
      {children}
      {anchorEl}
    </As>
  );
}

export const H1 = props => <H {...props} As="h1" anchor={false} />;
export const H2 = props => <H {...props} As="h2" />;
export const H3 = props => <H {...props} As="h3" />;
export const H4 = props => <H {...props} As="h4" />;
export const H5 = props => <H {...props} As="h5" />;
export const H6 = props => <H {...props} As="h6" />;

if (isBrowser) {
  window.addEventListener('load', () => {
    scrollIntoHeader(location.hash.slice(1));
  });
}
