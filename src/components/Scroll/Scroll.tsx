import { Component, createRef, HTMLAttributes, HTMLProps } from 'react';
import cn from 'classnames';
import { createStore } from 'justorm/react';
import omit from 'lodash.omit';
import Time from 'timen';

import { capitalize } from '../../tools/string';
import { isTouch } from '../../tools/dom';
import debounce from '../../tools/debounce';
import * as resizeObserver from '../../tools/resizeObserver';

import S from './Scroll.styl';

type OffsetAxis = { before?: number; after?: number };
type Props = HTMLProps<HTMLDivElement> & {
  className?: string;
  innerClassName?: string;
  thumbClassName?: string;
  innerProps?: HTMLAttributes<HTMLDivElement>;
  x?: boolean;
  y?: boolean;
  autoHide?: boolean;
  offset?: { x?: OffsetAxis; y?: OffsetAxis };
};

export class Scroll extends Component<Props> {
  innerElem = createRef<HTMLDivElement>();
  thumbELem = {
    x: createRef<HTMLDivElement>(),
    y: createRef<HTMLDivElement>(),
  };

  store;
  isTouch;
  events;
  timers = Time.create();

  prevCoords = { x: 0, y: 0 };
  prevScrolls = { x: 0, y: 0 };
  prevBoundings = { x: 0, y: 0 };

  unsubscribeScrollHeightObserver;

  constructor(props) {
    super(props);
    this.isTouch = isTouch();
    this.store = createStore(this, {
      coeff: { x: 0, y: 0 },
      pos: { x: 0, y: 0 },
      isScrolling: false,
      activeAxis: null,
    });
    this.events = this.isTouch
      ? { start: 'onTouchStart', move: 'touchmove', end: 'touchend' }
      : { start: 'onMouseDown', move: 'mousemove', end: 'mouseup' };

    this.updatePos = debounce(this.updatePos, 50);
  }

  componentDidMount() {
    this.updateCoeff();

    this.unsubscribeScrollHeightObserver = Time.every(
      100,
      this.observeScrollHeight
    );
    resizeObserver.observe(this.innerElem.current, this.update);

    document.addEventListener(this.events.move, this.onPointerMove, {
      passive: false,
    });
    document.addEventListener(this.events.end, this.onPointerEnd);
    document.addEventListener('scroll', this.onScroll);
  }

  componentWillUnmount() {
    this.unsubscribeScrollHeightObserver?.();
    document.removeEventListener(this.events.move, this.onPointerMove);
    document.removeEventListener(this.events.end, this.onPointerEnd);
    document.removeEventListener('scroll', this.onScroll);
  }

  observeScrollHeight = () => {
    if (this.isScrollChanged() || this.isBoudingsChanged()) {
      this.update();
    }
  };

  isScrollChanged() {
    const { x, y } = this.props;
    const currScrolls = this.getScrollSizes();
    let isChanged = false;

    if (x && this.prevScrolls.x !== currScrolls.x) isChanged = true;
    if (y && this.prevScrolls.y !== currScrolls.y) isChanged = true;
    if (isChanged) this.prevScrolls = currScrolls;

    return isChanged;
  }

  isBoudingsChanged() {
    const { x, y } = this.props;
    const { offsetWidth, offsetHeight } = this.innerElem.current;
    const boundings = { x: offsetWidth, y: offsetHeight };
    let isChanged = false;

    if (y && offsetHeight !== this.prevBoundings.y) isChanged = true;
    if (x && offsetWidth !== this.prevBoundings.x) isChanged = true;
    if (isChanged) this.prevBoundings = boundings;

    return isChanged;
  }

  update = () => {
    this.updateCoeff();
    this.updatePos();
  };

  // TODO: call on resize
  updateCoeff() {
    const { clientHeight, clientWidth, scrollHeight, scrollWidth } =
      this.innerElem.current;

    this.store.coeff = {
      x: clientWidth / scrollWidth,
      y: clientHeight / scrollHeight,
    };

    // console.log('updateCoeff', this.store.coeff.originalObject);
  }

