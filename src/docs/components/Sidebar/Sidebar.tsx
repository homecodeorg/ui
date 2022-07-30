import { memo, useCallback, useEffect, useState } from 'react';
import { withStore } from 'justorm/react';
import cn from 'classnames';

import { Link, Scroll, Expand } from 'uilib';

import NAV_CONFIG from '../../navigation';

import S from './Sidebar.styl';

export default memo(
  withStore(['router', 'app'])(function Sidebar({ store }) {
    const { path } = store.router;
    const [openedGroup, setOpenedGroup] = useState(path.split('/')[1]);

    const onExpand = useCallback((group, isOpen) => {
      setOpenedGroup(isOpen ? group : null);
    }, []);

    useEffect(() => {
      setOpenedGroup(null);
    }, [path]);

    return (
      // <Scroll y size="m">
      <div className={S.root}>
        {NAV_CONFIG.map(
          ({ items, ...group }) =>
            items && (
              <Expand
                className={S.item}
                isOpen={
                  openedGroup
                    ? openedGroup === group.id
                    : new RegExp(`^/${group.id}`).test(path)
                }
                onChange={isExpanded => onExpand(group.id, isExpanded)}
                key={group.id}
                header={group.label}
                headerClassName={S.itemHeader}
                content={props => (
                  <Scroll
                    size="s"
                    {...props}
                    y
                    offset={{ y: { before: 10, after: 10 } }}
                    className={S.itemContent}
                    innerClassName={S.itemContentInner}
                  >
                    {items.map(({ id, label }) => {
                      const path = `/${group.id}/${id}`;

                      return (
                        <Link
                          href={path}
                          key={path}
                          className={S.link}
                          isPartialExact
                          onClick={store.app.toggleMenu}
                        >
                          {label}
                        </Link>
                      );
                    })}
                  </Scroll>
                )}
              />
            )
        )}
      </div>
      // </Scroll>
    );
  })
);
