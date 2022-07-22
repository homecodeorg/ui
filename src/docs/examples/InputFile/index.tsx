import { Container, Router, Link } from 'uilib';

import { ComponentLayout, Code, ApiTable } from 'docs/components';

import TYPES from '../../types.json';

import { upload } from './helpers';

import single from '!!raw-loader!./Single';
import multiple from '!!raw-loader!./Multiple';
import uploadOnDemand from '!!raw-loader!./UploadOnDemand';

const rootPath = '/InputFile';
const examples = { single, multiple, uploadOnDemand };

export default () => (
  <ComponentLayout
    name="InputFile"
    code={
      <Container vertical fullWidth>
        <div>
          {Object.keys(examples).map(key => (
            <Link href={`${rootPath}/${key}`}>{key}</Link>
          ))}
        </div>

        <Router rootPath={rootPath}>
          {Object.entries(examples).map(([key, example]) => (
            <Code
              exact
              path={`/${key}`}
              code={example}
              scope={{ upload }}
              key={key}
            />
          ))}
        </Router>
      </Container>
    }
    api={<ApiTable types={TYPES.InputFile.Props} />}
  />
);
