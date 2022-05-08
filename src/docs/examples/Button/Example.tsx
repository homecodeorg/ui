import { Button, Icon } from 'uilib';

export default () => {
  const size = 'm';

  return (
    <Button
      size={size}
      // square
      variant="default"
      prefixElem={<Icon type="check" size={size} />}
    >
      I'm a button
    </Button>
  );
};
