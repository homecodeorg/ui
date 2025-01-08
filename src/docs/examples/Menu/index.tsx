import { Heading, Link } from 'uilib';
import { ComponentLayout } from 'docs/components';
import { TypesTable } from 'uilib/docs/components/TypesNavigator/TypesNavigator';

import simple from '!!raw-loader!./Simple';
import nested from '!!raw-loader!./Nested';
import S from './styles.styl';

const name = 'Menu';
const Docs = () => (
  <>
    <p>
      Menu component for dropdowns, select components, and other list-based UI
      elements.{' '}
      <Link inline href="/simple">
        Simple
      </Link>{' '}
      and{' '}
      <Link inline href="/nested">
        Nested
      </Link>{' '}
      examples.
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
      { id: 'simple', label: 'Simple', code: simple },
      { id: 'nested', label: 'Nested', code: nested },
    ]}
    scope={{ S }}
  />
);
