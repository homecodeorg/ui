import { Component, HTMLProps } from 'react';
import { withStore } from 'justorm/react';
import cn from 'classnames';

import ExternalIcon from './icons/external.svg';
import Context from '../context';
import S from './Link.styl';

type Props = HTMLProps<HTMLAnchorElement> & {
  store?: any;
  className?: string;
  exactClassName?: string;
  isPartialExact?: boolean;
  isDisabled?: boolean;
  isClear?: boolean;
  isClearPadding?: boolean;
};

@withStore({ router: ['path'] })
export class Link extends Component<Props> {
  rootPath = '';

  static contextType = Context;
  static defaultProps = {
    isClear: false,
    isClearPadding: false,
    isDisabled: false,
  };

  getHref() {
    const { href } = this.props;
    const { rootPath = '' } = this.context;

    return `${rootPath}${href === '/' ? '' : href}`;
  }

  isExternal = () => /\./.test(this.getHref());

  onClick = e => {
    const { router } = this.props.store;
    const href = this.getHref();

    if (!this.isExternal() && router.path !== href) {
      e.preventDefault();
      router.go(href);
    }
  };

  isExact(href = this.getHref()) {
    const { store, isPartialExact } = this.props;
    const { path } = store.router;

    if (isPartialExact) return new RegExp(`^${href}`).test(path);
    return path === href;
  }

  renderLink = () => {
    const {
      className,
      exactClassName,
      children,
      isClear,
      isClearPadding,
      isDisabled,
      store,
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
      isClearPadding && S.clearPadding,
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
      >
        {children}
        {isExternal && <ExternalIcon class={S.externalIcon} />}
      </a>
    );
  };

  render() {
    return this.renderLink();
    // return <Context.Consumer>{this.renderLink}</Context.Consumer>;
  }
}
