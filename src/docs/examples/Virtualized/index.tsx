import { ComponentLayout, Code, TypesNavigator } from 'docs/components';
import { Container, Link, Router } from 'uilib';

import * as helpers from './helpers';
import S from './helpers.styl';

import Endless from '!!raw-loader!./Endless';
import EndlessScroll from '!!raw-loader!./EndlessScroll';
import Finite from '!!raw-loader!./Finite';
import FiniteScroll from '!!raw-loader!./FiniteScroll';
import InitialTotal from '!!raw-loader!./InitialTotal';
import ContentBefore from '!!raw-loader!./ContentBefore';

const rootPath = '/components/virtualized';

const Example = props => <Code scope={{ helpers, S }} {...props} />;

const Navigation = () => (
  <div>
    <div>
      native scrollbars:
      <Link href={`/endless`}>Endless</Link>
      <Link href={`/finite`}>Finite</Link>
    </div>
    <div>
      <div>
        custom scrollbars:
        <Link href={`/endless-scroll`}>Endless</Link>
        <Link href={`/finite-scroll`}>Finite</Link>
      </div>
    </div>
    <div>
      <Link href={`/initial-total`}>Initial data already total</Link>
    </div>
    <div>
      <Link href={`/content-before`}>contentBefore</Link>
    </div>
  </div>
);

export default () => {
  return (
    <ComponentLayout
      name="Virtualized"
      code={
        <Container vertical fullWidth>
          <Router rootPath={rootPath}>
            <Navigation exact path="/" />
            <Example exact path="/endless" code={Endless} key="endless" />
            <Example
              exact
              path="/endless-scroll"
              code={EndlessScroll}
              key="endless-scroll"
            />
            <Example exact path="/finite" code={Finite} key="finite" />
            <Example
              exact
              path="/finite-scroll"
              code={FiniteScroll}
              key="finite-scroll"
            />
            <Example
              exact
              path="/initial-total"
              code={InitialTotal}
              key="initial-total"
            />
            <Example
              exact
              path="/content-before"
              code={ContentBefore}
              key="content-before"
            />
          </Router>
        </Container>
      }
      api={<TypesNavigator scope="Virtualized" type="Props" />}
    />
  );
};
