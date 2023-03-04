import { Fragment, memo, useCallback, useEffect, useState } from 'react';
import { withStore } from 'justorm/react';

import { Link, Scroll, Expand } from 'uilib';

import NAV_CONFIG from '../../navigation';

import S from './Sidebar.styl';

export const SidebarLink = withStore('app')(({ path, label, store }) => (
  <Link
    href={path}
    key={path}
    className={S.link}
    onClick={store.app.toggleMenu}
  >
    {label}
  </Link>
));

export default memo(
  withStore('router')(function Sidebar({ store }) {
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
                        <Fragment key={id}>
                          <SidebarLink path={path} label={label || id} />
                          <div
                            id={`sidebar-item-${id}`}
                            className={S.subItems}
                          />
                        </Fragment>
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
