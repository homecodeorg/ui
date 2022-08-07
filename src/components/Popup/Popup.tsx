import { Component, createRef } from 'react';
import { createPortal } from 'react-dom';
import cn from 'classnames';
import { createStore } from 'justorm/react';
import Time from 'timen';

import {
  debounce,
  dom,
  scroll,
  resizeObserver,
  isBrowser,
  throttle,
} from 'uilib/tools';

import S from './Popup.styl';
import * as H from './Popup.helpers';
import * as T from './Popup.types';

export const ANIMATION_DURATION = 100;

export class Popup extends Component<T.Props> {
  rootElem = createRef<HTMLDivElement>();
  triggerElem = createRef<HTMLDivElement>();
  containerElem: HTMLDivElement = null;
  onContainerElemRef = elem => {
    this.containerElem = elem;
    this.subscribeSizeChange();
  };

  _focused = false;
  _pointerPressed = false;
  _subscribedHoverControl = false;
  _subscribedSizeChange = false;

  id;
  store;
  timers = Time.create();
  scrollParent;

  static defaultProps = {
    size: 'm',
  };

  constructor(props) {
    super(props);

    const isOpen = Boolean(props.isOpen);

    this.id = H.getId();
    this.store = createStore(this, {
      isMounted: false,
      isOpen,
      isContentVisible: isOpen,
      position: { top: 0, left: 0 },
      direction: props.direction,
    } as T.State);

    this.afterClose = this.afterClose.bind(this);
    this.checkHover = debounce(this.checkHover, 100);
  }

  componentDidMount() {
    const { controllable, hoverControl, inline } = this.props;

    this.store.isMounted = true;

    if (this.rootElem && !inline) {
      this.scrollParent = scroll.getScrollParent(this.rootElem.current);
      this.scrollParent.addEventListener('scroll', this.close);
    }

    if (!controllable) {
      document.addEventListener('keyup', this.onDocKeyUp, true);
    }

    if (hoverControl) this.subscribeHoverControl();
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
  }

  subscribeSizeChange() {
    if (this._subscribedSizeChange) return;
    this._subscribedSizeChange = true;

    resizeObserver.observe(this.containerElem, this.checkvisiblePosition);
  }

  unsubscribeSizeChange() {
    resizeObserver.unobserve(this.containerElem);
  }

  subscribeHoverControl() {
    if (this._subscribedHoverControl) return;
    this._subscribedHoverControl = true;

    document.addEventListener('pointermove', this.checkHover);
  }

  unsubscribeHoverControl() {
    if (!this._subscribedHoverControl) return;
    this._subscribedHoverControl = false;

    document.removeEventListener('pointermove', this.checkHover);
  }

  isPointerOver(target, elem) {
    return target.closest(`.${elem}[data-popup-id="${this.id}"]`);
  }

  onDocKeyUp = e => {
    if (this.store.isOpen && e.key === 'Escape') {
      e.stopPropagation();
      this.close();
      return;
    }

    if (!this._focused) return;
    if (/Enter| /.test(e.key)) {
      e.stopPropagation();
      this.toggle();
    }
  };

  checkHover = e => {
    const { isOpen } = this.store;
    const overContent = e.target.closest(`.${S.content}`);

    if (isOpen) {
      if (!this.isPointerOver(e.target, S.trigger)) {
        if (!this.isPointerOver(e.target, S.content)) {
          if (overContent) {
            const parentPopupId = H.getPopupId(overContent);

            if (!H.isLastOverContent(parentPopupId, this.id)) {
              this.close();
              H.unsetOverContent(parentPopupId, this.id);
            }
          } else this.close();
        }
      }
    } else if (this.isPointerOver(e.target, S.trigger)) {
      this.open();
      if (overContent) {
        H.setOverContent(H.getPopupId(overContent), this.id);
      }
    }
  };

  onTriggerPointerDown = () => {
    this._pointerPressed = true;
  };

  onTriggerPointerUp = () => {
    this._pointerPressed = false;
    this.toggle();
  };

