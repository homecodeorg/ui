import { Component } from 'react';
import cn from 'classnames';
import { withStore } from 'justorm/react';

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

function Item(props: T.Props) {
  const {
    id,
    type = 'default',
    title,
    content,
    links,
    visible,
    pause,
    unpause,
    close,
    LinkComponent,
  } = props;
  const classes = cn(S.item, S[`type-${type}`], visible && S.visible);

  return (
    <div
      className={classes}
      onMouseOver={pause}
      onFocus={pause}
      onTouchStart={pause}
      onMouseOut={unpause}
      onBlur={unpause}
      onTouchEnd={unpause}
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
          onClick={() => close(id)}
        >
          <Icon type="close" size="m" />
        </Button>
      </div>
    </div>
  );
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
    <div className={S.root}>
      {items.map(id => (
        <Item {...data[id]} {...api} id={id} key={id} />
      ))}
    </div>
  );
});
