import * as H from './Popup.helpers';
import * as T from './Popup.types';
import * as resizeObserver from 'uilib/tools/resizeObserver';

import { Component, createRef } from 'react';

import { Paranja } from 'uilib/components/Paranja/Paranja';
import { Portal } from 'uilib/components/Portal/Portal';
import { config } from 'uilib/tools/config';
import S from './Popup.styl';
import Time from 'timen';
import cn from 'classnames';
import { getCoords } from 'uilib/tools/dom';
import { isBrowser } from 'uilib/tools/env';
import throttle from 'uilib/tools/throttle';

export const ANIMATION_DURATION = 100;
const OFFSET_GAP = 10;
const BOUNDARY_FIT_EPSILON = 1;
const HOVER_CLOSE_DELAY = 160;

export type PopupProps = T.Props;

export class Popup extends Component<T.Props, T.State> {
  rootElem = createRef<HTMLDivElement>();
  triggerElem = createRef<HTMLDivElement>();
  containerElem: HTMLDivElement = null;

  onContainerElemRef = elem => {
    this.containerElem = elem;

    // TODO: useElemResize(elem, callback)
    if (elem) {
      this.unsubscribeSizeChange();
      this.subscribeSizeChange();

      if (this.state.isOpen) {
        this.updateBounds();
      }
    }
  };

  focused = false;
  isOpening = false;
  openedByHover = false;
  pointerPressed = false;
  subscribedSizeChange = false;
  pointerDownTarget = null;
  isPointerPressedInside = false;
  hoverCloseUnsub: (() => void) | null = null;
  id;
  parentPopupContent;

  timers = Time.create();
  scrollParent;
  shiftOuterRafId = 0;
  shiftInnerRafId = 0;

  static defaultProps = {
    size: 'm',
    direction: '',
    animated: true,
  };

  state: T.State = {
    rootPopupId: null,
    isOpen: Boolean(this.props.isOpen),
    isContentVisible: Boolean(this.props.isOpen),
    animating: false,
    direction: this.props.direction,
    triggerBounds: null,
    boundaryFit: H.ZERO_BOUNDARY_FIT,
  };

  constructor(props) {
    super(props);
    this.id = H.getId();
  }

  componentDidMount() {
    const { focusControl } = this.props;

    const vv = isBrowser ? window.visualViewport : null;

    if (vv) {
      vv.addEventListener('resize', this.onBoundaryGeometryChange);
      vv.addEventListener('scroll', this.onBoundaryGeometryChange);
    }
    const parentPopupContent = this.triggerElem.current.closest(
      `.${S.content}`
    );

    document.addEventListener('pointerdown', this.onDocPointerDown, true);
    document.addEventListener('pointerup', this.onDocPointerUp, true);

    if (parentPopupContent) {
      const rootPopupId =
        H.getPopupId(parentPopupContent, 'data-root-popup-id') ||
        H.getPopupId(parentPopupContent, 'data-popup-id');

      this.setState({ rootPopupId });
    }

    if (focusControl) {
      document.addEventListener('keydown', this.onDocKeyDown, true);
      document.addEventListener('keyup', this.onDocKeyUp);
    }

    this.subscribeScroll();

    if (
      this.state.isOpen &&
      this.state.isContentVisible &&
      this.containerElem
    ) {
      this.scheduleComputeShift();
    }
  }

  onBoundaryGeometryChange = throttle(() => {
    if (this.state.isOpen) this.scheduleComputeShift();
  }, 100);

  componentDidUpdate(prevProps: T.Props, prevState: T.State) {
    const { isOpen, disabled } = this.props;

    if (disabled !== prevProps.disabled) {
      this.setState({ isOpen: false }); // close when receive disabled=true
      return;
    }

    if (typeof isOpen === 'boolean' && isOpen !== prevProps.isOpen) {
      isOpen ? this.open() : this.close();
    }

    const justOpened =
      !prevState.isOpen &&
      this.state.isOpen &&
      this.state.isContentVisible &&
      Boolean(this.containerElem);

    const triggerBoundsCommitted =
      this.state.isOpen &&
      this.state.isContentVisible &&
      Boolean(this.containerElem) &&
      prevState.triggerBounds === null &&
      this.state.triggerBounds !== null;

    if (justOpened || triggerBoundsCommitted) {
      this.scheduleComputeShift();
    }
  }

