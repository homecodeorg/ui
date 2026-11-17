import { Heading, Link } from 'uilib';
import { ComponentLayout, TypesTable } from 'docs/components';

import example from '!!raw-loader!./Example';
import overflow from '!!raw-loader!./Overflow';

const Docs = () => (
  <>
    <p>
      Modal dialogue with backdrop, keyboard support, and Card-based layout.{' '}
      <Link inline href="/demo">
        Demo
      </Link>
    </p>
    <p>
      The scrollable body reaches the dialogue's edges and carries the
      spacing as inner padding, so focus rings, glows and shadows of the
      content are not clipped, and long strings wrap.{' '}
      <Link inline href="/overflow">
        Overflowing content
      </Link>
    </p>

    <Heading id="props" text="Props" />
    <TypesTable scope="Dialogue" type="Props" />
  </>
);

export default () => (
  <ComponentLayout
    name="Dialogue"
    docs={Docs}
    examples={[
      { id: 'demo', label: 'Demo', code: example },
      { id: 'overflow', label: 'Overflowing content', code: overflow },
    ]}
  />
);
