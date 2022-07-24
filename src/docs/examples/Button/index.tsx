import { ComponentLayout, Code, TypesNavigator } from 'docs/components';

import example from '!!raw-loader!./Example';

export default () => (
  <ComponentLayout
    name="Button"
    code={<Code code={example} />}
    api={<TypesNavigator scope="Button" type="Props" />}
  />
);
