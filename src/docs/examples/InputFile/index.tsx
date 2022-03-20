import { Code } from 'docs/components';

import example from '!!raw-loader!./Example';
import { upload } from './helpers';

export default () => <Code code={example} scope={{ upload }} />;
