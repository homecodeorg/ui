import { Container } from '../Container/Container';

import { Icon } from './Icon';
import * as CUSTOM_ICONS from './icons';

import S from './Icon.example.styl';

function renderIcon(key) {
  return (
    <div className={S.item} key={key}>
      <Icon type={key} key={key} size="m" />
      &nbsp;{key}
    </div>
  );
}

export default () => (
  <Container vertical size="l">
    {Object.keys(CUSTOM_ICONS).map(renderIcon)}
  </Container>
);
