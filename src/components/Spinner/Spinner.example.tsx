import { Container } from '../Container/Container';

import { Spinner } from './Spinner';

export default () => (
  <Container centered fullHeight>
    <Spinner />
    &nbsp;
    <Spinner size="m" />
    &nbsp;
    <Spinner size="l" />
  </Container>
);
