import { Heading, Link } from 'uilib';
import { ComponentLayout, TypesTable } from 'docs/components';

import example from '!!raw-loader!./Example';

const Docs = () => (
  <>
    <p>
      Autocomplete input control with async suggestions.{' '}
      <Link inline href="/demo">
        Demo
      </Link>
    </p>

    <Heading id="props" text="Props" />
    <TypesTable scope="Autocomplete" type="Props" />
  </>
);

export default () => (
  <ComponentLayout
    name="Autocomplete"
    docs={Docs}
    examples={[{ id: 'demo', label: 'Demo', code: example }]}
  />
);
