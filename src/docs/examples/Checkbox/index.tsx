import { ComponentLayout, Code, ApiTable } from 'docs/components';

import TYPES from '../../types.json';

import example from '!!raw-loader!./Example';

export default () => (
  <ComponentLayout
    name="Checkbox"
    code={<Code code={example} />}
    api={<ApiTable types={TYPES.Checkbox.Props} />}
  />
);
