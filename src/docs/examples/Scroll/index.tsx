import { Code } from 'docs/components';

import example from '!!raw-loader!./Example';
import * as helpers from 'helpers';

export default () => <Code scope={{ helpers }} code={example} />;
