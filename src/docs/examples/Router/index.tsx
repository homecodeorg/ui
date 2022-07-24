import { ComponentLayout, Code, TypesNavigator } from 'docs/components';

import example from '!!raw-loader!./Example';

export default () => (
  <ComponentLayout
    name="Router"
    code={<Code code={example} />}
    api={<TypesNavigator scope="Router" type="Props" />}
  />
);
