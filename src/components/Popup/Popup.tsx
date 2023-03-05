import { Component, createRef } from 'react';
import { createPortal } from 'react-dom';
import cn from 'classnames';
import { createStore } from 'justorm/react';
import Time from 'timen';

import { Paranja } from 'uilib';
import { dom, resizeObserver, env, debounce, throttle } from 'uilib/tools';

import S from './Popup.styl';
import * as H from './Popup.helpers';
import * as T from './Popup.types';

export const ANIMATION_DURATION = 100;

export type PopupProps = T.Props;

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
  parentPopupContent;

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
      rootPopupId: null,
      isOpen,
      isContentVisible: isOpen,
      position: { top: 0, left: 0 },
      direction: props.direction,
    } as T.State);

    this.checkHover = debounce(this.checkHover, 100);
  }

  componentDidMount() {
    const { hoverControl, focusControl, inline } = this.props;
    const parentPopupContent = this.triggerElem.current.closest(
      `.${S.content}`
    );

    if (parentPopupContent) {
      this.store.rootPopupId =
        H.getPopupId(parentPopupContent, 'data-root-popup-id') ||
        H.getPopupId(parentPopupContent, 'data-popup-id');
    }

    if (env.isBrowser && !inline) {
      document.addEventListener('scroll', this.close);
    }

    if (focusControl) {
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
    document.addEventListener('pointerup', this.checkHover);
  }

  unsubscribeHoverControl() {
    if (!this._subscribedHoverControl) return;
    this._subscribedHoverControl = false;

    document.removeEventListener('pointermove', this.checkHover);
    document.removeEventListener('pointerup', this.checkHover);
  }

  checkvisiblePosition = () => {
    // const trigger = this.triggerElem.current.getBoundingClientRect();
    const content = this.containerElem.getBoundingClientRect();
    const newDir = [];

    if (content.top < 0) {
      // if (window.innerHeight - trigger.bottom > content.height) {
      newDir[0] = 'bottom';
      // } else {
      //   this.containerElem.style.top = '0px';
      // }
    } else if (content.bottom > window.innerHeight) {
      // if (trigger.top > content.height) {
      newDir[0] = 'top';
      // } else {
      //   this.containerElem.style.bottom = '0px';
      // }
    }

    if (content.left < 0) {
      // if (window.innerWidth - trigger.right > content.width) {
      newDir[1] = 'right';
      // } else {
      //   this.containerElem.style.left = '0px';
      // }
    } else if (content.right > window.innerWidth) {
      // if (trigger.left > content.width) {
      newDir[1] = 'left';
      // } else {
      //   this.containerElem.style.right = `-${
      //     window.innerWidth - trigger.right
      //   }px`;
      // }
    }

    if (newDir.length) {
      this.store.direction = newDir.join('-');
    }
  };

  checkHover = e => {
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
      if (H.isLastOverContent(rootPopupId, this.id)) {
        this.close();
        H.unsetOverContent(rootPopupId, this.id);
      }
    } else {
      const isOverAnyPopupContent = e.target.closest(`.${S.content}`);

      if (!isOverAnyPopupContent || !H.childs[this.id]?.length) {
        this.close();
      }
    }
  };

  isPointerOver(target, elem) {
    return target.closest(`.${elem}[data-popup-id="${this.id}"]`);
  }

  onDocKeyUp = (e: KeyboardEvent) => {
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

  onTriggerPointerDown = () => {
    this._pointerPressed = true;
  };

  onTriggerPointerUp = () => {
    this._pointerPressed = false;
    this.toggle();
  };

  onFocus = (e: FocusEvent) => {
    const { onTriggerFocus } = this.props;

    this._focused = true;
    if (!this._pointerPressed) this.open();
    onTriggerFocus?.(e);
  };

  onBlur = (e: FocusEvent) => {
    const { onTriggerBlur } = this.props;

    this._focused = false;

    onTriggerBlur?.(e);
    if (!this._pointerPressed) {
      // give time to fire clicks inside popup
      this.timers.after(80, this.close);
    }
  };

  open = throttle(() => {
    const { onOpen } = this.props;
    const { rootPopupId } = this.store;

    if (this.store.isOpen) return;

    this.timers.clear(this.afterClose);

    Object.assign(this.store, { isOpen: true, isContentVisible: true });

    if (rootPopupId) H.setOverContent(rootPopupId, this.id);
    if (onOpen) Time.nextTick(onOpen);

    this.timers.after(100, this.checkvisiblePosition);
  }, 100);

  close = () => {
    if (!this.store.isOpen) return;

    this.store.isOpen = false;
    this.timers.after(ANIMATION_DURATION, this.afterClose);
  };

  afterClose = () => {
    const { onClose } = this.props;

    this.store.isContentVisible = false;
    if (onClose) Time.nextTick(onClose);
  };

  toggle = throttle(() => {
    this.store.isOpen ? this.close() : this.open();
  }, 100);

  renderTrigger() {
    const {
      trigger,
      content,
      disabled,
      triggerProps = {},
      focusControl,
      hoverControl,
    } = this.props;
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
      paranja,
      elevation,
    } = this.props;
    const { isOpen, isContentVisible, direction, rootPopupId } = this.store;

    const trigger = this.triggerElem.current;
    const target = env.isBrowser && document.getElementById('app-modal');

    if (!target || disabled) return null;

    const wrapperClasses = cn(
      S.contentWrapper,
      inline && S.inline,
      isOpen && S.isOpen,
      wrapperProps.className
    );

    const [axis, float] = direction.split('-');
    const classes = cn(
      S.content,
      isOpen && S.isOpen,
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
        <div
          {...contentProps}
          ref={this.onContainerElemRef}
          className={classes}
          data-popup-id={this.id}
          data-root-popup-id={rootPopupId}
        >
          {paranja && !rootPopupId && <Paranja isVisible={isContentVisible} />}
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
