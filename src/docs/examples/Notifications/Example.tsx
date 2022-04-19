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
  ['info', 'warning', 'error', 'loading'].forEach(type =>
    Time.after((delay += Math.random() * 1000), () => show(type))
  );
};

export default () => (
  <Container fullHeight>
    <Notifications style={{ maxWidth: '60%' }} />
    <div>
      <Button onClick={() => show('info')}>Info</Button>
      <br />
      <Button onClick={() => show('warning')}>Warning</Button>
      <br />
      <Button onClick={() => show('error')}>Error</Button>
      <br />
      <Button onClick={() => show('loading')}>Loading</Button>
      <br />
      <Button onClick={showAll}>All</Button>
    </div>
  </Container>
);
