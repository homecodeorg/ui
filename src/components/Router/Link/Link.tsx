import { Component, createRef, HTMLProps } from 'react';
import { withStore } from 'justorm/react';
import cn from 'classnames';

import { Icon } from 'uilib';

import Context from '../context';
import type { ContextType } from '../context';
import S from './Link.styl';

import * as T from './Link.types';

@withStore({ router: ['path'] })
export class Link extends Component<T.Props> {
  domElem = createRef<HTMLAnchorElement>();
  rootPath = '';

  // declare context: React.ContextType<typeof Context>;
  static contextType = Context;

  static defaultProps = {
    isClear: false,
    inline: false,
    isDisabled: false,
  };

  getHref() {
    let href = this.props.href;

    if (this.isStartFromDoubleSlash()) href = href.replace(/^\//, '');

    if (href === '/') href = '';

    return `${this.getRootPath()}${href}`;
  }

  isExternal = () => /\./.test(this.props.href);

  isStartFromDoubleSlash = () => /^\/\//.test(this.props.href);

  getRootPath = () => {
    if (this.isExternal() || this.isStartFromDoubleSlash()) return '';
    const { rootPath } = this.context as ContextType;
    return rootPath ?? '';
  };

  onClick = e => {
    const { onClick, store } = this.props;
    const { router } = store;
    const href = this.getHref();

    onClick?.(e, href);

    if (!this.isExternal() && router.path !== href) {
      e.preventDefault();
      router.go(href);
      this.domElem.current?.blur();
    }
  };

  isExact(href = this.getHref()) {
    const { store, isPartialExact } = this.props;
    const { path } = store.router;

    if (isPartialExact) {
      const pathSections = path.replace(/#.+/, '').split('/');
      const hrefSections = href.replace(/#.+/, '').split('/');
      const minLength = Math.min(pathSections.length, hrefSections.length);

      return (
        hrefSections.slice(0, minLength).join('/') ===
        pathSections.slice(0, minLength).join('/')
      );
    }

    return path === href;
  }

  render() {
    const {
      className,
      exactClassName,
      children,
      isClear,
      isDisabled,
      inline,
      store,
      isPartialExact,
      ...rest
    } = this.props;
    const { path } = store.router;
    const href = this.getHref();
    const props = { ...rest, href } as HTMLProps<HTMLAnchorElement>;

    const isExternal = /\./.test(href);
    const isNested = !/^\//.test(href) && !isExternal;
    const isExact = this.isExact();

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
      <a /* eslint-disable-line */
        className={classes}
        {...props}
        onClick={this.onClick}
        ref={this.domElem}
      >
        {children}
        {isExternal && <Icon type="externalLink" className={S.externalIcon} />}
      </a>
    );
  }
}
