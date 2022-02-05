import Code from 'helpers/Code';

import Example from '!!raw-loader!./Example';
import selectHelpers from '!!raw-loader!../helpers';

export default () => (
  <Code
    files={{
      '/App.tsx': Example,
      '/select-helpers.ts': selectHelpers,
    }}
  />
);
