import { Button, Tooltip } from 'uilib';

export default () => {
  const size = 'm';

  return (
    <Tooltip content="Just do it">
      <Button size={size}>Hey!</Button>
    </Tooltip>
  );
};