  componentWillUnmount() {
    this.timers.clear();
    cancelAnimationFrame(this.shiftOuterRafId);
    cancelAnimationFrame(this.shiftInnerRafId);

    const vv = isBrowser ? window.visualViewport : null;

    if (vv) {
      vv.removeEventListener('resize', this.onBoundaryGeometryChange);
      vv.removeEventListener('scroll', this.onBoundaryGeometryChange);
    }

    // These are registered in componentDidMount; omitting removal left orphaned
    // capture listeners that kept calling close/onClose after portal remounts.
    document.removeEventListener('pointerdown', this.onDocPointerDown, true);
    document.removeEventListener('pointerup', this.onDocPointerUp, true);
    document.removeEventListener('keydown', this.onDocKeyDown, true);
    document.removeEventListener('keyup', this.onDocKeyUp);

    if (this.scrollParent) {
      this.scrollParent.removeEventListener('scroll', this.close);
    }

    this.cancelHoverClose();
    this.unsubscribeSizeChange();
    this.unsubscribeScroll();
  }

  subscribeSizeChange() {
    if (this.subscribedSizeChange) return;
    this.subscribedSizeChange = true;

    resizeObserver.observe(this.triggerElem.current, this.onTriggerResize);
    resizeObserver.observe(this.containerElem, this.onContainerResize);
  }

  subscribeScroll() {
    if (isBrowser && !this.props.inline) {
      document.addEventListener('scroll', this.onScroll, true);
    }
  }

  unsubscribeScroll() {
    document.removeEventListener('scroll', this.onScroll, true);
  }

  unsubscribeSizeChange() {
    this.subscribedSizeChange = false;
    resizeObserver.unobserve(this.triggerElem.current);
    resizeObserver.unobserve(this.containerElem);
  }

  updateBounds() {
    if (!this.containerElem) return;

    if (!this.triggerElem.current) return;

    this.updateBoundsThrottled();
  }

  updateBoundsThrottled = throttle(
    () => {
      const trigger = this.triggerElem.current;
      const offset = this.props.offset || {};
      const n = (num: number) => num || 0;
      const bounds = {
        minHeight: trigger.offsetHeight - n(offset.top) - n(offset.bottom),
        minWidth: trigger.offsetWidth - n(offset.left) - n(offset.right),
        ...getCoords(trigger, this.props.direction, this.props.offset),
      };

      Object.entries(bounds).forEach(([key, value]) => {
        this.triggerElem.current.style[key] = value;
      });

      this.setState({ triggerBounds: bounds });
      this.scheduleComputeShift();
    },
    200,
    { trailing: true }
  );

  scheduleComputeShift() {
    if (!isBrowser) return;

    cancelAnimationFrame(this.shiftOuterRafId);
    cancelAnimationFrame(this.shiftInnerRafId);

    this.shiftOuterRafId = window.requestAnimationFrame(() => {
      this.shiftOuterRafId = 0;
      this.shiftInnerRafId = window.requestAnimationFrame(() => {
        this.shiftInnerRafId = 0;
        this.computeBoundaryShift();
      });
    });
  }

  computeBoundaryShift = () => {
    if (
      !this.containerElem ||
      !this.state.isOpen ||
      !this.state.isContentVisible
    ) {
      return;
    }

    const el = this.containerElem;
    const wrapper = el.parentElement;

    if (!(wrapper instanceof HTMLElement)) {
      return;
    }

    const { boundary, boundaryMountSelector, inline, shiftPadding, offset } =
      this.props;
    const bounds = H.popupBoundaryEdges({
      boundary,
      boundaryMountSelector: boundaryMountSelector ?? `#${config.appOverlayId}`,
      inline,
      padding: H.popupBoundaryPadding(OFFSET_GAP + (shiftPadding ?? 0), offset),
    });
    const availWidth = H.edgesWidth(bounds);
    const fitWidth =
      availWidth >= BOUNDARY_FIT_EPSILON ? Math.floor(availWidth) : null;
    const measured = this.measureBoundaryRect(el, wrapper, fitWidth, bounds);

    this.setBoundaryFit(
      H.fitRectToBoundary(measured.rect, bounds, measured.maxWidth)
    );
  };

