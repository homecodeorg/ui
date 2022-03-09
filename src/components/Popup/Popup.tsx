import { Component, createRef } from 'react';
import { createPortal } from 'react-dom';
import cn from 'classnames';
import Time from 'timen';
import { createStore } from 'justorm/react';

import throttle from '../../tools/throttle';
import { hasParent, getCoords } from '../../tools/dom';
import { getScrollParent } from '../../tools/scroll';

import S from './Popup.styl';
import * as T from './Popup.types';

export const ANIMATION_DURATION = 100;

function getIframeDoc() {
  return document.querySelector('iframe')?.contentDocument;
}

export class Popup extends Component<T.Props> {
  rootElem = createRef<HTMLDivElement>();

  triggerElem: HTMLDivElement;

  containerElem = createRef<HTMLDivElement>();

  scrollParent;

  _focused = false;
  _mousePressed = false;

  store;
  timers = Time.create();

  static defaultProps = {
    size: 'm',
  };

  constructor(props) {
    super(props);

    const isOpen = Boolean(props.isOpen);

    this.store = createStore(this, {
      isOpen,
      isContentVisible: isOpen,
      position: { top: 0, left: 0 },
    } as T.State);

    this.afterClose = this.afterClose.bind(this);
  }

  componentDidMount() {
    const { controllable } = this.props;

    if (this.rootElem) {
      this.scrollParent = getScrollParent(this.rootElem.current);
      this.scrollParent.addEventListener('scroll', this.close);
    }

    if (!controllable) {
      this.subscribeDoc(document);
      this.awaitIframe().then(this.subscribeDoc);
      document.addEventListener('keyup', this.onDocKeyUp, true);
    }
  }

  componentDidUpdate(prevProps: T.Props) {
    const { isOpen, disabled } = this.props;

    if (disabled) {
      this.store.isOpen = false; // close when receive disabled=true
      return;
    }

    if (typeof isOpen === 'boolean' && isOpen !== prevProps.isOpen) {
      isOpen ? this.open() : this.close();
    }
  }

  componentWillUnmount() {
    this.timers.clear();
    this.unsubscribeDoc(document);
    this.unsubscribeDoc(getIframeDoc());
    document.removeEventListener('keyup', this.onDocKeyUp, true);

    if (this.scrollParent) {
      this.scrollParent.removeEventListener('scroll', this.close);
    }
  }

  awaitIframe() {
    const getIframe = resolve => {
      const iframeDoc = getIframeDoc();

      if (iframeDoc) {
        resolve(iframeDoc);
      } else {
        this.timers.after(300, () => getIframe(resolve));
      }
    };

    return new Promise(getIframe);
  }

  subscribeDoc = doc => {
    if (!doc) return;

    doc.addEventListener('mousedown', this.onMouseDown);
    doc.addEventListener('mouseup', this.onMouseUp, true);
  };

  unsubscribeDoc = doc => {
    if (!doc) return;

    doc.removeEventListener('mousedown', this.onMouseDown);
    doc.removeEventListener('mouseup', this.onMouseUp);
  };

  onTriggerRef = elem => {
    this.triggerElem = elem;
    this.updatePosition();
  };

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
    this._mousePressed = true;
  };

  onMouseUp = e => {
    const { autoClose } = this.props;
    const { isOpen } = this.store;

    this._mousePressed = false;

    if (this._focused) {
      this.open();
      return;
    }

    if (!isOpen || hasParent(e.target, this.triggerElem)) return;

    if (!e.target.closest(`.${S.content}`) || autoClose) this.close();
  };

  onFocus = () => {
    const { controllable, onFocus } = this.props;

    this._focused = true;

    if (!controllable && !this._mousePressed) this.open();

    onFocus?.();
  };

  onBlur = () => {
    const { controllable, onBlur } = this.props;

    this._focused = false;

    onBlur?.();

    if (!controllable && !this._mousePressed) {
      // give time to fire clicks inside popup
      this.timers.after(80, this.close);
    }
  };

  updatePosition() {
    if (!this.triggerElem) return;
    this.store.position = getCoords(this.triggerElem);
  }

  open = () => {
    const { onOpen } = this.props;

    if (this.store.isOpen) return;

    this.timers.clear(this.afterClose);

    Object.assign(this.store, { isOpen: true, isContentVisible: true });
    this.updatePosition();

    if (onOpen) Time.nextTick(onOpen);
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
    const { trigger, content, disabled, controllable, hoverControl } =
      this.props;
    const { isOpen } = this.store;
    const disableTrigger = disabled || !content;
    const classesTrigger = cn(
      S.trigger,
      isOpen && S.isOpen,
      disableTrigger && S.disabled
    );
    const triggerProps = {} as any;

    if (!trigger) return null;

    if (!disableTrigger) {
      triggerProps.role = 'button';

      if (!controllable) {
        Object.assign(triggerProps, {
          onFocusCapture: this.onFocus,
          onBlurCapture: this.onBlur,
        });
      }

      if (hoverControl) {
        Object.assign(triggerProps, {
          onMouseOver: throttle(this.open, 100),
          onMouseLeave: throttle(this.close, 100),
        });
      }
    }

    return (
      <div className={classesTrigger} {...triggerProps} ref={this.onTriggerRef}>
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
      direction,
    } = this.props;
    const { isOpen, isContentVisible, position } = this.store;

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

    if (this.triggerElem && !inline) {
      const { offsetHeight, offsetWidth } = this.triggerElem;

      wrapperProps.style = {
        minHeight: offsetHeight,
        minWidth: offsetWidth,
        ...position,
      } as any;
    }

    const contentNode = (
      <div {...wrapperProps} className={wrapperClasses}>
        {paranja &&
          createPortal(
            <div className={cn(S.paranja, isOpen && S.isOpen)} />,
            target
          )}
        <div {...contentProps} ref={this.containerElem} className={classes}>
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

export type PopupProps = T.Props;
