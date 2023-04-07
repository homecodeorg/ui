import { Component } from 'react';
import cn from 'classnames';
import { withStore } from 'justorm/react';

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

class Item extends Component<T.ItemProps> {
  startPos = null;

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
              {content && <div className={S.content}>{content}</div>}
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

export const Notifications = withStore({
  notifications: ['items', 'data'],
})(function Notifications({ store, ...rest }: Props) {
  const { notifications } = store;
  const { items, data, pause, unpause, close } = notifications;
  const api = { pause, unpause, close };
  const classes = cn(S.root, items.length === 0 && S.empty);

  return (
    <Scroll
      {...rest}
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
});
