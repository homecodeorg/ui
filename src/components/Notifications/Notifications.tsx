import cn from 'classnames';
import { withStore } from 'justorm/preact';

import Link from '../Navigation/Link/Link';
import Icon from '../Icon/Icon';
import { IconSize } from '../Icon/Icon.types';
import Button from '../Button/Button';

import './store';
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
    LinkComponentt,
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
                {getContent(content, links, LinkComponentt)}
              </div>
            )}
          </div>
        )}
        <Button
          className={S.close}
          variant="clear"
          square
          onClick={() => close(id)}
        >
          <Icon type="close" size="m" />
        </Button>
      </div>
    </div>
  );
}

export default withStore({ notifications: ['items', 'data'] })(
  function Notifications(props) {
    const { items, data, pause, unpause, close } = props.store.notifications;
    const api = { pause, unpause, close };

    return (
      <div className={S.root}>
        {items.map(id => (
          <Item {...data[id]} {...api} id={id} key={id} />
        ))}
      </div>
    );
  }
);