  updatePos = () => {
    const { offset } = this.props;
    const xOffsetBefore = offset?.x?.before || 0;
    const xOffsetAfter = offset?.x?.after || 0;
    const yOffsetBefore = offset?.y?.before || 0;
    const yOffsetAfter = offset?.y?.after || 0;

    const {
      clientHeight,
      clientWidth,
      scrollHeight,
      scrollWidth,
      scrollTop,
      scrollLeft,
    } = this.innerElem.current;
    const xThumbSize = this.thumbELem.x.current?.offsetWidth;
    const yThumbSize = this.thumbELem.y.current?.offsetHeight;

    const x = xThumbSize
      ? (clientWidth - xThumbSize - xOffsetBefore - xOffsetAfter) *
        (scrollLeft / (scrollWidth - clientWidth))
      : 0;
    const y = yThumbSize
      ? (clientHeight - yThumbSize - yOffsetBefore - yOffsetAfter) *
        (scrollTop / (scrollHeight - clientHeight))
      : 0;

    this.store.pos = { x, y };

    // console.log('updatePos', x, y);
  };

  dropScrollingState = () => (this.store.isScrolling = false);

  onScroll = e => {
    const { activeAxis } = this.store;

    if (activeAxis && this.innerElem.current !== e.target) {
      // console.log('scroll prevented', e.target);
      e.preventDefault();
      e.stopPropagation();
    }
  };

  onInnerScroll = e => {
    const { activeAxis, isScrolling } = this.store;

    if (!activeAxis) this.updatePos();

    if (!isScrolling) this.store.isScrolling = true;
    this.timers.clear(this.dropScrollingState);
    this.timers.after(500, this.dropScrollingState);
  };

  onPointerStart = (axis, e) => {
    e.preventDefault();
    e.stopPropagation();

    // TOOD: if target is bar(not thumb) - move thumb to target coords

    this.prevCoords = this.getEventCoords(e);
    this.store.activeAxis = axis;
  };

  onPointerMove = e => {
    const { activeAxis: axis, coeff } = this.store;

    if (!axis) return;

    e.preventDefault();
    e.stopPropagation();

    const coords = this.getEventCoords(e);
    const scrollDir = axis === 'y' ? 'scrollTop' : 'scrollLeft';
    const pos = coords[axis] - this.prevCoords[axis];

    this.prevCoords = coords;
    this.innerElem.current[scrollDir] += pos / coeff[axis];
    this.updatePos();
  };

  onPointerEnd = e => {
    e.stopPropagation();
    this.store.activeAxis = null;
  };

  getScrollSizes() {
    const { scrollHeight: y, scrollWidth: x } = this.innerElem.current;
    return { x, y };
  }

  getEventCoords(e) {
    const target = this.isTouch ? e.targetTouches[0] : e;
    return {
      x: target.clientX,
      y: target.clientY,
    };
  }

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

  renderBar(axis, sizeField, posField) {
    const { thumbClassName } = this.props;
    const { coeff, pos, activeAxis } = this.store;

    if (coeff[axis] === 1) return null;

    const offsetSizeField = `offset${capitalize(sizeField)}`;
    const thumbSize = this.thumbELem[axis].current?.[offsetSizeField] || 0;
    const thumbStyle = {
      [sizeField]: `${coeff[axis] * 100}%`,
      [posField]: `${pos[axis]}px`,
    };

    const barProps = {
      className: cn(S.bar, S[axis], activeAxis && S.isActive),
      style: this.getOffset(axis),
      [this.events.start]: this.onPointerStart.bind(this, axis),
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
  }

  renderInner() {
    const { innerClassName, innerProps, children } = this.props;

    const innerClasses = cn(S.inner, innerProps?.className, innerClassName);
    const props = { ...innerProps, onScroll: this.onInnerScroll };

    return (
      <div {...props} className={innerClasses} ref={this.innerElem}>
        {children}
      </div>
    );
  }

  render() {
    const { y, x, autoHide, className } = this.props;
    const { coeff, isScrolling, activeAxis } = this.store;

    const classes = cn(
      S.root,
      y && S.y,
      x && S.x,
      autoHide && S.autoHide,
      (isScrolling || activeAxis) && S.isScrolling,
      this.isTouch && S.isTouch,
      className
    );
    const props = omit(this.props, [
      'x',
      'y',
      'className',
      'innerClassName',
      'innerProps',
      'thumbClassName',
      'autoHide',
      'children',
    ]);

    return (
      <div className={classes} {...props}>
        {this.renderInner()}
        {x && this.renderBar('x', 'width', 'left')}
        {y && this.renderBar('y', 'height', 'top')}
      </div>
    );
  }
}
