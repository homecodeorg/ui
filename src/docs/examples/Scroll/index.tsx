import { ComponentLayout, Code, ApiTable } from 'docs/components';

import TYPES from '../../types.json';

import example from '!!raw-loader!./Example';
import * as helpers from 'helpers';

export default () => (
  <ComponentLayout
    name="Scroll"
    code={<Code code={example} scope={{ helpers }} />}
    api={<ApiTable types={TYPES.PopupMenu.Props} />}
  />
);
