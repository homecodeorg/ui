import { Menu } from 'uilib';

export default () => {
  return (
    <Menu>
      <Menu.Group label="Fruits">
        <Menu.Item>Apple</Menu.Item>
        <Menu.Item selected>Banana</Menu.Item>
        <Menu.Item disabled>Orange</Menu.Item>
      </Menu.Group>
      <Menu.Group label="Vegetables">
        <Menu.Item>Carrot</Menu.Item>
        <Menu.Item>Broccoli</Menu.Item>
        <Menu.Item>Cucumber</Menu.Item>
      </Menu.Group>
    </Menu>
  );
};
