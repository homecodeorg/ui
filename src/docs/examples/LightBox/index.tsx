import { ComponentLayout, Code, TypesNavigator } from 'docs/components';

import example from '!!raw-loader!./Example';

export default () => (
  <ComponentLayout
    name="LightBox"
    code={<Code code={example} />}
    api={<TypesNavigator scope="LightBox" type="Props" />}
  />
);
