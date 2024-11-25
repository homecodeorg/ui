import { Component, createRef } from 'react';
import cn from 'classnames';
import { createStore } from 'justorm/react';
import omit from 'lodash.omit';
import Time from 'timen';

import { isTouch } from 'uilib/tools/dom';
import * as resizeObserver from 'uilib/tools/resizeObserver';

import S from './Scroll.styl';
import * as T from './Scroll.types';
import debounce from 'uilib/tools/debounce';

const getEventCoords = e => ({
  x: e.clientX,
  y: e.clientY,
});

const OFFSET_THRESHOL = 5;
const AXES = ['x', 'y'];
const BY_AXIS = {
  x: {
    scrollPos: 'scrollLeft',
    scrollSize: 'scrollWidth',
    size: 'width',
    offsetSize: 'offsetWidth',
    innerSize: 'clientWidth',
    posField: 'left',
  },
  y: {
    scrollPos: 'scrollTop',
    scrollSize: 'scrollHeight',
    size: 'height',
    offsetSize: 'offsetHeight',
    innerSize: 'clientHeight',
    posField: 'top',
  },
};

export class Scroll extends Component<T.Props> {
  innerElem: HTMLDivElement;
  onInnerRef = elem => {
    if (this.innerElem) {
      resizeObserver.unobserve(this.innerElem, this.updateAll);
    }

    this.innerElem = elem;
    this.props.onInnerRef?.(elem);

    if (elem) {
      this.updateAll();
      resizeObserver.observe(elem, this.updateAll);
    }
  };

  thumbELem = {
    x: createRef<HTMLDivElement>(),
    y: createRef<HTMLDivElement>(),
  };

  store;
  isTouch;
  timers = Time.create();

  currAxis;
  pos = { x: 0, y: 0 };
  prevCoords = { x: 0, y: 0 };
  prevScrolls = { x: 0, y: 0 };
  prevBoundings = { x: 0, y: 0 };

  unsubscribeScrollHeightObserver;

  static defaultProps = { size: 'm' };

  constructor(props) {
    super(props);
    this.isTouch = isTouch();
    this.store = createStore(this, {
      isScrolling: false,
      activeAxis: null,
      coeff: { x: 0, y: 0 },
      hasOffset: {
        top: false,
        left: false,
        right: false,
        bottom: false,
      },
    });
  }

  componentDidMount() {
    this.updateAll();

    this.unsubscribeScrollHeightObserver = Time.every(
      100,
      this.observeScrollHeight
    );

    document.addEventListener('scroll', this.onDocScroll);
  }

  componentWillUnmount() {
    this.unsubscribeScrollHeightObserver?.();
    this.unsubscribePointerMoveUp();
    document.removeEventListener('scroll', this.onDocScroll);
  }

  eachAxis = fn => AXES.map(axis => this.props[axis] && fn(axis));

  observeScrollHeight = () => {
    this.eachAxis(axis => {
      const needUpdate =
        (this.props[axis] && this.isScrollSizeChanged(axis)) ||
        this.isBoudingsChanged(axis);

      if (needUpdate) this.update(axis);
    });
  };

  isScrollSizeChanged(axis) {
    const currScrolls = this.getScrollSize(axis);
    const isChanged = this.prevScrolls[axis] !== currScrolls[axis];

    if (isChanged) this.prevScrolls[axis] = currScrolls;

    return isChanged;
  }

  isBoudingsChanged(axis) {
    const curroffsetSize = this.getoffsetSize(axis);
    const isChanged = this.prevBoundings[axis] !== curroffsetSize[axis];

    if (isChanged) this.prevBoundings[axis] = curroffsetSize[axis];

    return isChanged;
  }

