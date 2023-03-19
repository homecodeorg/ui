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
  innerElem = HTMLDivElement;
  onInnerRef = elem => {
    this.innerElem = elem;
    this.props.onInnerRef?.(elem);
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
    });
  }

  componentDidMount() {
    this.eachAxis(this.update);

    this.unsubscribeScrollHeightObserver = Time.every(
      100,
      this.observeScrollHeight
    );
    resizeObserver.observe(this.innerElem, this.updateAll);

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
      if (
        (this.props[axis] && this.isScrollChanged(axis)) ||
        this.isBoudingsChanged(axis)
      ) {
        this.update(axis);
      }
    });
  };

  isScrollChanged(axis) {
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

  updatePos = axis => {
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
  };

  updateScroll = (axis, e) => {
    const coords = getEventCoords(e);
    const scrollPos = BY_AXIS[axis].scrollPos;
    const pos = coords[axis] - this.prevCoords[axis];

    this.prevCoords = coords;
    this.innerElem[scrollPos] += pos / this.store.coeff[axis];
  };

  dropScrollingState = debounce(() => (this.store.isScrolling = false), 500);

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
    const { onScroll } = this.props;
    const { activeAxis, isScrolling } = this.store;

    onScroll?.(e);

    if (!activeAxis) {
      this.eachAxis(axis => {
        if (this.isScrollChanged(axis)) this.update(axis);
      });
    }

    if (!isScrolling) this.store.isScrolling = true;
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
    const { activeAxis: axis } = this.store;

    if (!axis) return;

    e.preventDefault();
    e.stopPropagation();

    this.updateScroll(axis, e);
    this.updatePos(axis);
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

    const barProps = {
      className: cn(S.bar, S[axis], activeAxis === axis && S.isActive),
      style: this.getOffset(axis),
      onPointerDown: this.onPointerDown.bind(this, axis),
    };

    return (
      <div {...barProps}>
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
    const { activeAxis } = this.store;

    const innerClasses = cn(
      S.inner,
      innerProps?.className,
      innerClassName,
      smooth && S.smooth
    );
    const props = { ...innerProps };

    props.onScrollCapture = this.onInnerScroll;

    return (
      <div {...props} className={innerClasses} ref={this.onInnerRef}>
        {children}
      </div>
    );
  }

  render() {
    const { y, x, size, fadeSize, extraWide, autoHide, className } = this.props;
    const { isScrolling, activeAxis } = this.store;

    const classes = cn(
      S.root,
      y && S.y,
      x && S.x,
      S[`size-${size}`],
      fadeSize && S[`fadeSize-${fadeSize}`],
      autoHide && S.autoHide,
      extraWide && S.extraWide,
      (isScrolling || activeAxis) && S.isScrolling,
      this.isTouch && S.isTouch,
      className
    );
    const props = omit(this.props, [
      'x',
      'y',
      'offset',
      'size',
      'fadeSize',
      'className',
      'innerClassName',
      'innerProps',
      'thumbClassName',
      'autoHide',
      'children',
      'extraWide',
    ]);

    return (
      <div className={classes} {...props}>
        {this.renderInner()}
        {this.eachAxis(this.renderBar)}
      </div>
    );
  }
}
