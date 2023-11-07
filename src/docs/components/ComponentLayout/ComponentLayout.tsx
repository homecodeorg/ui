import { withStore } from 'justorm/react';

import { Router, Route, Link, RequiredStar, Portal } from 'uilib/components';
import { Code, SidebarLink } from 'docs/components';

import Page from '../Page/Page';
import S from './ComponentLayout.styl';

export type ExmapleData = {
  id: string;
  label: string;
  scope?: Record<string, any>;
  code?: string;
  items?: ExmapleData[];
};

type Props = {
  name: string;
  scope?: Record<string, any>;
  docs: () => JSX.Element;
  examples?: ExmapleData[];
  store?: any;
};

export const Required = ({ text }) => (
  <span className={S.required}>
    <RequiredStar size="xs" inline />
    &nbsp;{text}
  </span>
);

const ComponentHeader = withStore('router')(
  ({ name, rootPath, examples, store }) => {
    const { path } = store.router;
    const isRoot = path === rootPath;
    const matchedExample =
      !isRoot &&
      examples.find(({ id }) => path.startsWith(`${rootPath}/${id}`));

    return (
      <>
        {isRoot ? (
          name
        ) : (
          <Link href="/" className={S.headerLink}>
            {name}
          </Link>
        )}
        {matchedExample && (
          <div className={S.headerSubItem}>/&nbsp;{matchedExample.label}</div>
        )}
      </>
    );
  }
);

const SidebarItem = ({ id, label, rootPath = '', items = null }) => {
  const path = `${rootPath}/${id}`;
  const content = items ? (
    <div className={S.sidebarItemGroup} key={id}>
      {label}
    </div>
  ) : (
    <SidebarLink path={path} label={label} key={id} isPartialExact />
  );

  return (
    <>
      {content}
      {items?.map(props => (
        <SidebarItem {...props} rootPath={path} key={props.id} />
      ))}
    </>
  );
};

type SidebarRouteProps = Omit<ExmapleData, 'label'> & {
  items?: SidebarRouteProps[];
};

const renderSidebarRoute = (
  name,
  { id, code, items, scope }: SidebarRouteProps,
  rootScope
) => {
  const content = [];

  if (code) {
    content.push(
      <Route
        component={Code}
        path={`/${id}`}
        // @ts-ignore
        id={`${name}::${id}`}
        code={code}
        scope={{ ...rootScope, ...scope }}
        key={id}
      />
    );
  }

  items?.forEach(props => {
    content.push(
      ...renderSidebarRoute(
        name,
        { ...props, id: `${id}/${props.id}` },
        rootScope
      )
    );
  });

  return content;
};

export const ComponentLayout = withStore('router')(
  ({ name, examples, scope, docs: Docs, store: { router } }: Props) => {
    const basePath = `/components/${name}`;
    const isRoot = router.path === basePath;

    return (
      <Page
        innerClassName={!isRoot && S.demoWrapper}
        contentClassName={!isRoot && S.demo}
        header={
          <>
            <ComponentHeader
              name={name}
              rootPath={basePath}
              examples={examples}
            />
            {examples && (
              <Portal selector={`#sidebar-item-${name}`}>
                {examples.map(props => (
                  <SidebarItem {...props} key={props.id} />
                ))}
              </Portal>
            )}
          </>
        }
      >
        <Router>
          {/* @ts-ignore */}
          <Route component={Docs} path="/" exact />
          {examples?.map(props => renderSidebarRoute(name, props, scope))}
        </Router>
      </Page>
    );
  }
);
