import { ComponentLayout, Code, TypesNavigator } from 'docs/components';

import example from '!!raw-loader!./Example';

export default () => (
  <ComponentLayout
    name="Form"
    code={<Code code={example} />}
    api={<TypesNavigator scope="Form" type="Props" />}
  />
);
