import { ComponentLayout, Code, TypesNavigator } from 'docs/components';

import moment from 'moment';

import example from '!!raw-loader!./Example';

export default () => (
  <ComponentLayout
    name="DateTime"
    code={<Code code={example} scope={{ moment }} />}
    api={<TypesNavigator scope="DateTime" type="Props" />}
  />
);
