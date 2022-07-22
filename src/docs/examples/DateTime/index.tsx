import { ComponentLayout, Code, ApiTable } from 'docs/components';

import moment from 'moment';

import TYPES from '../../types.json';

import example from '!!raw-loader!./Example';

export default () => (
  <ComponentLayout
    name="DateTime"
    code={<Code code={example} scope={{ moment }} />}
    api={<ApiTable types={TYPES.DateTime.Props} />}
  />
);
