import { ComponentLayout, Code, TypesNavigator } from 'docs/components';

import example from '!!raw-loader!./Example';
import * as helpers from 'helpers';

export default () => (
  <ComponentLayout
    name="Scroll"
    code={<Code code={example} scope={{ helpers }} />}
    api={<TypesNavigator scope="Scroll" type="Props" />}
  />
);
