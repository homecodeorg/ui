import { Button, Icon } from 'uilib';

export default () => {
  const size = 'm';

  return ['text', 'clear', 'default', 'outlined', 'primary'].map(variant => (
    <Button size={size} variant={variant} key={variant} className={S.item}>
      {variant}
    </Button>
  ));
};
