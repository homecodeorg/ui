import { Component, createRef } from 'react';
import { createPortal } from 'react-dom';
import cn from 'classnames';
import { createStore } from 'justorm/react';
import Time from 'timen';

import { Paranja } from 'uilib/components/Paranja/Paranja';
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

export type PopupProps = T.Props;

export class Popup extends Component<T.Props> {
  rootElem = createRef<HTMLDivElement>();
  triggerElem = createRef<HTMLDivElement>();
  containerElem: HTMLDivElement = null;

  onContainerElemRef = elem => {
    this.containerElem = elem;
  };

  _focused = false;
  _pointerPressed = false;
  _subscribedHoverControl = false;
  _subscribedSizeChange = false;
  _pointerDownTarget = null;
  _isPointerPressedInside = false;

  id;
  parentPopupContent;

  store;
  timers = Time.create();
  scrollParent;

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
      wrapperBounds: null,
      offset: { x: 0, y: 0 },
    } as T.State);
  }

  componentDidMount() {
    const { isOpen, hoverControl, focusControl } = this.props;
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

    if (isOpen) this.updateWrapperBounds();
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
    if (this._subscribedSizeChange) return;
    this._subscribedSizeChange = true;

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
    resizeObserver.unobserve(this.containerElem);
  }

  subscribeHoverControl() {
    if (this._subscribedHoverControl) return;
    this._subscribedHoverControl = true;

    document.addEventListener('pointermove', this.checkHover);
    document.addEventListener('pointerup', this.checkHover);
  }

  unsubscribeHoverControl() {
    if (!this._subscribedHoverControl) return;
    this._subscribedHoverControl = false;

    document.removeEventListener('pointermove', this.checkHover);
    document.removeEventListener('pointerup', this.checkHover);
  }

  updateWrapperBounds = () => {
    const trigger = this.triggerElem.current;

    if (!trigger) return;

    this.store.wrapperBounds = {
      minHeight: trigger.offsetHeight,
      minWidth: trigger.offsetWidth,
      ...getCoords(trigger),
    };
  };

  checkVisiblePosition = () => {
    if (this.store.animating) return;

    const content = this.containerElem.getBoundingClientRect();
    const { offset } = this.store;
    const { x, y } = offset;
    const bottom = content.bottom - y;
    const right = content.right - x;

    // TODO: time to time numbers a bit different
    // console.log('checkVisiblePosition', content.right);

    if (content.top < 0) {
      offset.y = -content.top;
    } else if (bottom > window.innerHeight) {
      offset.y = window.innerHeight - bottom - OFFSET_GAP;
    }

    if (content.left < 0) {
      offset.x = -content.left;
    } else if (right > window.innerWidth) {
      offset.x = window.innerWidth - right - OFFSET_GAP;
    }
  };

  checkHover = debounce(e => {
    if (this._isPointerPressedInside) return;

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
    this._pointerDownTarget &&
    (this._pointerDownTarget.closest(`.${S.trigger}`) ||
      this._pointerDownTarget.closest(`.${S.content}`));

  onDocPointerDown = (e: PointerEvent) => {
    this._pointerDownTarget = e.target;
    this._isPointerPressedInside = this.isLastClickInside();
    this.timers.after(100, () => (this._pointerDownTarget = null));
  };

  onDocPointerUp = (e: PointerEvent) => {
    if (!this._isPointerPressedInside) this.close();
    this._isPointerPressedInside = false;
  };

  isPointerOver(target, elem) {
    return target.closest(`.${elem}[data-popup-id="${this.id}"]`);
  }

  onScroll = e => {
    if (!e.target.closest(`.${S.content}`)) this.close();
  };

  onDocKeyDown = (e: KeyboardEvent) => {
    this._pointerDownTarget = null;
  };

  onDocKeyUp = (e: KeyboardEvent) => {
    if (this.store.isOpen && e.key === 'Escape') {
      e.stopPropagation();
      this.close();
      return;
    }

    if (this._focused && /Enter| /.test(e.key)) {
      e.stopPropagation();
      this.toggle();
    }
  };

  onTriggerPointerDown = e => {
    this._pointerDownTarget = e.target;
    this._pointerPressed = true;
  };

  onTriggerPointerUp = e => {
    this._pointerPressed = false;
    if (e.traget === this._pointerDownTarget) this.toggle();
  };

  onFocus = e => {
    this._focused = true;
    this.props.triggerProps?.onFocus?.(e);

    if (!this._pointerPressed) this.open();
  };

  onBlur = e => {
    this._focused = false;
    this.props.triggerProps?.onBlur?.(e);

    // give time to fire clicks inside popup
    this.timers.after(80, () => {
      if (!this.isLastClickInside()) this.close();
    });
  };

  onTriggerResize = debounce(() => {
    this.updateWrapperBounds();
  }, 200);

  onContainerResize = debounce(() => {
    this.checkVisiblePosition();
  }, 200);

  open = throttle(() => {
    const { rootPopupId } = this.store;

    if (this.store.isOpen) return;

    this.updateWrapperBounds();
    this.subscribeScroll();
    this.store.isContentVisible = true;
    this.changeState(true, this.afterOpen);

    if (rootPopupId) H.setChild(rootPopupId, this.id);
  }, 100);

  close = () => {
    if (!this.store.isOpen) return;

    this.unsubscribeSizeChange();
    this.unsubscribeScroll();
    this.changeState(false, this.afterClose);
  };

  changeState(isOpen: boolean, callback) {
    const { animated } = this.props;

    this.timers.clear();
    this.store.isOpen = isOpen;

    if (animated) {
      this.store.animating = true;
      this.timers.after(ANIMATION_DURATION, () => {
        this.store.animating = false;
        callback();
      });
    } else {
      callback();
    }
  }

  afterOpen = () => {
    this.checkVisiblePosition();
    this.subscribeSizeChange();
    this.props.onOpen?.();
  };

  afterClose = () => {
    this.store.isContentVisible = false;
    this.props.onClose?.();
  };

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
      wrapperBounds,
      offset,
      rootPopupId,
    } = this.store;

    const target = isBrowser && document.getElementById('app-modal');

    if (!target || disabled) return null;

    const wrapperClasses = cn(
      S.contentWrapper,
      blur && S.blur,
      inline && S.inline,
      isOpen && wrapperBounds && S.isOpen,
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

    if (trigger && !inline && wrapperBounds) {
      const { minHeight, minWidth, top, left } = wrapperBounds;

      wrapperProps.style = {
        minHeight,
        minWidth,
        top: top + offset.y,
        left: left + offset.x,
      };
    }

    const contentNode = (
      <div {...wrapperProps} className={wrapperClasses}>
        <div
          {...contentProps}
          ref={this.onContainerElemRef}
          className={classes}
          data-popup-id={this.id}
          data-root-popup-id={rootPopupId}
        >
          {paranja && !rootPopupId && (
            <Paranja visible={isContentVisible} blur={blur} />
          )}
          {isContentVisible && <>{content}</>}
        </div>
      </div>
    );

    if (inline) return contentNode;
    return createPortal(contentNode, target);
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
