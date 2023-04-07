import Time from 'timen';
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

const show = type => NotificationsStore.show(params[type]);
const showAll = () => {
  let delay = 0;
  Object.keys(params).forEach(type =>
    Time.after((delay += 200), () => show(type))
  );
};

export default () => (
  <Container fullHeight style={{ height: '40vh', maxHeight: '40vh' }}>
    <div style={{ flex: 1 }} className={S.buttons}>
      <Button onClick={() => show('info')}>Info</Button>
      <Button onClick={() => show('warning')}>Warning</Button>
      <Button onClick={() => show('error')}>Error</Button>
      <Button onClick={() => show('loading')}>Loading</Button>
      <Button onClick={showAll}>All</Button>
    </div>
    <Notifications />
  </Container>
);
