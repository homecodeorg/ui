import { Button, Icon } from 'uilib';

export default () => {
  return (
    <Button
      size="l"
      // isSquare
      variant="default"
      prefixElem={<Icon type="check" size="l" />}
    >
      I'm a button
    </Button>
  );
};
