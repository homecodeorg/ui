import { withStore } from 'justorm/react';

import { Router, Link, RequiredStar, Portal } from 'uilib/components';
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
      !isRoot && examples.find(({ id }) => id === path.split('/').pop());

    return (
      <>
        {isRoot ? (
          name
        ) : (
          <Link href={rootPath} className={S.headerLink}>
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

const SidebarItem = ({ id, label, rootPath, items = null }) => {
  const content = items ? (
    <div className={S.sidebarItemGroup} key={id}>
      {label}
    </div>
  ) : (
    <SidebarLink path={`${rootPath}/${id}`} label={label} key={id} />
  );

  return (
    <>
      {content}
      {items?.map(props => (
        <SidebarItem {...props} rootPath={`${rootPath}/${id}`} key={props.id} />
      ))}
    </>
  );
};

type SidebarRouteProps = Omit<ExmapleData, 'label'> & {
  items?: SidebarRouteProps[];
};

const renderSidebarRoute = (
  { id, code, items, scope }: SidebarRouteProps,
  rootScope
) => {
  const content = [
    <Code
      // @ts-ignore
      exact
      path={`/${id}`}
      code={code}
      scope={{ ...rootScope, ...scope }}
      key={id}
    />,
  ];

  items?.forEach(props => {
    content.push(
      ...renderSidebarRoute({ ...props, id: `${id}/${props.id}` }, rootScope)
    );
  });

  return content;
};

export const ComponentLayout = withStore('router')(
  ({ name, examples, scope, docs: Docs, store: { router } }: Props) => {
    const rootPath = `/components/${name}`;
    const isRoot = router.path === rootPath;

    return (
      <Page
        innerClassName={!isRoot && S.demoWrapper}
        contentClassName={!isRoot && S.demo}
        header={
          <>
            <ComponentHeader
              name={name}
              rootPath={rootPath}
              examples={examples}
            />
            {examples && (
              <Portal selector={`#sidebar-item-${name}`}>
                {examples.map(props => (
                  <SidebarItem {...props} rootPath={rootPath} key={props.id} />
                ))}
              </Portal>
            )}
          </>
        }
      >
        <Router rootPath={rootPath}>
          {/* @ts-ignore */}
          <Docs path="/" exact />
          {examples?.map(props => renderSidebarRoute(props, scope))}
        </Router>
      </Page>
    );
  }
);