  measureBoundaryRect(
    el: HTMLDivElement,
    wrapper: HTMLElement,
    fitWidth: number | null,
    bounds: H.ClientRectEdges
  ): { rect: DOMRect; maxWidth: number | null } {
    const transform = wrapper.style.transform;
    const maxWidth = el.style.maxWidth;
    const overflowX = el.style.overflowX;
    const overflowY = el.style.overflowY;

    wrapper.style.transform = '';
    el.style.maxWidth = '';
    el.style.overflowX = '';
    el.style.overflowY = '';
    void wrapper.offsetHeight;

    let rect = el.getBoundingClientRect();

    const shouldClamp =
      fitWidth !== null &&
      rect.width > H.edgesWidth(bounds) + BOUNDARY_FIT_EPSILON;

    if (shouldClamp) {
      el.style.maxWidth = `${fitWidth}px`;
      el.style.overflowX = 'auto';
      el.style.overflowY = 'hidden';
      void el.offsetHeight;
      rect = el.getBoundingClientRect();
    }

    wrapper.style.transform = transform;
    el.style.maxWidth = maxWidth;
    el.style.overflowX = overflowX;
    el.style.overflowY = overflowY;

    return { rect, maxWidth: shouldClamp ? fitWidth : null };
  }

  setBoundaryFit(boundaryFit: H.BoundaryFit) {
    const prev = this.state.boundaryFit;

    if (
      prev.left !== boundaryFit.left ||
      prev.top !== boundaryFit.top ||
      prev.maxWidth !== boundaryFit.maxWidth
    ) {
      this.setState({ boundaryFit });
    }
  }

  isControllable = () => typeof this.props.isOpen === 'boolean';

  isLastClickInside = () =>
    this.pointerDownTarget &&
    (this.pointerDownTarget.closest(`.${S.trigger}`) ||
      this.pointerDownTarget.closest(`.${S.content}`));

  onDocPointerDown = (e: PointerEvent) => {
    this.pointerDownTarget = e.target;
    this.isPointerPressedInside = this.isLastClickInside();
    this.timers.after(100, () => (this.pointerDownTarget = null));
  };

  onDocPointerUp = (e: PointerEvent) => {
    const pressedInside = this.isPointerPressedInside;
    this.isPointerPressedInside = false;
    if (!this.state.isOpen || pressedInside) return;
    if (this.isHoverInside(e.target)) return;
    this.close();
  };

  isPointerOver(target, elem) {
    return (
      target instanceof Element &&
      target.closest(`.${elem}[data-popup-id="${this.id}"]`)
    );
  }

  isHoverInside(target) {
    return (
      this.isPointerOver(target, S.trigger) ||
      this.isPointerOver(target, S.content)
    );
  }

  isRelatedHover(target) {
    if (!(target instanceof Element)) return false;
    if (this.isHoverInside(target)) return true;

    const popupEl = target.closest('[data-popup-id]');
    if (!popupEl) return false;

    const id = H.getPopupId(popupEl);
    if (id == null || id === this.id) return false;
    if (H.childs[this.id]?.includes(id)) return true;

    const { rootPopupId } = this.state;
    return rootPopupId != null && H.childs[rootPopupId]?.includes(id);
  }

  cancelHoverClose() {
    this.hoverCloseUnsub?.();
    this.hoverCloseUnsub = null;
  }

  scheduleHoverClose() {
    this.cancelHoverClose();
    this.hoverCloseUnsub = Time.after(HOVER_CLOSE_DELAY, () => {
      this.hoverCloseUnsub = null;
      this.close();
    });
  }

  onHoverEnter = () => {
    if (!this.props.hoverControl) return;
    this.cancelHoverClose();
    if (!this.state.isOpen) {
      this.openedByHover = true;
      this.open();
    }
  };

  onHoverLeave = (e: PointerEvent) => {
    if (!this.props.hoverControl) return;
    if (this.isRelatedHover(e.relatedTarget)) {
      this.cancelHoverClose();
      return;
    }
    this.scheduleHoverClose();
  };

