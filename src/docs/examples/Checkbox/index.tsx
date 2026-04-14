import { Heading, Link } from 'uilib';
import { ComponentLayout, TypesTable } from 'docs/components';

import example from '!!raw-loader!./Example';
import complex from '!!raw-loader!./Complex';

import S from './styles.styl';

const Docs = () => (
  <>
    <p>
      A form control that allows users to make a binary choise.{' '}
      <Link inline href="/demo">
        Demo
      </Link>
    </p>

    <Heading id="props" text="Props" />
    <TypesTable scope="Checkbox" type="Props" />
  </>
);

export default () => (
  <ComponentLayout
    name="Checkbox"
    docs={Docs}
    examples={[
      { id: 'demo', label: 'Demo', code: example },
      { id: 'complex', label: 'Complex', code: complex },
    ]}
    scope={{ S }}
  />
);
