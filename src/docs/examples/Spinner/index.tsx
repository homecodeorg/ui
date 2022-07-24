import { ComponentLayout, Code, TypesNavigator } from 'docs/components';

import example from '!!raw-loader!./Example';

export default () => (
  <ComponentLayout
    name="Spinner"
    code={<Code code={example} />}
    api={<TypesNavigator scope="Spinner" type="Props" />}
  />
);
