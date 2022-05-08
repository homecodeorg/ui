import { Code } from 'docs/components';
import moment from 'moment';

import example from '!!raw-loader!./Example';

export default () => <Code code={example} scope={{ moment }} />;
