import { Heading, Link } from 'uilib';
import { ComponentLayout } from 'docs/components';

import complex from '!!raw-loader!./Complex';
import delay from '!!raw-loader!./Delay';
import { TypesTable } from 'uilib/docs/components/TypesNavigator/TypesNavigator';

import S from './styles.styl';

const name = 'Tooltip';
const Docs = () => (
  <>
    <p>
      Shows a hint on hover or focus. Use <code>delay</code> to wait that many
      milliseconds before it appears; leaving the trigger earlier cancels it,
      and hiding is always immediate.{' '}
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
      { id: 'demo', label: 'Demo', code: complex },
      { id: 'delay', label: 'Delay', code: delay },
    ]}
    scope={{ S }}
  />
);
