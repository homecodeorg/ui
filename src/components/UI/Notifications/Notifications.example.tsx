import Container from '../Container/Container';
import Button from '../Button/Button';
import Notifications, { store } from './Notifications';

function info() {
  store.show({
    title: 'Information',
    content: 'This is informative type of notification.',
  });
}

function warning() {
  store.show({
    type: 'warning',
    title: 'Warning',
    content: 'Connection lost.',
  });
}

function error() {
  store.show({
    type: 'danger',
    title: 'Error',
    content: 'Server are down. Need your support ASAP.',
  });
}

function loading() {
  store.show({
    autohide: false,
    title: 'Loading...',
    content: 'This notification stay visible until you close it.',
  });
}

export default () => (
  <Container centered fullHeight>
    <Notifications />
    <Button onClick={info}>Info</Button>&nbsp;
    <Button onClick={warning}>Warning</Button>&nbsp;
    <Button onClick={error}>Error</Button>&nbsp;
    <Button onClick={loading}>Loading</Button>
  </Container>
);
