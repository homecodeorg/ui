import { withStore } from 'justorm/react';

import {
  Router,
  Link,
  Container,
  Scroll,
  RequiredStar,
} from 'uilib/components';
import { Code, SidebarLink } from 'docs/components';

import S from './ComponentLayout.styl';
import { createPortal } from 'react-dom';

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
};

export const Required = ({ text }) => (
  <span className={S.required}>
    <RequiredStar size="xs" inline />
    &nbsp;{text}
  </span>
);

const Header = withStore('router')(({ name, rootPath, examples, store }) => {
  const { path } = store.router;
  const isRoot = path === rootPath;
  const matchedExample =
    !isRoot && examples.find(({ id }) => id === path.split('/').pop());

  return (
    <h1 className={S.header}>
      {isRoot ? (
        name
      ) : (
        <Link href={rootPath} className={S.headerLink}>
          {name}
        </Link>
      )}
      {matchedExample && (
        <div className={S.headerSubItem}>&gt;&nbsp;{matchedExample.label}</div>
      )}
    </h1>
  );
});

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

export const ComponentLayout = ({
  name,
  examples,
  scope,
  docs: Docs,
}: Props) => {
  const rootPath = `/components/${name}`;

  return (
    <Scroll y className={S.root} offset={{ y: { before: 80, after: 50 } }}>
      {examples &&
        createPortal(
          <>
            {examples.map(props => (
              <SidebarItem {...props} rootPath={rootPath} key={props.id} />
            ))}
          </>,
          document.getElementById(`sidebar-item-${name}`)
        )}
      <Header name={name} rootPath={rootPath} examples={examples} />
      <Container vertical fullWidth size="l" className={S.content}>
        <Router rootPath={rootPath}>
          {/* @ts-ignore */}
          <Docs path="/" exact />
          {examples?.map(props => renderSidebarRoute(props, scope))}
        </Router>
      </Container>
    </Scroll>
  );
};
