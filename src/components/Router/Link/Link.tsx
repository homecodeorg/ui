import { useCallback, useRef } from 'react';
import { withStore } from 'justorm/react';
import cn from 'classnames';

import ExternalIcon from './icons/external.svg';
import S from './Link.styl';

const defaultProps = {
  isClear: false,
  isClearPadding: false,
  isDisabled: false,
};

export const Link = withStore({ router: ['path'] })(function ({
  className,
  exactClassName,
  children,
  isClear,
  isClearPadding,
  isDisabled,
  ...props
}) {
  const { href, store } = props;
  const { path } = store.router;
  const domElem = useRef(null);

  const isExternal = /\./.test(href);
  const isNested = !/^\//.test(href) && !isExternal;
  const isExact = href === path;

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
    props.href = `${path.replace(/\/$/, '')}/${href}`;
  }

  if (isExternal) {
    props.target = '_blank';

    if (!/^http/.test(href)) {
      props.href = `http://${href}`;
    }
  }

  const handleClick = useCallback(
    e => {
      if (!isExternal && path !== href) {
        e.preventDefault();
        store.router.go(props.href);
        domElem.current?.blur();
      }
    },
    [path, href, isExternal]
  );

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
