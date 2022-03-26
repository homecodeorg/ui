import { Code } from 'docs/components';

import example from '!!raw-loader!./Endless';
// import example from '!!raw-loader!./Example';
import * as helpers from './helpers';

export default () => <Code code={example} scope={{ helpers }} />;
