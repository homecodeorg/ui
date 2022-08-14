import { withStore } from 'justorm/react';

import { Router, Link, Container } from 'uilib/components';
import { Code, TypesNavigator } from 'docs/components';

import S from './ComponentLayout.styl';

export type ExmapleData = {
  id: string;
  label: string;
  content: React.ReactNode;
};

type Props = {
  name: string;
  rootPath: string;
  scope: Record<string, any>;
  examples: ExmapleData[];
  documentation: React.ReactNode;
};

const Header = withStore('router')(({ name, rootPath, examples, store }) => {
  const tail = store.router.path
    .replace(new RegExp(`^${rootPath}`), '')
    .replace(/\?.+/, '')
    .split('/')
    .pop();
  const example = tail && examples.find(({ id }) => id === tail);
  const title = <h1>{name}</h1>;
  return (
    <div className={S.header}>
      {example ? (
        <>
          <Link className={S.title} href={rootPath}>
            {title}
          </Link>
          <h2 className={S.subtitle}>{example.label}</h2>
        </>
      ) : (
        title
      )}
    </div>
  );
});

export function ComponentLayout({
  name,
  rootPath,
  examples,
  scope,
  documentation: Docs,
}: Props) {
  return (
    <div className={S.root}>
      <Header name={name} rootPath={rootPath} examples={examples} />
      <Container vertical fullWidth size="m" className={S.content}>
        <Router rootPath={rootPath}>
          <Docs path="/" exact />
          {examples.map(({ id, content }) => (
            <Code exact path={`/${id}`} code={content} scope={scope} key={id} />
          ))}
        </Router>
        {/* <TypesNavigator scope={name} type="Props" /> */}
      </Container>
    </div>
  );
}
