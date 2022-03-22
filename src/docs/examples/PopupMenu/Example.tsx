import { PopupMenu, Button } from 'uilib';

export default () => {
  return (
    <PopupMenu
      trigger={
        <Button size="l" variant="default">
          Open Menu
        </Button>
      }
      items={[
        {
          id: 'ololo',
          title: 'Ololo',
          onClick: () => alert('ololo'),
        },
        {
          id: 'azaza',
          title: 'Azaza',
          onClick: () => alert('azaza'),
        },
      ]}
    />
  );
};
