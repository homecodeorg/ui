import { Component, createRef } from 'react';
import { createPortal } from 'react-dom';
import cn from 'classnames';
import { createStore } from 'justorm/react';
import Time from 'timen';

import { debounce, dom, scroll, resizeObserver, array } from 'uilib/tools';

import S from './Popup.styl';
import * as T from './Popup.types';

export const ANIMATION_DURATION = 100;

const popupsOverContent = {}; // [popupId]: [popupId, popupId, ...]
const setPopupOverContent = (parentId, id) => {
  if (!popupsOverContent[parentId]) popupsOverContent[parentId] = [];
  popupsOverContent[parentId].push(id);
};
const unsetPopupOverContent = (parentId, id) => {
  array.spliceWhere(popupsOverContent[parentId], id);
  if (!popupsOverContent[parentId].length) delete popupsOverContent[parentId];
  console.log(popupsOverContent);
};
let popupIds = -1;

export class Popup extends Component<T.Props> {
  rootElem = createRef<HTMLDivElement>();
  triggerElem = createRef<HTMLDivElement>();
  containerElem = createRef<HTMLDivElement>();

  _resizeObserver;
  _focused = false;
  _mousePressed = false;
  _pointerMoveSubscribed = false;

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

    this.id = ++popupIds;
    this.store = createStore(this, {
      isOpen,
      isContentVisible: isOpen,
      direction: props.direction,
    } as T.State);

    this.afterClose = this.afterClose.bind(this);
    this.onPointerMove = debounce(this.onPointerMove, 100);
  }

  componentDidMount() {
    const { controllable, hoverControl, inline } = this.props;

    if (this.rootElem && !inline) {
      this.scrollParent = scroll.getScrollParent(this.rootElem.current);
      this.scrollParent.addEventListener('scroll', this.close);
    }

    if (!controllable) {
      this.subscribeDoc();
      document.addEventListener('keyup', this.onDocKeyUp, true);
    }

    if (hoverControl) this.subscribePointerMove();

    this.subscribeSizeChange();
  }

  componentDidUpdate(prevProps: T.Props) {
    const { isOpen, disabled } = this.props;

    if (disabled) {
      this.store.isOpen = false; // close when receive disabled=true
      return;
    }

    if (!prevProps.isOpen && isOpen) this.subscribePointerMove();
    if (prevProps.isOpen && !isOpen) this.unsubscribePointerMove();

    if (typeof isOpen === 'boolean' && isOpen !== prevProps.isOpen) {
      isOpen ? this.open() : this.close();
    }
  }

  componentWillUnmount() {
    this.timers.clear();
    this.unsubscribeDoc();
    document.removeEventListener('keyup', this.onDocKeyUp, true);

    if (this.scrollParent) {
      this.scrollParent.removeEventListener('scroll', this.close);
    }

    this.unsubscribePointerMove();
    this.unsubscribeSizeChange();
  }

  subscribeSizeChange() {
    resizeObserver.observe(
      this.containerElem.current,
      this.checkvisiblePosition
    );
  }

  unsubscribeSizeChange() {
    resizeObserver.unobserve(this.containerElem.current);
  }

  subscribeDoc = () => {
    document.addEventListener('mousedown', this.onMouseDown);
    document.addEventListener('mouseup', this.onMouseUp, true);
  };

  unsubscribeDoc = () => {
    document.removeEventListener('mousedown', this.onMouseDown);
    document.removeEventListener('mouseup', this.onMouseUp, true);
  };

  subscribePointerMove() {
    this._pointerMoveSubscribed = true;
    document.addEventListener('pointermove', this.onPointerMove);
  }

  unsubscribePointerMove() {
    if (!this._pointerMoveSubscribed) return;
    this._pointerMoveSubscribed = false;
    document.removeEventListener('pointermove', this.onPointerMove);
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

  onMouseDown = () => {
    this.timers.clear(this.dropMousePressed);
    this._mousePressed = true;
  };

  onMouseUp = e => {
    const { autoClose } = this.props;
    const { isOpen } = this.store;

    this.timers.after(100, this.dropMousePressed);

    if (this.isPointerOver(e.target, S.trigger)) {
      this.toggle();
      return;
    }

    if (isOpen && (!this.isPointerOver(e.target, S.content) || autoClose))
      this.close();
  };

  dropMousePressed = () => {
    this._mousePressed = false;
  };

  onPointerMove = e => {
    const { isOpen } = this.store;
    const overContent = e.target.closest(`.${S.content}`);

    if (isOpen) {
      if (!this.isPointerOver(e.target, S.trigger)) {
        if (!this.isPointerOver(e.target, S.content)) {
          if (overContent) {
            const overContentPopupId =
              overContent.getAttribute('data-popup-id');
            const ids = popupsOverContent[overContentPopupId];

            if (ids && ids.slice(-1) !== this.id) {
              this.close();
              unsetPopupOverContent(overContentPopupId, this.id);
            }
          } else this.close();
        }
      }
    } else if (this.isPointerOver(e.target, S.trigger)) {
      this.open();
      if (overContent) {
        setPopupOverContent(overContent.getAttribute('data-popup-id'), this.id);
      }
    }
  };

  onFocus = () => {
    const { controllable, onFocus } = this.props;

    this._focused = true;
    if (!controllable && !this._mousePressed) this.open();
    if (onFocus) onFocus();
  };

  onBlur = () => {
    const { controllable, onBlur } = this.props;

    this._focused = false;

    if (onBlur) onBlur();
    if (!controllable && !this._mousePressed) {
      // give time to fire clicks inside popup
      this.timers.after(80, this.close);
    }
  };

  checkvisiblePosition = () => {
    if (!this.props.direction.match(/^(top|bottom)/)) return;

    const { direction } = this.store;
    const isBottom = direction.match(/^bottom/);
    // TODO: support horizontal axis
    const { top, bottom } =
      this.containerElem.current?.getBoundingClientRect() || {};

    if (typeof top !== 'number') return;

    if (isBottom) {
      if (window.innerHeight < bottom)
        this.store.direction = direction.replace('bottom', 'top');
    } else {
      if (top < 0) this.store.direction = direction.replace('top', 'bottom');
    }
  };

  open = () => {
    const { onOpen } = this.props;

    if (this.store.isOpen) return;

    this.timers.clear(this.afterClose);

    Object.assign(this.store, { isOpen: true, isContentVisible: true });

    if (onOpen) Time.nextTick(onOpen);

    this.timers.after(100, this.checkvisiblePosition);
  };

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

  toggle = () => {
    this.store.isOpen ? this.close() : this.open();
  };

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
        onFocusCapture: this.onFocus,
        onBlurCapture: this.onBlur,
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
      clearTargetMargin,
    } = this.props;
    const { isOpen, isContentVisible, direction } = this.store;

    const trigger = this.triggerElem.current;
    const target = document.getElementById('app-modal');

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
      !clearTargetMargin && S.hasMargin,
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
          ref={this.containerElem}
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
    const classes = cn(S.root, className);

    return (
      <div className={classes} ref={this.rootElem}>
        {this.renderTrigger()}
        {this.renderContent()}
      </div>
    );
  }
}