  onFocus = (e: FocusEvent) => {
    const { controllable, onTriggerFocus } = this.props;

    this._focused = true;
    if (!controllable && !this._pointerPressed) this.open();
    onTriggerFocus?.(e);
  };

  onBlur = (e: FocusEvent) => {
    const { controllable, onTriggerBlur } = this.props;

    this._focused = false;

    onTriggerBlur?.(e);
    if (!controllable && !this._pointerPressed) {
      // give time to fire clicks inside popup
      this.timers.after(80, this.close);
    }
  };

  checkvisiblePosition = () => {
    if (!this.props.direction.match(/^(top|bottom)/)) return;

    const { direction } = this.store;
    const isBottom = direction.match(/^bottom/);
    // TODO: support horizontal axis
    const { top, bottom } = this.containerElem?.getBoundingClientRect() || {};

    if (typeof top !== 'number') return;

    if (isBottom) {
      if (window.innerHeight < bottom)
        this.store.direction = direction.replace('bottom', 'top');
    } else {
      if (top < 0) this.store.direction = direction.replace('top', 'bottom');
    }
  };

  open = throttle(() => {
    const { onOpen } = this.props;

    if (this.store.isOpen) return;

    this.timers.clear(this.afterClose);

    Object.assign(this.store, { isOpen: true, isContentVisible: true });

    if (onOpen) Time.nextTick(onOpen);

    this.timers.after(100, this.checkvisiblePosition);
  }, 100);

  close = () => {
    if (!this.store.isOpen) return;

    this.store.isOpen = false;
    this.timers.after(ANIMATION_DURATION, this.afterClose);
  };

  afterClose() {
    const { onClose } = this.props;

    this.store.isContentVisible = false;
    if (onClose) Time.nextTick(onClose);
  }

  toggle = throttle(() => {
    this.store.isOpen ? this.close() : this.open();
  }, 100);

  renderTrigger() {
    const { trigger, content, disabled, triggerProps = {} } = this.props;
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
      Object.assign(triggerProps, {
        role: 'button',
        onFocus: this.onFocus,
        onBlur: this.onBlur,
        onPointerDown: this.onTriggerPointerDown,
        onPointerUp: this.onTriggerPointerUp,
      });
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
      paranja,
      elevation,
    } = this.props;
    const { isOpen, isContentVisible, direction } = this.store;

    const trigger = this.triggerElem.current;
    const target = isBrowser && document.getElementById('app-modal');

    if (!target) return null;

    const wrapperClasses = cn(
      S.contentWrapper,
      inline && S.inline,
      isOpen && S.isOpen,
      wrapperProps.className
    );

    const [axis, float] = direction.split('-');
    const classes = cn(
      S.content,
      !disabled && isOpen && S.isOpen,
      outlined && S.outlined,
      elevation && S[`elevation-${elevation}`],
      S[`size-${size}`],
      S[`axis-${axis}`],
      S[`float-${float || 'middle'}`],
      contentProps.className
    );

    if (trigger && !inline) {
      const { offsetHeight, offsetWidth } = trigger;

      wrapperProps.style = {
        minHeight: offsetHeight,
        minWidth: offsetWidth,
        ...dom.getCoords(trigger),
      } as any;
    }

    const contentNode = (
      <div {...wrapperProps} className={wrapperClasses}>
        {paranja &&
          createPortal(
            <div className={cn(S.paranja, isOpen && S.isOpen)} />,
            target
          )}
        <div
          {...contentProps}
          ref={this.onContainerElemRef}
          className={classes}
          data-popup-id={this.id}
        >
          {isContentVisible && content}
        </div>
      </div>
    );

    if (inline) return contentNode;
    return createPortal(contentNode, target);
  }

  render() {
    const { className } = this.props;
    const { isMounted } = this.store;
    const classes = cn(S.root, className);

    return (
      <div className={classes} ref={this.rootElem}>
        {this.renderTrigger()}
        {isMounted && this.renderContent()}
      </div>
    );
  }
}
