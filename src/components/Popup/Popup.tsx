import { Component, createRef } from 'react';
import cn from 'classnames';
import { createStore } from 'justorm/react';
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

export class Popup extends Component<T.Props> {
  rootElem = createRef<HTMLDivElement>();
  triggerElem = createRef<HTMLDivElement>();
  containerElem: HTMLDivElement = null;

  onContainerElemRef = elem => {
    this.containerElem = elem;

    // TODO: useElemResize(elem, callback)
    if (elem) {
      this.unsubscribeSizeChange();
      this.subscribeSizeChange();
    }
  };

  focused = false;
  pointerPressed = false;
  subscribedHoverControl = false;
  subscribedSizeChange = false;
  pointerDownTarget = null;
  isPointerPressedInside = false;
  needDropOffset = false;

  id;
  parentPopupContent;

  store;
  timers = Time.create();
  scrollParent;
  offset = { ...INITIAL_OFFSET };

  static defaultProps = {
    size: 'm',
    direction: '',
    animated: true,
  };

  constructor(props) {
    super(props);

    const isOpen = Boolean(props.isOpen);

    this.id = H.getId();
    this.store = createStore(this, {
      rootPopupId: null,
      isOpen,
      isContentVisible: isOpen,
      direction: props.direction,
      triggerBounds: null,
    } as T.State);
  }

  componentDidMount() {
    const { hoverControl, focusControl } = this.props;
    const parentPopupContent = this.triggerElem.current.closest(
      `.${S.content}`
    );

    document.addEventListener('pointerdown', this.onDocPointerDown, true);
    document.addEventListener('pointerup', this.onDocPointerUp, true);

    if (parentPopupContent) {
      this.store.rootPopupId =
        H.getPopupId(parentPopupContent, 'data-root-popup-id') ||
        H.getPopupId(parentPopupContent, 'data-popup-id');
    }

    if (focusControl) {
      document.addEventListener('keydown', this.onDocKeyDown, true);
      document.addEventListener('keyup', this.onDocKeyUp);
    }

    if (hoverControl) this.subscribeHoverControl();
    this.subscribeScroll();
  }

  componentDidUpdate(prevProps: T.Props) {
    const { isOpen, disabled, hoverControl } = this.props;

    if (disabled) {
      this.store.isOpen = false; // close when receive disabled=true
      return;
    }

    if (!prevProps.hoverControl && hoverControl) this.subscribeHoverControl();
    if (prevProps.hoverControl && !hoverControl) this.unsubscribeHoverControl();

    if (typeof isOpen === 'boolean' && isOpen !== prevProps.isOpen) {
      isOpen ? this.open() : this.close();
    }
  }

  componentWillUnmount() {
    this.timers.clear();
    document.removeEventListener('keyup', this.onDocKeyUp, true);

    if (this.scrollParent) {
      this.scrollParent.removeEventListener('scroll', this.close);
    }

    this.unsubscribeHoverControl();
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

  subscribeHoverControl() {
    if (this.subscribedHoverControl) return;
    this.subscribedHoverControl = true;

    document.addEventListener('pointermove', this.checkHover);
    document.addEventListener('pointerup', this.checkHover);
  }

  unsubscribeHoverControl() {
    if (!this.subscribedHoverControl) return;
    this.subscribedHoverControl = false;

    document.removeEventListener('pointermove', this.checkHover);
    document.removeEventListener('pointerup', this.checkHover);
  }

  updateBounds() {
    if (this.store.animating || !this.containerElem) return;

    if (!this.triggerElem.current) return;

    this.updateBoundsThrottled();
  }

  updateBoundsThrottled = throttle(
    () => {
      const trigger = this.triggerElem.current;
      const bounds = {
        minHeight: trigger.offsetHeight,
        minWidth: trigger.offsetWidth,
        ...getCoords(trigger),
      };

      Object.entries(bounds).forEach(([key, value]) => {
        this.triggerElem.current.style[key] = value;
      });

      this.updateOffset();

      this.store.triggerBounds = bounds;
    },
    200,
    { trailing: true }
  );

  prevContentBounds = { width: 0, height: 0 };

  updateOffset = () => {
    const content = this.containerElem.getBoundingClientRect();

    if (
      !content.height ||
      !content.width ||
      this.prevContentBounds.width !== content.width ||
      this.prevContentBounds.height !== content.height
    ) {
      this.prevContentBounds = content;
      Time.after(100, this.updateOffset);

      return;
    }

    const { offset } = this;
    const { innerHeight, innerWidth } = window;
    const bottom = content.top + content.height + OFFSET_GAP - offset.top;
    const right = content.left + content.width + OFFSET_GAP - offset.left;

    if (content.top < 0) {
      offset.top = -content.top + OFFSET_GAP;
    } else if (bottom > innerHeight) {
      offset.top = innerHeight - bottom;
    }

    if (content.left < 0) {
      offset.left = -content.left + OFFSET_GAP;
    } else if (right > innerWidth) {
      offset.left = innerWidth - right;
    }

    this.applyOffset();
  };

  applyOffset() {
    const { left, top } = this.offset;

    this.containerElem.style.marginTop = `${top}px`;
    this.containerElem.style.marginLeft = `${left}px`;
  }

  checkHover = debounce(e => {
    if (this.isPointerPressedInside) return;

    const { isOpen, rootPopupId } = this.store;
    const overTrigger = this.isPointerOver(e.target, S.trigger);
    const overContent = this.isPointerOver(e.target, S.content);

    if (!isOpen) {
      if (overTrigger) this.open();
      return;
    }

    // isOpen
    if (overTrigger || overContent) return;

    if (typeof rootPopupId === 'number') {
      if (H.isLastChild(rootPopupId, this.id)) {
        this.close();
        H.unsetChild(rootPopupId, this.id);
      }
    } else {
      const isOverAnyPopupContent = e.target.closest(`.${S.content}`);

      if (!isOverAnyPopupContent || !H.childs[this.id]?.length) {
        this.close();
      }
    }
  }, 100);

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
    if (!this.isPointerPressedInside) this.close();
    this.isPointerPressedInside = false;
  };

