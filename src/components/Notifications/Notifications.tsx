import { Component, createRef } from 'react';
import cn from 'classnames';
import { useStore } from 'justorm/react';

import { Icon } from 'uilib/components/Icon/Icon';
import { Button } from 'uilib/components/Button/Button';
import { Scroll } from 'uilib/components/Scroll/Scroll';

import STORE from './store';
import S from './Notifications.styl';
import * as T from './Notifications.types';

function getTouchPos(e) {
  const { clientX: x, clientY: y } = e.targetTouches[0];
  return { x, y };
}

function getDeltaPos(p1, p2) {
  return {
    x: Math.abs(p2.x - p1.x),
    y: Math.abs(p2.y - p1.y),
  };
}

const TOUCH_MOVE_TRESHOLD = 50;
const WHEEL_MOVE_THRESHOLD = 20;
const WHEEL_RESET_MS = 150;

const wheelGesture = {
  itemId: null as string | null,
  deltaX: 0,
  deltaY: 0,
  resetTimer: null as ReturnType<typeof setTimeout> | null,
};

function resetWheelGesture() {
  wheelGesture.itemId = null;
  wheelGesture.deltaX = 0;
  wheelGesture.deltaY = 0;

  if (wheelGesture.resetTimer) {
    clearTimeout(wheelGesture.resetTimer);
    wheelGesture.resetTimer = null;
  }
}

function scheduleWheelGestureReset() {
  if (wheelGesture.resetTimer) {
    clearTimeout(wheelGesture.resetTimer);
  }

  wheelGesture.resetTimer = setTimeout(resetWheelGesture, WHEEL_RESET_MS);
}

type WheelDelta = Pick<WheelEvent, 'deltaX' | 'deltaY'>;

function isHorizontalWheel(e: WheelDelta, id: string) {
  const absX = Math.abs(e.deltaX);
  const absY = Math.abs(e.deltaY);

  if (absX > absY) return true;

  return (
    wheelGesture.itemId === id && wheelGesture.deltaX >= wheelGesture.deltaY
  );
}

function handleNotificationWheel(
  id: string,
  e: WheelDelta,
  unpause: () => void,
  close: (id: string) => void
) {
  scheduleWheelGestureReset();

  if (wheelGesture.itemId !== null && wheelGesture.itemId !== id) {
    return;
  }

  if (wheelGesture.itemId === null) {
    wheelGesture.itemId = id;
  }

  wheelGesture.deltaX += Math.abs(e.deltaX);
  wheelGesture.deltaY += Math.abs(e.deltaY);

  if (
    wheelGesture.deltaX > wheelGesture.deltaY &&
    wheelGesture.deltaX > WHEEL_MOVE_THRESHOLD
  ) {
    const closingId = wheelGesture.itemId;

    unpause();
    wheelGesture.deltaX = 0;
    wheelGesture.deltaY = 0;
    close(closingId);
  }
}

class Item extends Component<T.ItemProps> {
  startPos = null;
  itemRef = createRef<HTMLDivElement>();

  componentDidMount() {
    this.itemRef.current?.addEventListener('wheel', this.onWheelNative, {
      passive: false,
      capture: true,
    });
  }

  componentWillUnmount() {
    this.itemRef.current?.removeEventListener('wheel', this.onWheelNative, {
      capture: true,
    });
  }

  onTouchStart = e => {
    this.startPos = getTouchPos(e);
  };

  onTouchMove = e => {
    const { unpause } = this.props;

    if (!this.startPos) return;

    // e.preventDefault();
    e.stopPropagation();

    const pos = getTouchPos(e);
    const delta = getDeltaPos(this.startPos, pos);

    if (delta.x > delta.y && delta.x > TOUCH_MOVE_TRESHOLD) {
      unpause();
      this.closeMe();
    }
  };

  onTouchEnd = () => {
    const { unpause } = this.props;

    unpause();
    this.startPos = null;
  };

  onTouchCancel = () => (this.startPos = null);

  onWheelNative = (e: WheelEvent) => {
    const { id, unpause, close } = this.props;

    if (isHorizontalWheel(e, id)) {
      e.preventDefault();
      e.stopPropagation();
    }

    handleNotificationWheel(id, e, unpause, close);
  };

  closeMe = () => {
    const { id, close } = this.props;
    close(id);
  };

  render() {
    const {
      type = 'default',
      title,
      content,
      visible,
      pause,
      unpause,
    } = this.props;
    const classes = cn(S.item, S[`type-${type}`], visible && S.visible);

    return (
      <div
        ref={this.itemRef}
        className={classes}
        onMouseOver={pause}
        onFocus={pause}
        onTouchStart={this.onTouchStart}
        onTouchMove={this.onTouchMove}
        onMouseOut={unpause}
        onBlur={unpause}
        onTouchEnd={this.onTouchEnd}
        onTouchCancel={this.onTouchCancel}
      >
        <div className={S.itemInner}>
          {(title || content) && (
            <div className={S.text}>
              {title && <div className={S.title}>{title}</div>}
              {content != null && (
                <div className={S.content}>
                  {typeof content === 'function' ? content() : content}
                </div>
              )}
            </div>
          )}
          <Button
            className={S.close}
            variant="clear"
            square
            onClick={this.closeMe}
          >
            <Icon type="close" size="s" />
          </Button>
        </div>
      </div>
    );
  }
}

type Props = { store?: any };

export const NotificationsStore = STORE;

export const Notifications = function Notifications(props: Props) {
  const { notifications } = useStore({
    notifications: ['items', 'data'],
  });
  const { items, data, pause, unpause, close } = notifications;
  const api = { pause, unpause, close };
  const classes = cn(S.root, items.length === 0 && S.empty);

  return (
    <Scroll
      {...props}
      y
      size="s"
      className={classes}
      innerClassName={S.inner}
      offset={{ y: { before: 22, after: 22 } }}
    >
      {items.map(id => (
        <Item {...data[id]} {...api} id={id} key={id} />
      ))}
    </Scroll>
  );
};
