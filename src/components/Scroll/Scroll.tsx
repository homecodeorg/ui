import { useRef, useState, useCallback, useMemo, useEffect } from 'react';
import cn from 'classnames';
import Time from 'timen';

import { isTouch } from 'uilib/tools/dom';
import * as resizeObserver from 'uilib/tools/resizeObserver';

import S from './Scroll.styl';
import * as T from './Scroll.types';
import useEvent from '../../hooks/useEvent';
import { useDebounce } from '../../hooks/useDebounce';

const getEventCoords = e => ({
  x: e.clientX,
  y: e.clientY,
});

const OFFSET_THRESHOLD = 5;
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

export type ScrollProps = T.Props;

export function Scroll(props: T.Props) {
  const {
    x,
    y,
    offset,
    size = 'm',
    fadeSize,
    smooth,
    className,
    innerClassName,
    xScrollbarClassName,
    yScrollbarClassName,
    innerProps,
    onInnerRef,
    thumbClassName,
    autoHide,
    children,
    onScroll,
    ...rest
  } = props;

  const innerElemRef = useRef<HTMLDivElement>(null);
  const thumbXRef = useRef<HTMLDivElement>(null);
  const thumbYRef = useRef<HTMLDivElement>(null);
  const thumbElemRef = {
    x: thumbXRef,
    y: thumbYRef,
  };

  const [isScrolling, setIsScrolling] = useState(false);
  const [activeAxis, setActiveAxis] = useState(null);
  const [coeff, setCoeff] = useState({ x: 0, y: 0 });
  const [hasOffset, setHasOffset] = useState({
    top: false,
    left: false,
    right: false,
    bottom: false,
  });

  const isTouchDevice = useMemo(() => isTouch(), []);

  const posRef = useRef({ x: 0, y: 0 });
  const prevCoordsRef = useRef({ x: 0, y: 0 });
  const prevScrollsRef = useRef({ x: 0, y: 0 });
  const prevBoundingsRef = useRef({ x: 0, y: 0 });

  const eachAxis = useCallback(
    fn => AXES.map(axis => props[axis] && fn(axis)),
    [x, y]
  );

  const getOffsetSize = axis => innerElemRef.current[BY_AXIS[axis].offsetSize];
  const getInnerSize = axis => innerElemRef.current[BY_AXIS[axis].innerSize];
  const getScrollSize = axis => innerElemRef.current[BY_AXIS[axis].scrollSize];
  const getScrollPos = axis => innerElemRef.current[BY_AXIS[axis].scrollPos];
  const getThumbSize = axis =>
    thumbElemRef[axis].current[BY_AXIS[axis].offsetSize];

  const getOffset = useCallback(
    axis => {
      const axisOffset = offset?.[axis];
      const isVertical = axis === 'y';
      const before = isVertical ? 'top' : 'left';
      const after = isVertical ? 'bottom' : 'right';

      return {
        [before]: axisOffset?.before || 0,
        [after]: axisOffset?.after || 0,
      };
    },
    [offset]
  );

  const getCoeffStyle = useCallback(axis => `${coeff[axis] * 100}%`, [coeff]);

  const getPosStyle = axis => `${posRef.current[axis]}px`;

  const isScrollSizeChanged = useCallback(
    axis => {
      const currScrolls = getScrollSize(axis);
      const isChanged = prevScrollsRef.current[axis] !== currScrolls;

      if (isChanged) prevScrollsRef.current[axis] = currScrolls;

      return isChanged;
    },
    [getScrollSize]
  );

  const isBoudingsChanged = useCallback(
    axis => {
      const curroffsetSize = getOffsetSize(axis);
      const isChanged = prevBoundingsRef.current[axis] !== curroffsetSize;

      if (isChanged) prevBoundingsRef.current[axis] = curroffsetSize;

      return isChanged;
    },
    [getOffsetSize]
  );

  // Update functions
  const updateCoeff = useCallback(
    axis => {
      const thumb = thumbElemRef[axis].current;
      if (!innerElemRef.current) return;

      const sizeField = BY_AXIS[axis].size;
      const newCoeff = getInnerSize(axis) / getScrollSize(axis);

      // Only update if the value has changed
      if (coeff[axis] !== newCoeff) {
        setCoeff(prev => ({
          ...prev,
          [axis]: newCoeff,
        }));
      }

      if (thumb) thumb.style[sizeField] = `${newCoeff * 100}%`;
    },
    [coeff, getInnerSize, getScrollSize, thumbElemRef]
  );

  const updatePos = useCallback(
    axis => {
      const thumb = thumbElemRef[axis].current;
      if (!innerElemRef.current || !thumb) return;

      const offsetBefore = offset?.[axis]?.before || 0;
      const offsetAfter = offset?.[axis]?.after || 0;
      const innerSize = getInnerSize(axis);
      const thumbSize = getThumbSize(axis);
      const scrollSize = getScrollSize(axis);
      const scrollPos = getScrollPos(axis);
      const posField = BY_AXIS[axis].posField;

      const pos = thumbSize
        ? (innerSize - thumbSize - offsetBefore - offsetAfter) *
          (scrollPos / (scrollSize - innerSize))
        : 0;

      posRef.current[axis] = pos;
      thumb.style[posField] = `${pos}px`;
    },
    [
      getInnerSize,
      getScrollPos,
      getScrollSize,
      getThumbSize,
      offset,
      thumbElemRef,
    ]
  );

  const update = useCallback(
    axis => {
      updateCoeff(axis);
      updatePos(axis);
    },
    [updateCoeff, updatePos]
  );

  const updateHasOffsets = useCallback(() => {
    if (!innerElemRef.current) return;

    const {
      scrollTop,
      scrollLeft,
      scrollHeight,
      scrollWidth,
      offsetHeight,
      offsetWidth,
    } = innerElemRef.current;

    setHasOffset(prev => {
      const newHasOffset = { ...prev };

      if (y) {
        newHasOffset.top = scrollTop > 0;
        newHasOffset.bottom =
          scrollHeight - (scrollTop + offsetHeight) > OFFSET_THRESHOLD;
      }

      if (x && !(newHasOffset.top || newHasOffset.bottom)) {
        newHasOffset.left = scrollLeft > 0;
        newHasOffset.right =
          scrollWidth - (scrollLeft + offsetWidth) > OFFSET_THRESHOLD;
      }

      return newHasOffset;
    });
  }, [x, y]);

  const updateAll = useCallback(() => {
    if (!innerElemRef.current) return;

    eachAxis(axis => update(axis));
    updateHasOffsets();
  }, [eachAxis, update, updateHasOffsets]);

  const updateScroll = useCallback(
    (axis, e) => {
      const coords = getEventCoords(e);
      const scrollPos = BY_AXIS[axis].scrollPos;
      const pos = coords[axis] - prevCoordsRef.current[axis];

      prevCoordsRef.current = coords;
      innerElemRef.current[scrollPos] += pos / coeff[axis];
    },
    [coeff]
  );

  // Event handlers
  const dropScrollingState = useDebounce(() => {
    setIsScrolling(false);
  }, 2000);

  const observeScrollHeight = useCallback(() => {
    eachAxis(axis => {
      const needUpdate =
        (props[axis] && isScrollSizeChanged(axis)) || isBoudingsChanged(axis);

      if (needUpdate) update(axis);
    });
  }, [props, isBoudingsChanged, isScrollSizeChanged, update]);

  const onDocScroll = useCallback(
    e => {
      // if dragging thumb - prevent any other scrolls
      if (activeAxis && innerElemRef.current !== e.target) {
        e.preventDefault();
        e.stopPropagation();
      }
    },
    [activeAxis]
  );

  const onInnerScroll = useCallback(
    e => {
      if (innerElemRef.current !== e.target) return;

      updateHasOffsets();
      onScroll?.(e);
      if (!activeAxis) eachAxis(updatePos);
      if (!isScrolling) setIsScrolling(true);
      dropScrollingState();
    },
    [
      activeAxis,
      dropScrollingState,
      eachAxis,
      isScrollSizeChanged,
      isScrolling,
      onScroll,
      update,
      updateHasOffsets,
    ]
  );

  const onPointerDown = useCallback((axis, e) => {
    e.preventDefault();
    e.stopPropagation();

    prevCoordsRef.current = getEventCoords(e);
    setActiveAxis(axis);
  }, []);

  const onPointerMove = useCallback(
    e => {
      if (!activeAxis) return;

      e.preventDefault();
      e.stopPropagation();

      updateScroll(activeAxis, e);
      updatePos(activeAxis);
    },
    [activeAxis, updatePos, updateScroll]
  );

  const onPointerUp = useCallback(
    e => {
      e.stopPropagation();
      setActiveAxis(null);
      dropScrollingState();
    },
    [dropScrollingState]
  );

  useEffect(() => {
    if (innerElemRef.current) {
      // Initial update
      updateAll();

      // Set up resize observer
      resizeObserver.observe(innerElemRef.current, updateAll);
      onInnerRef?.(innerElemRef.current);

      return () => {
        resizeObserver.unobserve(innerElemRef.current, updateAll);
      };
    }
  }, [onInnerRef]); // Remove updateAll from dependencies

  useEffect(() => {
    const unsubscribeScrollHeightObserver = Time.every(
      100,
      observeScrollHeight
    );

    return () => {
      unsubscribeScrollHeightObserver?.();
    };
  }, [observeScrollHeight]);

  useEvent({
    elem: document,
    event: 'scroll',
    callback: onDocScroll,
  });

  useEvent({
    elem: document,
    event: ['pointermove', 'pointerup'],
    callback: e => {
      if (e.type === 'pointermove') onPointerMove(e);
      else if (e.type === 'pointerup') onPointerUp(e);
    },
    isActive: !!activeAxis,
  });

  const renderBar = useCallback(
    axis => {
      if (!props[axis] || coeff[axis] === 1) return null;

      const sizeField = BY_AXIS[axis].size;
      const posField = BY_AXIS[axis].posField;
      const thumbStyle = {
        [sizeField]: getCoeffStyle(axis),
        [posField]: getPosStyle(axis),
      };

      const className = cn(
        S.bar,
        S[axis],
        activeAxis === axis && S.isActive,
        props[`${axis}ScrollbarClassName`]
      );

      const barProps = {
        className,
        style: getOffset(axis),
        onPointerDown: e => onPointerDown(axis, e),
      };

      return (
        <div {...barProps} key={`bar-${axis}`}>
          <div
            className={cn(S.thumb, thumbClassName)}
            style={thumbStyle}
            ref={thumbElemRef[axis]}
          />
        </div>
      );
    },
    [
      activeAxis,
      coeff,
      getCoeffStyle,
      getOffset,
      getPosStyle,
      onPointerDown,
      props,
      thumbClassName,
      thumbElemRef,
    ]
  );

  const renderInner = useCallback(() => {
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
    props.onScrollCapture = onInnerScroll;

    return (
      <div {...props} className={innerClasses} ref={innerElemRef} key="inner">
        {children}
      </div>
    );
  }, [
    activeAxis,
    children,
    hasOffset,
    innerClassName,
    innerProps,
    onInnerScroll,
    smooth,
  ]);

  const classes = cn(
    S.root,
    y && S.y,
    x && S.x,
    S[`size-${size}`],
    fadeSize && S[`fadeSize-${fadeSize}`],
    autoHide && S.autoHide,
    (isScrolling || activeAxis) && S.isScrolling,
    isTouchDevice ? S.isTouch : S.isDesktop,
    className
  );

  return (
    <div className={classes} {...rest}>
      {renderInner()}
      {AXES.map(renderBar)}
    </div>
  );
}
