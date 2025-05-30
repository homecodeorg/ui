import { Heading, Link } from 'uilib';
import { ComponentLayout } from 'docs/components';

import simple from '!!raw-loader!./Simple';
import complex from '!!raw-loader!./Complex';
import { TypesTable } from 'uilib/docs/components/TypesNavigator/TypesNavigator';

import S from './styles.styl';

const name = 'Tooltip';
const Docs = () => (
  <>
    <p>
      UI button component with customizable properties such as style, size,
      loading state, etc.{' '}
      <Link inline href="/demo">
        Demo
      </Link>
    </p>

    <Heading id="Props" text="Props" />
    <TypesTable scope={name} type="Props" />
  </>
);

export default () => (
  <ComponentLayout
    name={name}
    docs={Docs}
    examples={[
      { id: 'demo', label: 'Demo', code: simple },
      // { id: 'complex', label: 'Complex', code: complex },
    ]}
    scope={{ S }}
  />
);
