import { useCallback, useEffect, useState, memo } from 'react';
import cn from 'classnames';

import { Link, Scroll, string } from 'uilib';

import app from '../App/store';
import NAV_CONFIG, { RouteItem } from '../../navigation';

type ItemProps = {
  slug: RouteItem['slug'];
  parentSlug?: RouteItem['slug'];
};

import S from './Sidebar.styl';

function Item({ slug, parentSlug = '' }: ItemProps) {
  const href = parentSlug ? `/${parentSlug}/${slug}` : `/${slug}`;

  return (
    <Link
      href={href}
      isPartialExact
      className={cn(S.link, parentSlug && S.sub)}
      exactClassName={S.active}
      onClick={() => (app.isMenuOpen = false)}
      key={slug}
    >
      {string.capitalize(slug)}
    </Link>
  );
}

async function loadExampleRoutes({ slug, items }: Partial<RouteItem>) {
  if (!items) return {};
  const routes = await items();
  return { [slug]: routes.default };
}

export default memo(function Sidebar() {
  const [subItems, setSubItems] = useState({});

  const loadSubItems = useCallback(async () => {
    const routes = await Promise.all(NAV_CONFIG.map(loadExampleRoutes));
    const subItems = routes.reduce((acc, item) => ({ ...acc, ...item }), {});

    setSubItems(subItems);
  }, []);

  useEffect(() => {
    loadSubItems();
  }, []);

  return (
    <Scroll y size="s">
      <div className={S.root}>
        {NAV_CONFIG.map(({ slug }) => (
          <Item slug={slug} items={subItems[slug]} />
        ))}
      </div>
    </Scroll>
  );
});
