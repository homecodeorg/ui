import cn from 'classnames';
import { Scroll, Container } from 'uilib';

import S from './Page.styl';

export const Header = ({ children }) => (
  <h1 className={S.header}>{children}</h1>
);

export default function Page({
  header,
  innerClassName = '',
  contentClassName = '',
  children,
}) {
  return (
    <Scroll
      className={S.root}
      innerClassName={cn(S.inner, innerClassName)}
      smooth
      y
      offset={{ y: { before: 100, after: 100 } }}
    >
      <Header>{header}</Header>
      <Container vertical className={cn(S.content, contentClassName)}>
        {children}
      </Container>
    </Scroll>
  );
}
