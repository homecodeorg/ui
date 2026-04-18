import { Heading, Link } from 'uilib';
import { ComponentLayout, TypesTable } from 'docs/components';

import example from '!!raw-loader!./Example';
import complex from '!!raw-loader!./Complex';

const Docs = () => (
  <>
    <p>
      A set of options where exactly one can be selected. Use{' '}
      <code>RadioGroup</code> to share name and value; use{' '}
      <code>RadioButton</code> for each option.{' '}
      <Link inline href="/demo">
        Demo
      </Link>
    </p>

    <Heading id="props-radio-group" text="RadioGroup props" />
    <TypesTable scope="RadioGroup" type="Props" />

    <Heading id="props-radio-button" text="RadioButton props" />
    <TypesTable scope="RadioButton" type="Props" />
  </>
);

export default () => (
  <ComponentLayout
    name="RadioGroup"
    docs={Docs}
    examples={[
      { id: 'demo', label: 'Demo', code: example },
      { id: 'complex', label: 'Horizontal / disabled', code: complex },
    ]}
  />
);
