import Code from 'helpers/Code';

import Example from '!!raw-loader!./Example';
import selectHelpers from '!!raw-loader!../helpers';

const files = {
  '/App.tsx': Example.replace("from '../helpers';", "from './selectHelpers';"),
  '/select-helpers.ts': selectHelpers,
};

console.log(files);

export default () => <Code files={files} />;
