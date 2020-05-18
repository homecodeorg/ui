import { storiesOf } from '@storybook/preact';

import Container from 'components/Container/Container';

import Menu, { MenuItem } from './Menu';

storiesOf('Menu').add('default', () => (
  <Container>
    <Menu>
      <MenuItem>Item 1</MenuItem>
      <MenuItem>Item 2</MenuItem>
      <MenuItem>Item 3</MenuItem>
      <MenuItem>Item 4</MenuItem>
      <MenuItem>Item 5</MenuItem>
      <MenuItem>Item 6</MenuItem>
    </Menu>
  </Container>
));