  bindHoverHandlers(props: Record<string, unknown> = {}) {
    const enter = props.onPointerEnter as
      ((e: PointerEvent) => void) | undefined;
    const leave = props.onPointerLeave as
      ((e: PointerEvent) => void) | undefined;
    return {
      ...props,
      onPointerEnter: (e: PointerEvent) => {
        this.onHoverEnter();
        enter?.(e);
      },
      onPointerLeave: (e: PointerEvent) => {
        this.onHoverLeave(e);
        leave?.(e);
      },
    };
  }

  onScroll = throttle(e => {
    if (!this.state.isOpen) {
      const { top, left, maxWidth } = this.state.boundaryFit;

      if (left || top || maxWidth !== null) {
        this.setState({ boundaryFit: H.ZERO_BOUNDARY_FIT });
      }

      return;
    }

    // if scrolling outside this popup - close it
    if (
      !this.isPointerOver(e.target, S.content) &&
      !H.childs[this.id]?.length
    ) {
      this.close();
    }
  }, 200);

  onDocKeyDown = (e: KeyboardEvent) => {
    this.pointerDownTarget = null;
  };

  onDocKeyUp = (e: KeyboardEvent) => {
    if (this.state.isOpen && e.key === 'Escape') {
      e.stopPropagation();
      this.close();
      return;
    }

    // Enter/Space belong to the trigger itself when it is a text field.
    if (this.focused && /Enter| /.test(e.key) && !H.isEditable(e.target)) {
      e.stopPropagation();
      this.toggle();
    }
  };

  onTriggerPointerDown = e => {
    this.pointerDownTarget = e.target;
    this.pointerPressed = true;
  };

  onTriggerPointerUp = e => {
    this.pointerPressed = false;
    if (e.target !== this.pointerDownTarget) return;
    // Hover already opened — don't toggle shut on the same pointer.
    if (this.state.isOpen && this.openedByHover) return;
    this.toggle();
  };

  onFocus = e => {
    this.focused = true;
    this.props.triggerProps?.onFocus?.(e);

    if (!this.pointerPressed && !this.state.isOpen) this.open();
  };

  onBlur = e => {
    this.focused = false;
    this.props.triggerProps?.onBlur?.(e);

    if (this.isControllable() && this.props.isOpen) return;

    // give time to fire clicks inside popup
    this.timers.after(60, () => {
      if (!this.isLastClickInside()) this.close();
    });
  };

  onTriggerResize = () => {
    this.updateBounds();
  };

  onContainerResize = () => {
    this.updateBounds();
  };

  open = () => {
    const { rootPopupId } = this.state;

    // `isOpening` covers the gap until the state commits — throttling here used
    // to swallow a re-open that came right after a close.
    if (this.state.isOpen || this.isOpening) return;
    this.isOpening = true;

    this.updateBounds();
    this.subscribeSizeChange();
    this.subscribeScroll();
    this.setState({
      isContentVisible: true,
      boundaryFit: H.ZERO_BOUNDARY_FIT,
    });
    this.changeState(true, this.afterOpen);

    if (rootPopupId) H.setChild(rootPopupId, this.id);
  };

  close = () => {
    this.isOpening = false;
    this.openedByHover = false;
    this.cancelHoverClose();

    if (!this.state.isOpen) return;

    const { rootPopupId } = this.state;
    if (rootPopupId) H.unsetChild(rootPopupId, this.id);

    this.unsubscribeSizeChange();
    this.changeState(false, this.afterClose);
  };

  changeState(isOpen: boolean, callback) {
    const { animated, onOpen, onClose } = this.props;

    this.timers.clear();
    this.setState({ isOpen }, () => (this.isOpening = false));

    isOpen ? onOpen?.() : onClose?.();

    if (animated) {
      this.setState({ animating: true });
      this.timers.after(ANIMATION_DURATION + 500, () => {
        this.setState({ animating: false });
        callback();
      });
    } else {
      callback();
    }
  }

  afterOpen = () => {
    this.props.onAfterOpen?.();
  };

  afterClose = () => {
    this.setState({
      isContentVisible: false,
      boundaryFit: H.ZERO_BOUNDARY_FIT,
    });
    this.props.onAfterClose?.();
  };

  toggle = throttle(() => {
    this.state.isOpen ? this.close() : this.open();
  }, 100);

