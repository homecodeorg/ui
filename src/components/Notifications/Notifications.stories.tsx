import { storiesOf } from '@storybook/preact';

import Container from '../Container/Container';
import Button from '../Button/Button';
import Notifications from './Notifications';

function info() {
  window.notifications.show({
    title: 'Information',
    content: 'This is informative type of notification.',
  });
}

function error() {
  window.notifications.show({
    type: 'danger',
    title: 'Error',
    content: 'Server are down. Need your support ASAP.',
  });
}

function loading() {
  window.notifications.show({
    autohide: false,
    title: 'Loading...',
    content: 'This notification stay visible until you close it.',
  });
}

storiesOf('Notifications').add('default', () => (
  <Container centered fullHeight>
    <Notifications />
    <Button onClick={info}>Info</Button>&nbsp;
    <Button onClick={error}>Error</Button>&nbsp;
    <Button onClick={loading}>Loading</Button>
  </Container>
));
