import { useRef } from 'react';
import { withStore } from 'justorm/react';
import cn from 'classnames';

import store from '../store';
import ExternalIcon from './icons/external.svg';
import S from './Link.styl';

const defaultProps = {
  isClear: false,
  isClearPadding: false,
  isDisabled: false,
};

export const Link = withStore({ router: true })(function ({
  className,
  exactClassName,
  children,
  isClear,
  isClearPadding,
  isDisabled,
  ...props
}) {
  const { href } = props;
  const { pathname } = window.location;
  const domElem = useRef(null);

  const isExternal = /\./.test(href);
  const isNested = !/^\//.test(href) && !isExternal;
  const isExact = href === pathname;

  const classes = cn(
    S.root,
    isDisabled && S.disabled,
    isExternal && S.external,
    isExact && cn(S.exact, exactClassName),
    isClear && S.clear,
    isClearPadding && S.clearPadding,
    className
  );

  if (isNested) {
    props.href = `${pathname.replace(/\/$/, '')}/${href}`;
  }

  if (isExternal) {
    props.target = '_blank';

    if (!/^http/.test(href)) {
      props.href = `http://${href}`;
    }
  }

  function handleClick(e) {
    if (!isExternal && window.location.pathname !== props.href) {
      e.preventDefault();
      store.navigate(props.href);
      domElem.current?.blur();
    }
  }

  return (
    <a /* eslint-disable-line */
      className={classes}
      {...props}
      onClick={handleClick}
      ref={domElem}
    >
      {children}
      {isExternal && <ExternalIcon class={S.externalIcon} />}
    </a>
  );
});

Link.defaultProps = defaultProps;
