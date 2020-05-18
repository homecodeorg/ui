import { useRef } from 'preact/hooks';
import { withStore } from 'justorm/preact';
import cn from 'classnames';

import store from '../store';
import ExternalIcon from './icons/external.svg';
import s from './Link.styl';

const defaultProps = {
  isClear: false,
  isClearPadding: false,
  isDisabled: false,
};

export const Link = withStore({ router: true })(function ({
  className,
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
    s.root,
    isDisabled && s.disabled,
    isExternal && s.external,
    isExact && s.exact,
    isClear && s.clear,
    isClearPadding && s.clearPadding,
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
      {isExternal && <ExternalIcon class={s.externalIcon} />}
    </a>
  );
});

Link.defaultProps = defaultProps;
