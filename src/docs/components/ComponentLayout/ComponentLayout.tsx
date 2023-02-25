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
  code: string;
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

export const ComponentLayout = ({
  name,
  examples,
  scope,
  docs: Docs,
}: Props) => {
  const rootPath = `/components/${name.toLowerCase()}`;

  return (
    <Scroll y className={S.root} offset={{ y: { before: 80, after: 50 } }}>
      {examples &&
        createPortal(
          <>
            {examples.map(({ id, label }) => (
              <SidebarLink path={`${rootPath}/${id}`} label={label} key={id} />
            ))}
          </>,
          document.getElementById(`sidebar-item-${name.toLowerCase()}`)
        )}
      <Header name={name} rootPath={rootPath} examples={examples} />
      <Container vertical fullWidth size="l" className={S.content}>
        <Router rootPath={rootPath}>
          <Docs path="/" exact />
          {examples?.map(item => {
            const { id, code } = item;
            return (
              <Code
                exact
                path={`/${id}`}
                code={code}
                scope={{ ...scope, ...item.scope }}
                key={id}
              />
            );
          })}
        </Router>
      </Container>
    </Scroll>
  );
};