  isPointerOver(target, elem) {
    return target.closest(`.${elem}[data-popup-id="${this.id}"]`);
  }

  onScroll = throttle(e => {
    if (!this.store.isOpen) {
      const { top, left } = this.offset;

      if (left || top) {
        this.offset = { ...INITIAL_OFFSET };
        this.applyOffset();
      }

      return;
    }

    // if scrolling outside this popup - close it
    if (!this.isPointerOver(e.target, S.content)) {
      this.needDropOffset = true;
      this.close();
    }
  }, 200);

  onDocKeyDown = (e: KeyboardEvent) => {
    this.pointerDownTarget = null;
  };

  onDocKeyUp = (e: KeyboardEvent) => {
    if (this.store.isOpen && e.key === 'Escape') {
      e.stopPropagation();
      this.close();
      return;
    }

    if (this.focused && /Enter| /.test(e.key)) {
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
    if (e.traget === this.pointerDownTarget) this.toggle();
  };

  onFocus = e => {
    this.focused = true;
    this.props.triggerProps?.onFocus?.(e);

    if (!this.pointerPressed) this.open();
  };

  onBlur = e => {
    this.focused = false;
    this.props.triggerProps?.onBlur?.(e);

    // give time to fire clicks inside popup
    this.timers.after(80, () => {
      if (!this.isLastClickInside()) this.close();
    });
  };

  onTriggerResize = () => {
    this.updateBounds();
  };

  onContainerResize = () => {
    this.updateBounds();
  };

  open = throttle(() => {
    const { rootPopupId } = this.store;

    if (this.store.isOpen) return;

    this.updateBounds();
    this.subscribeSizeChange();
    this.subscribeScroll();
    this.store.isContentVisible = true;
    this.changeState(true, this.afterOpen);

    if (rootPopupId) H.setChild(rootPopupId, this.id);
  }, 100);

  close = () => {
    if (!this.store.isOpen) return;

    this.unsubscribeSizeChange();
    this.changeState(false, this.afterClose);
  };

  changeState(isOpen: boolean, callback) {
    const { animated } = this.props;

    this.timers.clear();
    this.store.isOpen = isOpen;

    if (animated) {
      this.store.animating = true;
      this.timers.after(ANIMATION_DURATION + 500, () => {
        this.store.animating = false;
        callback();
      });
    } else {
      callback();
    }
  }

  afterOpen = () => {
    this.props.onOpen?.();
  };

  afterClose = () => {
    this.store.isContentVisible = false;
    this.dropOffset();
    this.props.onClose?.();
  };

  dropOffset() {
    if (!this.needDropOffset) return;

    this.offset = { ...INITIAL_OFFSET };
    this.applyOffset();
  }

  toggle = throttle(() => {
    this.store.isOpen ? this.close() : this.open();
  }, 100);

  renderTrigger() {
    const { trigger, content, disabled, focusControl, hoverControl, ...rest } =
      this.props;
    const triggerProps = { ...rest.triggerProps };
    const { isOpen } = this.store;

    if (!trigger) return null;

    const disableTrigger = disabled || !content;
    const classesTrigger = cn(
      S.trigger,
      isOpen && S.isOpen,
      disableTrigger && S.disabled,
      triggerProps.className
    );

    if (!disableTrigger) {
      triggerProps.role = 'button';

      if (hoverControl) {
        Object.assign(triggerProps, {
          onPointerDown: this.onTriggerPointerDown,
          onPointerUp: this.onTriggerPointerUp,
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
      contentProps = {},
      wrapperProps = {},
      size,
      disabled,
      inline,
      outlined,
      animated,
      paranja,
      blur,
      elevation,
    } = this.props;
    const {
      isOpen,
      isContentVisible,
      animating,
      direction,
      triggerBounds,
      rootPopupId,
      offset,
    } = this.store;

    if (disabled) return null;

    const wrapperClasses = cn(
      S.contentWrapper,
      blur && S.blur,
      inline && S.inline,
      isOpen && S.isOpen,
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
      contentProps.className
    );

    if (trigger && !inline && triggerBounds) {
      wrapperProps.style = { ...triggerBounds };
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
          style={{ ...offset }}
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
