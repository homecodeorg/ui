import { Title, Code } from 'docs/components';

import example from '!!raw-loader!./Example';
import * as helpers from '../helpers';

export default () => (
  <>
    <Title text="Basic" />
    <Code scope={{ helpers }} code={example} />
  </>
);
