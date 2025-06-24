import { Heading, Link } from 'uilib';
import { ComponentLayout, TypesTable } from 'docs/components';

import example from '!!raw-loader!./Example';

const Docs = () => (
  <>
    <p>
      A form control that allows users to make a binary choice.{' '}
      <Link inline href="/demo">
        Demo
      </Link>
    </p>

    <Heading id="props" text="Props" />
    <TypesTable scope="Toggle" type="Props" />
  </>
);

export default () => (
  <ComponentLayout
    name="Toggle"
    docs={Docs}
    examples={[{ id: 'demo', label: 'Demo', code: example }]}
  />
);
