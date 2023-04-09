import { useCallback, useContext, useMemo, useRef } from 'react';
import { withStore } from 'justorm/react';
import cn from 'classnames';

import { Icon } from 'uilib/components/Icon/Icon';

import Context from '../context';
import S from './Link.styl';

import * as T from './Link.types';

const isStartFromDoubleSlash = href => /^\/\//.test(href);

export const Link = withStore({ router: ['path'] })(
  ({
    className,
    exactClassName,
    children,
    href: hrefProp,
    isClear = false,
    isDisabled = false,
    disableExternalIcon = false,
    inline = false,
    store: { router },
    isPartialExact = false,
    onClick,
    ...rest
  }: T.Props) => {
    const { path } = router;
    const isFromRoot = isStartFromDoubleSlash(hrefProp);

    const domElem = useRef(null);
    const { basePath } = useContext(Context);

    const isExternal = useMemo(() => /\./.test(hrefProp), [hrefProp]);
    const rootPath = useMemo(() => {
      if (isExternal || isFromRoot) return '';
      return basePath ?? '';
    }, [isExternal, isFromRoot, basePath]);

    const href = useMemo(() => {
      let str = hrefProp;

      if (isFromRoot) str = str.replace(/^\//, '');

      if (str === '/') str = '';

      return `${rootPath}${str}`;
    }, [hrefProp, rootPath]);

    const handleClick = useCallback(
      e => {
        onClick?.(e, href);
        if (!isExternal && router.path !== href) {
          e.preventDefault();
          router.go(href);
          domElem.current?.blur();
        }
      },
      [href, isExternal, onClick]
    );

    const isExact = useMemo(() => {
      if (isPartialExact) return path.startsWith(href);
      return path === href;
    }, [path, href, isPartialExact]);

    const props = { ...rest, href };
    const isNested = !/^\//.test(href) && !isExternal;

    const classes = cn(
      S.root,
      isDisabled && S.disabled,
      isExternal && S.external,
      isExact && cn(S.exact, exactClassName),
      isClear && S.clear,
      inline && S.inline,
      className
    );

    if (isNested) {
      props.href = `${path.replace(/\/$/, '')}/${href}`;
    }

    if (isExternal) {
      props.target = '_blank';
      if (!/^http/.test(href)) props.href = `http://${href}`;
    }

    return (
      <a className={classes} {...props} onClick={handleClick} ref={domElem}>
        {children}
        {isExternal && !disableExternalIcon && (
          <Icon type="externalLink" className={S.externalIcon} />
        )}
      </a>
    );
  }
);
