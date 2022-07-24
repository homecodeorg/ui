import { Component, createRef } from 'react';
import cn from 'classnames';
import Time from 'timen';

import S from './Label.styl';
import * as H from './Label.helpers';
import * as T from './Label.types';

export class Label extends Component<T.Props> {
  gapWrapRef = createRef<HTMLDivElement>();
  gapRef = createRef<HTMLDivElement>();

  timers: any;
  state = { clipPath: '' };
  labelWidth = 0;

  static defaultProps = {
    size: 'm',
  };

  constructor(props) {
    super(props);
    this.timers = Time.create();
  }

  componentDidMount() {
    this.updateClipPath();
  }

  componentDidUpdate(prevProps) {
    const { children, isOnTop, size, onClipPathChange } = this.props;
    const needUpadte =
      onClipPathChange &&
      (children !== prevProps.children ||
        isOnTop !== prevProps.isOnTop ||
        size !== prevProps.size);

    if (needUpadte) this.updateClipPath();
  }

  updateClipPath = () => {
    const { isOnTop, onClipPathChange, size } = this.props;
    const gapWrapElem = this.gapWrapRef?.current;
    const gapElem = this.gapRef?.current;

    if (!onClipPathChange || !gapWrapElem || !gapElem) return;

    // @ts-ignore
    const { offsetLeft } = gapWrapElem;
    const { offsetWidth } = gapElem;
    const labelWidth = isOnTop ? offsetWidth : 0;

    if (this.labelWidth === labelWidth) return;

    this.labelWidth = labelWidth;

    const clipPath = H.getLabelClipPath(offsetLeft, labelWidth, size);

    onClipPathChange(clipPath);
  };

  render() {
    const { className, size, disabled, isOnTop, isFocused, isError, children } =
      this.props;
    const classes = cn(
      S.root,
      S[`size-${size}`],
      disabled && S.disabled,
      isOnTop && S.onTop,
      isFocused && S.isFocused,
      isError && S.isError,
      className
    );

    if (!children) return null;

    return (
      <div className={classes}>
        <div className={S.view}>
          <div>{children}</div>
        </div>
        <div className={S.gapWrap} ref={this.gapWrapRef}>
          <div className={S.gap} ref={this.gapRef}>
            {children}
          </div>
        </div>
      </div>
    );
  }
}