  getoffsetSize = axis => this.innerElem[BY_AXIS[axis].offsetSize];
  getInnerSize = axis => this.innerElem[BY_AXIS[axis].innerSize];
  getScrollSize = axis => this.innerElem[BY_AXIS[axis].scrollSize];
  getScrollPos = axis => this.innerElem[BY_AXIS[axis].scrollPos];
  getThumbSize = axis => this.thumbELem[axis].current[BY_AXIS[axis].offsetSize];

  getOffset(axis) {
    const offset = this.props.offset?.[axis];

    const isVertical = axis === 'y';
    const before = isVertical ? 'top' : 'left';
    const after = isVertical ? 'bottom' : 'right';

    return {
      [before]: offset?.before || 0,
      [after]: offset?.after || 0,
    };
  }

  getCoeffStyle = axis => `${this.store.coeff[axis] * 100}%`;
  getPosStyle = axis => `${this.pos[axis]}px`;

  updateAll = () => {
    this.eachAxis(this.update);
    this.updateHasOffsets();
  };

  update = axis => {
    this.updateCoeff(axis);
    this.updatePos(axis);
  };

  updateCoeff(axis) {
    const thumb = this.thumbELem[axis].current;

    if (!this.innerElem) return;

    const sizeField = BY_AXIS[axis].size;

    this.store.coeff[axis] = this.getInnerSize(axis) / this.getScrollSize(axis);
    if (thumb) thumb.style[sizeField] = this.getCoeffStyle(axis);
  }

  updatePos(axis) {
    const thumb = this.thumbELem[axis].current;

    if (!this.innerElem || !thumb) return;

    const { offset } = this.props;
    const offsetBefore = offset?.[axis]?.before || 0;
    const offsetAfter = offset?.[axis]?.after || 0;
    const innerSize = this.getInnerSize(axis);
    const thumbSize = this.getThumbSize(axis);
    const scrollSize = this.getScrollSize(axis);
    const scrollPos = this.getScrollPos(axis);
    const posField = BY_AXIS[axis].posField;
    // const AXIS = axis.toUpperCase();
    const pos = thumbSize
      ? (innerSize - thumbSize - offsetBefore - offsetAfter) *
        (scrollPos / (scrollSize - innerSize))
      : 0;

    this.pos[axis] = pos;
    // thumb.style.transform = `translate${AXIS}(${pos}px)`;
    thumb.style[posField] = this.getPosStyle(axis);
  }

  updateScroll(axis, e) {
    const coords = getEventCoords(e);
    const scrollPos = BY_AXIS[axis].scrollPos;
    const pos = coords[axis] - this.prevCoords[axis];

    this.prevCoords = coords;
    this.innerElem[scrollPos] += pos / this.store.coeff[axis];
  }

  updateHasOffsets() {
    const { x, y } = this.props;
    const { hasOffset } = this.store;
    const {
      scrollTop,
      scrollLeft,
      scrollHeight,
      scrollWidth,
      offsetHeight,
      offsetWidth,
    } = this.innerElem;

    if (y) {
      hasOffset.top = scrollTop > 0;
      hasOffset.bottom =
        scrollHeight - (scrollTop + offsetHeight) > OFFSET_THRESHOL;
    }

    if (x && !(hasOffset.top || hasOffset.bottom)) {
      hasOffset.left = scrollLeft > 0;
      hasOffset.right =
        scrollWidth - (scrollLeft + offsetWidth) > OFFSET_THRESHOL;
    }
  }

  dropScrollingState = debounce(() => (this.store.isScrolling = false), 2000);

  subscribePointerMoveUp = () => {
    document.addEventListener('pointermove', this.onPointerMove, {
      passive: false, // do not generate passive event warning
    });
    document.addEventListener('pointerup', this.onPointerUp);
  };

  unsubscribePointerMoveUp = () => {
    document.removeEventListener('pointermove', this.onPointerMove);
    document.removeEventListener('pointerup', this.onPointerUp);
  };

