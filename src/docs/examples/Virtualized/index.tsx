import { Code } from 'docs/components';
import { Container, Link, Router } from 'uilib';

import * as helpers from './helpers';
import S from './helpers.styl';

import Endless from '!!raw-loader!./Endless';
import EndlessScroll from '!!raw-loader!./EndlessScroll';
import Finite from '!!raw-loader!./Finite';
import FiniteScroll from '!!raw-loader!./FiniteScroll';
import InitialTotal from '!!raw-loader!./InitialTotal';
import ContentBefore from '!!raw-loader!./ContentBefore';

const rootPath = '/virtualized';

const Example = props => <Code scope={{ helpers, S }} {...props} />;

export default () => {
  return (
    <Container vertical fullWidth>
      <div>
        <div>
          native scrollbars:
          <Link href={`${rootPath}/endless`}>Endless</Link>
          <Link href={`${rootPath}/finite`}>Finite</Link>
        </div>
        <div>
          <div>
            custom scrollbars:
            <Link href={`${rootPath}/endless-scroll`}>Endless</Link>
            <Link href={`${rootPath}/finite-scroll`}>Finite</Link>
          </div>
        </div>
        <div>
          <Link href={`${rootPath}/initial-total`}>
            Initial data already total
          </Link>
        </div>
        <div>
          <Link href={`${rootPath}/content-before`}>contentBefore</Link>
        </div>
      </div>

      <Router rootPath={rootPath}>
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
  );
};
