import { Expand, Gap, Link, Scroll } from 'uilib';
import { Fragment, memo, useCallback, useEffect, useState } from 'react';

import { I18N } from 'docs/config/i18n';
import NAV_CONFIG from '../../navigation';
import S from './Sidebar.styl';
import cn from 'classnames';
import { useStore } from 'justorm/react';

export const SidebarLink = ({ path, label, ...rest }) => {
  const { app } = useStore({ app: ['toggleMenu'] });

  return (
    <Link
      {...rest}
      href={path}
      key={path}
      className={S.link}
      onClick={app.toggleMenu}
    >
      <I18N id={label} />
    </Link>
  );
};

type SidebarProps = {
  searchQuery?: string;
};

function Sidebar({ searchQuery = '' }: SidebarProps) {
  const { router } = useStore({ router: [] });
  const { path } = router;
  const [openedGroup, setOpenedGroup] = useState(path.split('/')[1]);
  const [prevPath, setPrevPath] = useState(path);
  const onExpand = useCallback((group, isOpen) => {
    setOpenedGroup(isOpen ? group : null);
  }, []);

  useEffect(() => {
    if (path !== prevPath) {
      setOpenedGroup(null);
      setPrevPath(path);
    }
  }, [path]);

  const q = searchQuery.trim().toLowerCase();

  const renderGroup = useCallback(
    ({ items, ...group }) => {
      if (!items) return null;

      const groupLabel =
        typeof group.label === 'string' ? group.label : group.id;
      const groupMatches = Boolean(q) && groupLabel.toLowerCase().includes(q);
      let visibleItems = items;
      if (q && !groupMatches) {
        visibleItems = items.filter(({ id, label }) =>
          (label || id).toLowerCase().includes(q)
        );
      }

      if (q && visibleItems.length === 0) return null;

      const isOpen =
        Boolean(q) ||
        (openedGroup
          ? openedGroup === group.id
          : new RegExp(`^/${group.id}`).test(path));

      return (
        <Expand
          className={cn(S.item, isOpen && S.opened)}
          isOpen={isOpen}
          onChange={isExpanded => onExpand(group.id, isExpanded)}
          key={group.id}
          header={
            <>
              <I18N id={group.label} />
              <Gap />
            </>
          }
          headerClassName={S.itemHeader}
          content={props => (
            <Scroll
              autoHide
              size="s"
              fadeSize="s"
              {...props}
              y
              offset={{ y: { before: 20, after: 20 } }}
              className={S.itemContent}
              innerClassName={S.itemContentInner}
            >
              {visibleItems.map(({ id, label }) => {
                const itemPath = `/${group.id}/${id}`;

                return (
                  <Fragment key={id}>
                    <SidebarLink path={itemPath} label={label || id} />
                    <div id={`sidebar-item-${id}`} className={S.subItems} />
                  </Fragment>
                );
              })}
            </Scroll>
          )}
        />
      );
    },
    [openedGroup, onExpand, path, q]
  );

  return <div className={S.root}>{NAV_CONFIG.map(renderGroup)}</div>;
}

export default memo(Sidebar);
