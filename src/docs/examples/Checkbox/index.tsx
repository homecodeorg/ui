import { ComponentLayout, Code, TypesNavigator } from 'docs/components';

import example from '!!raw-loader!./Example';

export default () => (
  <ComponentLayout
    name="Checkbox"
    code={<Code code={example} />}
    api={<TypesNavigator scope="Checkbox" type="Props" />}
  />
);