  onDocScroll = e => {
    const { activeAxis } = this.store;

    // if dragging thumb - prevent any other scrolls
    if (activeAxis && this.innerElem !== e.target) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  onInnerScroll = e => {
    if (this.innerElem !== e.target) return;

    const { onScroll } = this.props;
    const { activeAxis, isScrolling } = this.store;

    this.updateHasOffsets();

    onScroll?.(e);

    if (!activeAxis) {
      this.eachAxis(axis => {
        if (this.isScrollSizeChanged(axis)) this.update(axis);
      });
    }

    if (!isScrolling) this.store.isScrolling = true;

    this.dropScrollingState();
  };

  onPointerDown = (axis, e) => {
    e.preventDefault();
    e.stopPropagation();

    // TOOD: if target is bar(not thumb) - move thumb to target coords

    this.prevCoords = getEventCoords(e);
    this.store.activeAxis = axis;

    this.subscribePointerMoveUp();
  };

  onPointerMove = e => {
    const { activeAxis } = this.store;

    if (!activeAxis) return;

    e.preventDefault();
    e.stopPropagation();

    this.updateScroll(activeAxis, e);
    this.updatePos(activeAxis);
  };

  onPointerUp = e => {
    e.stopPropagation();

    this.store.activeAxis = null;

    this.dropScrollingState();
    this.unsubscribePointerMoveUp();
  };

  renderBar = axis => {
    const { thumbClassName } = this.props;
    const { activeAxis, coeff } = this.store;

    if (coeff[axis] === 1) return null;

    const sizeField = BY_AXIS[axis].size;
    const posField = BY_AXIS[axis].posField;
    const thumbStyle = {
      [sizeField]: this.getCoeffStyle(axis),
      [posField]: this.getPosStyle(axis),
    };

    const className = cn(
      S.bar,
      S[axis],
      activeAxis === axis && S.isActive,
      this.props[`${axis}ScrollbarClassName`]
    );
    const barProps = {
      className,
      style: this.getOffset(axis),
      onPointerDown: this.onPointerDown.bind(this, axis),
    };

    return (
      <div {...barProps} key={`bar-${axis}`}>
        <div
          className={cn(S.thumb, thumbClassName)}
          style={thumbStyle}
          ref={this.thumbELem[axis]}
        />
      </div>
    );
  };

  renderInner() {
    const { innerClassName, innerProps, children, smooth } = this.props;
    const { activeAxis, hasOffset } = this.store;

    const innerClasses = cn(
      S.inner,
      innerProps?.className,
      innerClassName,
      !activeAxis && smooth && S.smooth,
      hasOffset.top && S.hasOffsetTop,
      hasOffset.bottom && S.hasOffsetBottom,
      hasOffset.right && S.hasOffsetRight,
      hasOffset.left && S.hasOffsetLeft
    );
    const props = { ...innerProps };

    props.onScrollCapture = this.onInnerScroll;

    return (
      <div
        {...props}
        className={innerClasses}
        ref={this.onInnerRef}
        key="inner"
      >
        {children}
      </div>
    );
  }

  render() {
    const { y, x, size, fadeSize, autoHide, className } = this.props;
    const { isScrolling, activeAxis } = this.store;

    const classes = cn(
      S.root,
      y && S.y,
      x && S.x,
      S[`size-${size}`],
      fadeSize && S[`fadeSize-${fadeSize}`],
      autoHide && S.autoHide,
      (isScrolling || activeAxis) && S.isScrolling,
      this.isTouch ? S.isTouch : S.isDesktop,
      className
    );
    const props = omit(this.props, [
      'x',
      'y',
      'offset',
      'size',
      'fadeSize',
      'smooth',
      'className',
      'innerClassName',
      'xScrollbarClassName',
      'yScrollbarClassName',
      'innerProps',
      'onInnerRef',
      'thumbClassName',
      'autoHide',
      'children',
    ]);

    return (
      <div className={classes} {...props}>
        {this.renderInner()}
        {this.eachAxis(this.renderBar)}
      </div>
    );
  }
}
