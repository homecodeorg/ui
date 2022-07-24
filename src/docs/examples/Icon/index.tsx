import { ComponentLayout, Code, TypesNavigator } from 'docs/components';

import example from '!!raw-loader!./Example';

export default () => (
  <ComponentLayout
    name="Icon"
    code={<Code code={example} />}
    api={<TypesNavigator scope="Icon" type="Props" />}
  />
);
