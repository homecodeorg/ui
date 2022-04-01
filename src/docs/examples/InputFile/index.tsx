import { Container, Router, Link } from 'uilib';

import { Code } from 'docs/components';

import { upload } from './helpers';

import UploadOnChange from '!!raw-loader!./UploadOnChange';
import UploadOnDemand from '!!raw-loader!./UploadOnDemand';

const rootPath = '/inputFile';

export default () => (
  <Container vertical fullWidth>
    <div>
      <Link href={`${rootPath}/onchange`}>Upload on change</Link>
      <Link href={`${rootPath}/ondemand`}>Upload on demand</Link>
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
        path="/ondemand"
        code={UploadOnDemand}
        scope={{ upload }}
        key="ondemand"
      />
    </Router>
  </Container>
);
