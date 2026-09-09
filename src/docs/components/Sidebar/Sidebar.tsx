import { Button, Expand, Gap, Input, Link, Scroll } from 'uilib';
import {
  Fragment,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { I18N } from 'docs/config/i18n';
import NAV_CONFIG from '../../navigation';
import S from './Sidebar.styl';
import { SearchIcon } from 'lucide-react';
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

function Sidebar() {
  const { router } = useStore({ router: [] });
  const { path } = router;
  const [openedGroup, setOpenedGroup] = useState(path.split('/')[1]);
  const [prevPath, setPrevPath] = useState(path);
  const [isSearching, setIsSearching] = useState(false);
  const [query, setQuery] = useState('');
  const searchInputRef = useRef(null);
  const blurTimeoutRef = useRef(null);
  const onExpand = useCallback((group, isOpen) => {
    setOpenedGroup(isOpen ? group : null);
  }, []);

  useEffect(() => {
    if (path !== prevPath) {
      setOpenedGroup(null);
      setPrevPath(path);
      setIsSearching(false);
      setQuery('');
      clearTimeout(blurTimeoutRef.current);
    }
  }, [path]);

  const startSearch = useCallback(e => {
    e.preventDefault();
    e.stopPropagation();
    setOpenedGroup('components');
    setIsSearching(true);
  }, []);

  const stopSearch = useCallback(() => {
    setIsSearching(false);
    setQuery('');
  }, []);

  const onSearchBlur = useCallback(() => {
    clearTimeout(blurTimeoutRef.current);
    blurTimeoutRef.current = setTimeout(stopSearch, 100);
  }, [stopSearch]);

  const onSearchFocus = useCallback(() => {
    clearTimeout(blurTimeoutRef.current);
  }, []);

  useEffect(() => {
    if (!isSearching) return;
    searchInputRef.current?.focus?.();
  }, [isSearching]);

  const renderGroup = useCallback(
    ({ items, ...group }) => {
      if (!items) return null;

      const isOpen = openedGroup
        ? openedGroup === group.id
        : new RegExp(`^/${group.id}`).test(path);
      const canSearch = group.id === 'components';
      const q = query.trim().toLowerCase();
      const visibleItems =
        canSearch && q
          ? items.filter(({ id, label }) =>
              (label || id).toLowerCase().includes(q)
            )
          : items;

      return (
        <Expand
          className={cn(S.item, isOpen && S.opened)}
          isOpen={isOpen}
          onChange={isExpanded => onExpand(group.id, isExpanded)}
          key={group.id}
          header={
            <>
              {canSearch && isSearching ? (
                <span
                  className={S.searchInput}
                  onBlur={onSearchBlur}
                  onFocus={onSearchFocus}
                  onClick={e => e.stopPropagation()}
                  onMouseDown={e => e.stopPropagation()}
                >
                  <Input
                    ref={searchInputRef}
                    variant="clean"
                    placeholder="Search..."
                    size="s"
                    value={query}
                    onChange={(e, val) => setQuery(String(val ?? ''))}
                    onBlur={onSearchBlur}
                    onFocus={onSearchFocus}
                  />
                </span>
              ) : (
                <>
                  <I18N id={group.label} />
                  <Gap />
                </>
              )}

              {canSearch && !isSearching && (
                <Button
                  className={S.search}
                  variant="text"
                  size="s"
                  onClick={startSearch}
                  onMouseDown={e => e.stopPropagation()}
                >
                  <SearchIcon size={16} />
                </Button>
              )}
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
                const path = `/${group.id}/${id}`;

                return (
                  <Fragment key={id}>
                    <SidebarLink path={path} label={label || id} />
                    <div id={`sidebar-item-${id}`} className={S.subItems} />
                  </Fragment>
                );
              })}
            </Scroll>
          )}
        />
      );
    },
    [openedGroup, isSearching, query, startSearch, onSearchBlur, onSearchFocus]
  );

  return <div className={S.root}>{NAV_CONFIG.map(renderGroup)}</div>;
}

export default memo(Sidebar);
