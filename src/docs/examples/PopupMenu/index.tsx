import { ComponentLayout, Code, TypesNavigator } from 'docs/components';

import example from '!!raw-loader!./Example';

export default () => (
  <ComponentLayout
    name="PopupMenu"
    code={<Code code={example} />}
    api={<TypesNavigator scope="PopupMenu" type="Props" />}
  />
);
