import { Menu } from 'uilib';

export default () => {
  return (
    <Menu style={{ maxWidth: 200 }}>
      <Menu.Group label="Fruits">
        <Menu.Item>Apple</Menu.Item>
        <Menu.Item selected>Banana</Menu.Item>
        <Menu.Item disabled>Orange</Menu.Item>
      </Menu.Group>
      <Menu.Group label="Vegetables">
        <Menu.Item level={1}>CarrotCarrotCarrotCarrot</Menu.Item>
        <Menu.Item level={2}>BroccoliBroccoliBroccoli</Menu.Item>
        <Menu.Item level={3}>CucumberCucumberCucumber</Menu.Item>
        <Menu.Item level={3}>CucumberCucumberCucumber</Menu.Item>
        <Menu.Item level={3}>CucumberCucumberCucumber</Menu.Item>
        <Menu.Item level={3}>CucumberCucumberCucumber</Menu.Item>
        <Menu.Item level={3}>CucumberCucumberCucumber</Menu.Item>
      </Menu.Group>
    </Menu>
  );
};
