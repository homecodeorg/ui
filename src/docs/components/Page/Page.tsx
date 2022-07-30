import { Scroll, Container, H1 } from 'uilib';

import S from './Page.styl';

export default function Page({ title, children }) {
  return (
    <Scroll
      className={S.root}
      smooth
      y
      offset={{ y: { before: 80, after: 30 } }}
    >
      <H1 className={S.title}>{title}</H1>
      <Container vertical className={S.inner}>
        {children}
      </Container>
    </Scroll>
  );
}
