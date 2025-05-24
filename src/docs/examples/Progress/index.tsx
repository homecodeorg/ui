import { Heading, Link } from 'uilib';
import { ComponentLayout, TypesTable } from 'docs/components';

import example from '!!raw-loader!./Example';

const Docs = () => (
  <>
    <p>
      Circular progress component.{' '}
      <Link inline href="/demo">
        Demo
      </Link>
    </p>

    <Heading id="props" text="Props" />
    <TypesTable scope="Progress" type="Props" />
  </>
);

export default () => (
  <ComponentLayout
    name="Progress"
    docs={Docs}
    examples={[{ id: 'demo', label: 'Demo', code: example }]}
  />
);
