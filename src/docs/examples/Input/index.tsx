import { Heading, Link } from 'uilib';
import { ComponentLayout, TypesTable } from 'docs/components';

import example from '!!raw-loader!./Example';

const Docs = () => (
  <>
    <p>
      Form input/textarea control.{' '}
      <Link inline href="/demo">
        Demo
      </Link>
    </p>

    <Heading id="props" text="Props" />
    <TypesTable scope="Input" type="Props" />
  </>
);

export default () => (
  <ComponentLayout
    name="Input"
    docs={Docs}
    examples={[{ id: 'demo', label: 'Demo', code: example }]}
  />
);
