import { storiesOf } from '@storybook/preact';

import Container from '../Container/Container';

import Icon from './Icon';
import CUSTOM_ICONS from './icons/index';

import S from './Icon.stories.styl';

const FA_ICONS_EXAMPLE = [
  'bookmark',
  'save',
  'cat',
  'grin',
  'dove',
  'bell-slash',
];

function renderIcon(key) {
  return (
    <div className={S.item} key={key}>
      <Icon type={key} key={key} size="m" />
      &nbsp;{key}
    </div>
  );
}

storiesOf('Icon', module)
  .add('custom', () => (
    <Container vertical>{Object.keys(CUSTOM_ICONS).map(renderIcon)}</Container>
  ))
  .add('font-awesome', () => (
    <Container vertical>
      {FA_ICONS_EXAMPLE.map(renderIcon)}
      ...
      <span>
        See&nbsp;
        <a
          href="https://github.com/FortAwesome/Font-Awesome/tree/master/svgs"
          target="_blank"
          rel="noopener noreferrer"
        >
          icons catalog
        </a>
        .
      </span>
    </Container>
  ));
