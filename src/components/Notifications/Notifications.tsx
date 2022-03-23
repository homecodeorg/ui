import { Component, useCallback, useEffect } from 'react';
import cn from 'classnames';
import { withStore } from 'justorm/react';

import { isTouch } from 'uilib/tools/dom';

import { Icon } from '../Icon/Icon';
import { Button } from '../Button/Button';

import STORE from './store';
import S from './Notifications.styl';
import * as T from './Notifications.types';

function getContent(content, links, LinkComponent) {
  const items = [] as JSX.Element[];

  if (!links) return content;

  content?.split('%s').forEach((part, i) => {
    items.push(part);

    if (i > 0) {
      const link = links[i - 1];

      if (link) {
        const { text, href } = link;
        items.push(<LinkComponent to={href}>{text}</LinkComponent>);
      }
    }
  });

  return items;
}

class Item extends Component<T.Props> {
  isTouchStarted = false;

  onTouchStart = () => {
    this.isTouchStarted = true;
  };

  onTouchMove = e => {
    const { unpause } = this.props;

    // e.preventDefault();
    e.stopPropagation();
    unpause();
    this.closeMe();
  };

  onTouchEnd = () => {
    const { unpause } = this.props;

    unpause();
    this.isTouchStarted = false;
  };

  onTouchCancel = () => (this.isTouchStarted = false);

  closeMe = () => {
    const { id, close } = this.props;
    close(id);
  };

  render() {
    const {
      type = 'default',
      title,
      content,
      links,
      visible,
      pause,
      unpause,
      LinkComponent,
    } = this.props;
    const classes = cn(S.item, S[`type-${type}`], visible && S.visible);

    return (
      <div
        className={classes}
        onMouseOver={pause}
        onFocus={pause}
        onTouchStart={pause}
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
              {content && (
                <div className={S.content}>
                  {getContent(content, links, LinkComponent)}
                </div>
              )}
            </div>
          )}
          <Button
            className={S.close}
            variant="clear"
            isSquare
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
})(function Notifications({ store }: Props) {
  const { notifications } = store;
  const { items, data, pause, unpause, close } = notifications;
  const api = { pause, unpause, close };

  return (
    <div className={cn(S.root, items.length === 0 && S.empty)}>
      {items.map(id => (
        <Item {...data[id]} {...api} id={id} key={id} />
      ))}
    </div>
  );
});
