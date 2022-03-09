import { Container, Button, Notifications, NotificationsStore } from 'uilib';

const params = {
  info: {
    title: 'Information',
    content: 'This is informative type of notification.',
  },
  warning: {
    type: 'warning',
    title: 'Warning',
    content: 'Connection lost.',
  },
  error: {
    type: 'danger',
    title: 'Error',
    content: 'Server are down. Need your support ASAP.',
  },
  loading: {
    autohide: false,
    title: 'Loading...',
    content: 'This notification stay visible until you close it.',
  },
};

const show = type => () => NotificationsStore.show(params[type]);

export default () => (
  <Container centered fullHeight>
    <Notifications />
    <Button onClick={show('info')}>Info</Button>-
    <Button onClick={show('warning')}>Warning</Button>-
    <Button onClick={show('error')}>Error</Button>-
    <Button onClick={show('loading')}>Loading</Button>
  </Container>
);
