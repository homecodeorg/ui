import React, { useState, useRef, useEffect, useCallback } from 'react';
import cn from 'classnames';
import Time from 'timen';

import { Paranja } from 'uilib/components/Paranja/Paranja';
import { Portal } from 'uilib/components/Portal/Portal';
import { getCoords } from 'uilib/tools/dom';
import * as resizeObserver from 'uilib/tools/resizeObserver';
import { isBrowser } from 'uilib/tools/env';
import debounce from 'uilib/tools/debounce';
import throttle from 'uilib/tools/throttle';

import S from './Popup.styl';
import * as H from './Popup.helpers';
import * as T from './Popup.types';

export const ANIMATION_DURATION = 100;
const OFFSET_GAP = 10;
const INITIAL_OFFSET = { top: 0, left: 0 };

export type PopupProps = T.Props;

export const Popup: React.FC<PopupProps> = (props) => {
  const {
    isOpen: initialIsOpen = false,
    size = 'm',
    direction: initialDirection = '',
    animated = true,
    hoverControl,
    focusControl,
    disabled,
    inline,
    paranja,
    blur,
    elevation,
    outlined,
    content,
    trigger,
    triggerProps = {},
    wrapperProps = {},
    contentProps = {},
    onOpen,
    onClose,
  } = props;

  const [state, setState] = useState<T.State>({
    rootPopupId: null,
    isOpen: initialIsOpen,
    isContentVisible: initialIsOpen,
    animating: false,
    direction: initialDirection,
    triggerBounds: null,
  });

  const rootElem = useRef<HTMLDivElement>(null);
  const triggerElem = useRef<HTMLDivElement>(null);
  const containerElem = useRef<HTMLDivElement>(null);

  const id = useRef(H.getId());
  const timers = useRef(Time.create());
  const offset = useRef({ ...INITIAL_OFFSET });

  const [focused, setFocused] = useState(false);
  const [pointerPressed, setPointerPressed] = useState(false);
  const [subscribedHoverControl, setSubscribedHoverControl] = useState(false);
  const [subscribedSizeChange, setSubscribedSizeChange] = useState(false);
  const [pointerDownTarget, setPointerDownTarget] = useState<EventTarget | null>(null);
  const [isPointerPressedInside, setIsPointerPressedInside] = useState(false);
  const [needDropOffset, setNeedDropOffset] = useState(false);

  const updateBounds = useCallback(() => {
    if (state.animating || !containerElem.current) return;
    if (!triggerElem.current) return;

    const trigger = triggerElem.current;
    const bounds = {
      minHeight: trigger.offsetHeight,
      minWidth: trigger.offsetWidth,
      ...getCoords(trigger),
    };

    Object.entries(bounds).forEach(([key, value]) => {
      triggerElem.current!.style[key as any] = value as any;
    });

    updateOffset();

    setState(prev => ({ ...prev, triggerBounds: bounds }));
  }, [state.animating]);

  const updateOffset = useCallback(() => {
    if (!containerElem.current) return;

    const content = containerElem.current.getBoundingClientRect();
    const { innerHeight, innerWidth } = window;
    const bottom = content.top + content.height + OFFSET_GAP - offset.current.top;
    const right = content.left + content.width + OFFSET_GAP - offset.current.left;

    if (content.top < 0) {
      offset.current.top = -content.top + OFFSET_GAP;
    } else if (bottom > innerHeight) {
      offset.current.top = innerHeight - bottom;
    }

    if (content.left < 0) {
      offset.current.left = -content.left + OFFSET_GAP;
    } else if (right > innerWidth) {
      offset.current.left = innerWidth - right;
    }

    applyOffset();
  }, []);

  const applyOffset = useCallback(() => {
    if (!containerElem.current) return;
    const { left, top } = offset.current;
    containerElem.current.style.marginTop = `${top}px`;
    containerElem.current.style.marginLeft = `${left}px`;
  }, []);

  const subscribeHoverControl = useCallback(() => {
    if (subscribedHoverControl) return;
    setSubscribedHoverControl(true);
    document.addEventListener('pointermove', checkHover);
    document.addEventListener('pointerup', checkHover);
  }, [subscribedHoverControl]);

  const unsubscribeHoverControl = useCallback(() => {
    if (!subscribedHoverControl) return;
    setSubscribedHoverControl(false);
    document.removeEventListener('pointermove', checkHover);
    document.removeEventListener('pointerup', checkHover);
  }, [subscribedHoverControl]);

  const subscribeSizeChange = useCallback(() => {
    if (subscribedSizeChange) return;
    setSubscribedSizeChange(true);
    resizeObserver.observe(triggerElem.current!, updateBounds);
    resizeObserver.observe(containerElem.current!, updateBounds);
  }, [subscribedSizeChange, updateBounds]);

  const unsubscribeSizeChange = useCallback(() => {
    setSubscribedSizeChange(false);
    resizeObserver.unobserve(triggerElem.current!);
    resizeObserver.unobserve(containerElem.current!);
  }, []);

  const subscribeScroll = useCallback(() => {
    if (isBrowser && !inline) {
      document.addEventListener('scroll', onScroll, true);
    }
  }, [inline]);

  const unsubscribeScroll = useCallback(() => {
    document.removeEventListener('scroll', onScroll, true);
  }, []);

  const onScroll = useCallback(throttle((e: Event) => {
    if (!state.isOpen) {
      const { top, left } = offset.current;
      if (left || top) {
        offset.current = { ...INITIAL_OFFSET };
        applyOffset();
      }
      return;
    }

    if (
      !isPointerOver(e.target as HTMLElement, S.content) &&
      !H.childs[id.current]?.length
    ) {
      setNeedDropOffset(true);
      close();
    }
  }, 200), [state.isOpen, applyOffset, close]);

  const isPointerOver = useCallback((target: HTMLElement, elem: string) => {
    return target.closest(`.${elem}[data-popup-id="${id.current}"]`);
  }, []);

  const checkHover = useCallback(debounce((e: PointerEvent) => {
    if (isPointerPressedInside) return;

    const overTrigger = isPointerOver(e.target as HTMLElement, S.trigger);
    const overContent = isPointerOver(e.target as HTMLElement, S.content);

    if (!state.isOpen) {
      if (overTrigger) open();
      return;
    }

    if (overTrigger || overContent) return;

    if (typeof state.rootPopupId === 'number') {
      if (H.isLastChild(state.rootPopupId, id.current)) {
        close();
        H.unsetChild(state.rootPopupId, id.current);
      }
    } else {
      const isOverAnyPopupContent = (e.target as HTMLElement).closest(`.${S.content}`);

      if (!isOverAnyPopupContent || !H.childs[id.current]?.length) {
        close();
      }
    }
  }, 100), [state.isOpen, state.rootPopupId, isPointerPressedInside, open, close]);

  const onDocPointerDown = useCallback((e: PointerEvent) => {
    setPointerDownTarget(e.target);
    setIsPointerPressedInside(isLastClickInside());
    timers.current.after(100, () => setPointerDownTarget(null));
  }, []);

  const onDocPointerUp = useCallback((e: PointerEvent) => {
    if (!isPointerPressedInside) close();
    setIsPointerPressedInside(false);
  }, [isPointerPressedInside, close]);

  const onDocKeyDown = useCallback((e: KeyboardEvent) => {
    setPointerDownTarget(null);
  }, []);

  const onDocKeyUp = useCallback((e: KeyboardEvent) => {
    if (state.isOpen && e.key === 'Escape') {
      e.stopPropagation();
      close();
      return;
    }

    if (focused && /Enter| /.test(e.key)) {
      e.stopPropagation();
      toggle();
    }
  }, [state.isOpen, focused, close, toggle]);

  const onTriggerPointerDown = useCallback((e: React.PointerEvent) => {
    setPointerDownTarget(e.target);
    setPointerPressed(true);
  }, []);

  const onTriggerPointerUp = useCallback((e: React.PointerEvent) => {
    setPointerPressed(false);
    if (e.target === pointerDownTarget) toggle();
  }, [pointerDownTarget, toggle]);

  const onFocus = useCallback((e: React.FocusEvent) => {
    setFocused(true);
    triggerProps.onFocus?.(e);

    if (!pointerPressed) open();
  }, [pointerPressed, open]);

  const onBlur = useCallback((e: React.FocusEvent) => {
    setFocused(false);
    triggerProps.onBlur?.(e);

    timers.current.after(60, () => {
      if (!isLastClickInside()) close();
    });
  }, [close]);

  const isLastClickInside = useCallback(() => {
    return pointerDownTarget &&
      (pointerDownTarget as HTMLElement).closest(`.${S.trigger}`) ||
      (pointerDownTarget as HTMLElement).closest(`.${S.content}`);
  }, [pointerDownTarget]);

  const open = useCallback(throttle(() => {
    if (state.isOpen) return;

    updateBounds();
    subscribeSizeChange();
    subscribeScroll();
    setState(prev => ({ ...prev, isContentVisible: true }));
    changeState(true, afterOpen);

    if (state.rootPopupId) H.setChild(state.rootPopupId, id.current);
  }, 100), [state.isOpen, state.rootPopupId, updateBounds, subscribeSizeChange, subscribeScroll]);

  const close = useCallback(() => {
    if (!state.isOpen) return;

    unsubscribeSizeChange();
    changeState(false, afterClose);
  }, [state.isOpen, unsubscribeSizeChange]);

  const changeState = useCallback((isOpen: boolean, callback: () => void) => {
    timers.current.clear();
    setState(prev => ({ ...prev, isOpen }));

    if (animated) {
      setState(prev => ({ ...prev, animating: true }));
      timers.current.after(ANIMATION_DURATION + 500, () => {
        setState(prev => ({ ...prev, animating: false }));
        callback();
      });
    } else {
      callback();
    }
  }, [animated]);

  const afterOpen = useCallback(() => {
    onOpen?.();
  }, [onOpen]);

  const afterClose = useCallback(() => {
    setState(prev => ({ ...prev, isContentVisible: false }));
    dropOffset();
    onClose?.();
  }, [onClose]);

  const dropOffset = useCallback(() => {
    if (!needDropOffset) return;
    offset.current = { ...INITIAL_OFFSET };
    applyOffset();
  }, [needDropOffset, applyOffset]);

  const toggle = useCallback(throttle(() => {
    state.isOpen ? close() : open();
  }, 100), [state.isOpen, close, open]);

  useEffect(() => {
    const parentPopupContent = triggerElem.current?.closest(`.${S.content}`);

    if (parentPopupContent) {
      setState(prev => ({
        ...prev,
        rootPopupId: H.getPopupId(parentPopupContent, 'data-root-popup-id') ||
          H.getPopupId(parentPopupContent, 'data-popup-id')
      }));
    }

    document.addEventListener('pointerdown', onDocPointerDown, true);
    document.addEventListener('pointerup', onDocPointerUp, true);

    if (focusControl) {
      document.addEventListener('keydown', onDocKeyDown, true);
      document.addEventListener('keyup', onDocKeyUp);
    }

    if (hoverControl) subscribeHoverControl();
    subscribeScroll();

    updateBounds();
    subscribeSizeChange();

    return () => {
      timers.current.clear();
      document.removeEventListener('pointerdown', onDocPointerDown, true);
      document.removeEventListener('pointerup', onDocPointerUp, true);
      document.removeEventListener('keydown', onDocKeyDown, true);
      document.removeEventListener('keyup', onDocKeyUp, true);
      unsubscribeHoverControl();
      unsubscribeSizeChange();
      unsubscribeScroll();
    };
  }, [
    focusControl,
    hoverControl,
    subscribeHoverControl,
    subscribeScroll,
    unsubscribeHoverControl,
    unsubscribeSizeChange,
    unsubscribeScroll,
    onDocPointerDown,
    onDocPointerUp,
    onDocKeyDown,
    onDocKeyUp,
    updateBounds,
    subscribeSizeChange
  ]);

  const renderTrigger = () => {
    if (!trigger) return null;

    const disableTrigger = disabled || !content;
    const classesTrigger = cn(
      S.trigger,
      state.isOpen && S.isOpen,
      disableTrigger && S.disabled,
      triggerProps.className
    );

    const newTriggerProps = { ...triggerProps };

    if (!disableTrigger) {
      newTriggerProps.role = 'button';

      if (hoverControl) {
        Object.assign(newTriggerProps, {
          onPointerDown: onTriggerPointerDown,
          onPointerUp: onTriggerPointerUp,
        });
      }

      if (focusControl) {
        Object.assign(newTriggerProps, {
          onFocus,
          onBlur,
        });
      }
    }

    return (
      <div
        className={classesTrigger}
        {...newTriggerProps}
        suppressHydrationWarning
        data-popup-id={id.current}
        ref={triggerElem}
      >
        {trigger}
      </div>
    );
  };

  const renderContent = () => {
    if (disabled) return null;

    const wrapperClasses = cn(
      S.contentWrapper,
      blur && S.blur,
      inline && S.inline,
      state.isOpen && S.isOpen,
      wrapperProps.className
    );

    const [axis, float] = state.direction.split('-');
    const classes = cn(
      S.content,
      outlined && S.outlined,
      animated && state.animating && S.animating,
      elevation && S[`elevation-${elevation}`],
      S[`size-${size}`],
      S[`axis-${axis}`],
      S[`float-${float || 'middle'}`],
      contentProps.className
    );

    const newWrapperProps = { ...wrapperProps };
    if (triggerElem.current && !inline && state.triggerBounds) {
      newWrapperProps.style = { ...state.triggerBounds };
    }

    const contentNode = (
      <div {...newWrapperProps} className={wrapperClasses}>
        <div
          {...contentProps}
          ref={containerElem}
          className={classes}
          suppressHydrationWarning
          data-popup-id={id.current}
          data-root-popup-id={state.rootPopupId}
          style={{
            marginTop: offset.current.top,
            marginLeft: offset.current.left,
          }}
        >
          {paranja && !state.rootPopupId && (
            <Paranja visible={state.isContentVisible} blur={blur} />
          )}
          {state.isContentVisible && <>{content}</>}
        </div>
      </div>
    );

    return inline ? contentNode : <Portal>{contentNode}</Portal>;
  };

  return (
    <div className={cn(S.root, props.className)} ref={rootElem}>
      {renderTrigger()}
      {renderContent()}
    </div>
  );
};
