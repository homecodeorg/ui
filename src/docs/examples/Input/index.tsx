import { ComponentLayout, Code, TypesNavigator } from 'docs/components';

import example from '!!raw-loader!./Example';

export default () => (
  <ComponentLayout
    name="Input"
    code={<Code code={example} />}
    api={<TypesNavigator scope="Input" type="Props" />}
  />
);
