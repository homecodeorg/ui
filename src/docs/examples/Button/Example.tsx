import { Button, Icon } from 'uilib';

export default () => {
  const size = 'm';

  return (
    <Button
      size={size}
      // square
      // variant="outlined"
      prefixElem={<Icon type="check" size={size} />}
    >
      Just do it
    </Button>
  );
};
