import State from 'helpers/State';
import { Container } from '../../../components/Container/Container';
import { Checkbox } from '../../../components/Checkbox/Checkbox';

export default () => (
  <Container centered fullHeight size="l">
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
);
