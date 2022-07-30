import { ComponentLayout, Code, TypesNavigator } from 'docs/components';

import example from '!!raw-loader!./Example';

import S from './Example.styl';

export default () => (
  <ComponentLayout
    name="Theme"
    code={<Code code={example} scope={{ S }} />}
    api={<TypesNavigator scope="Theme" type="Props" />}
  />
);