  renderTrigger() {
    const { trigger, content, disabled, focusControl, hoverControl, ...rest } =
      this.props;
    const triggerProps = { ...rest.triggerProps };
    const { isOpen } = this.state;

    if (!trigger) return null;

    const disableTrigger = disabled || !trigger;
    const classesTrigger = cn(
      S.trigger,
      isOpen && S.isOpen,
      disableTrigger && S.disabled,
      triggerProps.className
    );

    if (!disableTrigger) {
      triggerProps.role = 'button';

      if (hoverControl) {
        const userDown = triggerProps.onPointerDown;
        const userUp = triggerProps.onPointerUp;
        Object.assign(triggerProps, this.bindHoverHandlers(triggerProps), {
          onPointerDown: e => {
            this.onTriggerPointerDown(e);
            userDown?.(e);
          },
          onPointerUp: e => {
            this.onTriggerPointerUp(e);
            userUp?.(e);
          },
        });
      }

      if (focusControl) {
        Object.assign(triggerProps, {
          onFocus: this.onFocus,
          onBlur: this.onBlur,
        });
      }
    }

    return (
      <div
        className={classesTrigger}
        {...triggerProps}
        suppressHydrationWarning
        data-popup-id={this.id}
        ref={this.triggerElem}
      >
        {trigger}
      </div>
    );
  }

  renderContent() {
    const {
      content,
      wrapperProps = {},
      size,
      disabled,
      inline,
      outlined,
      animated,
      paranja,
      blur,
      round,
      elevation,
      hoverControl,
    } = this.props;
    const contentProps = hoverControl
      ? this.bindHoverHandlers(this.props.contentProps ?? {})
      : (this.props.contentProps ?? {});
    const {
      isOpen,
      isContentVisible,
      animating,
      direction,
      triggerBounds,
      rootPopupId,
      boundaryFit,
    } = this.state;

    if (disabled) return null;

    const wrapperClasses = cn(
      S.contentWrapper,
      inline && S.inline,
      isOpen && S.isOpen,
      animating && S.animating,
      wrapperProps.className
    );

    const trigger = this.triggerElem.current;
    const [axis, float] = direction.split('-');
    const classes = cn(
      S.content,
      outlined && S.outlined,
      animated && animating && S.animating,
      elevation && S[`elevation-${elevation}`],
      S[`size-${size}`],
      S[`axis-${axis}`],
      S[`float-${float || 'middle'}`],
      blur && S.blur,
      round && S.round,
      contentProps.className
    );

    if (trigger && !inline && triggerBounds) {
      const shiftTf =
        boundaryFit.left !== 0 || boundaryFit.top !== 0
          ? `translate3d(${boundaryFit.left}px, ${boundaryFit.top}px, 0)`
          : undefined;
      wrapperProps.style = {
        ...triggerBounds,
        ...wrapperProps.style,
        ...(shiftTf ? { transform: shiftTf } : {}),
      };
    }

    // Nested popups portal as siblings of the parent wrapper. A transform on
    // the parent creates a stacking context, so the child needs a higher
    // z-index or it paints under the parent (looks like it never opened).
    if (rootPopupId) {
      wrapperProps.style = {
        ...wrapperProps.style,
        zIndex: 12,
      };
    }

    const contentNode = (
      <div {...wrapperProps} className={wrapperClasses}>
        <div
          {...contentProps}
          ref={this.onContainerElemRef}
          className={classes}
          suppressHydrationWarning
          data-popup-id={this.id}
          data-root-popup-id={rootPopupId}
          style={{
            ...(contentProps.style ?? {}),
            ...(boundaryFit.maxWidth !== null && boundaryFit.maxWidth > 0
              ? {
                  maxWidth: boundaryFit.maxWidth,
                  overflowX: 'auto',
                  overflowY: 'hidden',
                }
              : {}),
          }}
        >
          {paranja && !rootPopupId && (
            <Paranja visible={isContentVisible} blur={blur} />
          )}
          {isContentVisible && <>{content}</>}
        </div>
      </div>
    );

    if (inline) return contentNode;
    return <Portal>{contentNode}</Portal>;
  }

  render() {
    const { className } = this.props;
    const classes = cn(S.root, className);

    return (
      <div className={classes} ref={this.rootElem}>
        {this.renderTrigger()}
        {this.renderContent()}
      </div>
    );
  }
}
