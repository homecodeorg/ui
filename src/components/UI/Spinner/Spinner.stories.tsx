import { storiesOf } from '@storybook/preact';

import Container from '../Container/Container';
import Spinner from './Spinner';

storiesOf('Spinner').add('default', () => (
  <Container centered fullHeight>
    <Spinner />
    &nbsp;
    <Spinner size="m" />
    &nbsp;
    <Spinner size="l" />
  </Container>
));
