import { Container, Router, Link } from 'uilib';

import { Code } from 'docs/components';

import { upload } from './helpers';

import UploadOnChange from '!!raw-loader!./UploadOnChange';
import UploadOnSubmit from '!!raw-loader!./UploadOnSubmit';

const rootPath = '/inputFile';

export default () => (
  <Container vertical fullWidth>
    <div>
      <Link href={`${rootPath}/onchange`}>UploadOnChange</Link>
      <Link href={`${rootPath}/onsubmit`}>UploadOnSubmit</Link>
    </div>

    <Router rootPath={rootPath}>
      <Code
        exact
        path="/onchange"
        code={UploadOnChange}
        scope={{ upload }}
        key="onchange"
      />
      <Code
        exact
        path="/onsubmit"
        code={UploadOnSubmit}
        scope={{ upload }}
        key="onsubmit"
      />
    </Router>
  </Container>
);
