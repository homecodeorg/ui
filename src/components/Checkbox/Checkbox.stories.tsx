import { storiesOf } from '@storybook/preact';
import { createStore } from 'justorm/preact';

import { State } from 'src/storybook.helpers';
import Container from '../Container/Container';
import Checkbox from './Checkbox';

storiesOf('Checkbox').add('default', () => (
  <Container centered fullHeight>
    <State initial={{ checked: true }}>
      {store => (
        <Checkbox
          label="i'm a checkbutton"
          onChange={() => (store.checked = !store.checked)}
          checked={store.checked}
        />
      )}
    </State>
  </Container>
));
