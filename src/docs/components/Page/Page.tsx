import { Scroll, Container } from 'uilib';

import S from './Page.styl';

export const Header = ({ children }) => (
  <h1 className={S.header}>{children}</h1>
);

export default function Page({ title, children }) {
  return (
    <Scroll
      className={S.root}
      smooth
      y
      offset={{ y: { before: 80, after: 30 } }}
    >
      <Header>{title}</Header>
      <Container vertical className={S.inner}>
        {children}
      </Container>
    </Scroll>
  );
}
