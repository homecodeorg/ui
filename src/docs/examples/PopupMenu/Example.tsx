import { PopupMenu, Button } from 'uilib';

export default () => {
  const size = 'm';
  return (
    <PopupMenu
      direction="bottom"
      focusControl
      // hoverControl
      size={size}
      trigger={
        <Button size={size} variant="default">
          Hover to open menu
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
