import { PopupMenu, Button } from 'uilib';

export default () => {
  const size = 'm';
  return (
    <PopupMenu
      direction="bottom"
      autoClose
      isOpen
      size={size}
      trigger={
        <Button size={size} variant="default">
          Open Menu
        </Button>
      }
      items={[
        {
          id: 'ololo',
          title: 'Ololo',
          // onClick: () => alert('ololo'),
        },
        {
          id: 'azaza',
          title: 'Azaza',
          // onClick: () => alert('azaza'),
        },
      ]}
    />
  );
};
