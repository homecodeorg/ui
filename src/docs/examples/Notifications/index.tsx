import { ComponentLayout, Code, TypesNavigator } from 'docs/components';

import example from '!!raw-loader!./Example';

export default () => (
  <ComponentLayout
    name="Notifications"
    code={<Code code={example} />}
    api={<TypesNavigator scope="Notifications" type="Props" />}
  />
);
