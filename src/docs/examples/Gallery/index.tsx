import { ComponentLayout, Code, TypesNavigator } from 'docs/components';

import example from '!!raw-loader!./Example';

export default () => (
  <ComponentLayout
    name="Gallery"
    code={<Code code={example} />}
    api={<TypesNavigator scope="Gallery" type="Props" />}
  />
);
