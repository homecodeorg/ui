import { Container, Router, Link } from 'uilib';

import { ComponentLayout, Code, TypesNavigator } from 'docs/components';

import { upload } from './helpers';

import single from '!!raw-loader!./Single';
import multiple from '!!raw-loader!./Multiple';
import uploadOnDemand from '!!raw-loader!./UploadOnDemand';

const rootPath = '/components/inputfile';
const examples = { single, multiple, uploadOnDemand };

const Nav = () => (
  <div>
    {Object.keys(examples).map(key => (
      <Link href={`/${key}`}>{key}</Link>
    ))}
  </div>
);

export default () => (
  <ComponentLayout
    name="InputFile"
    code={
      <Container vertical fullWidth>
        <Router rootPath={rootPath}>
          <Nav path="/" exact />
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
    api={<TypesNavigator scope="InputFile" type="Props" />}
  />
);
