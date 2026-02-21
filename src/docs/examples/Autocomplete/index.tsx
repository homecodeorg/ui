import { Heading, Link } from 'uilib';
import { ComponentLayout, TypesTable } from 'docs/components';

import exampleFilterable from '!!raw-loader!./Filterable';
import exampleSelectable from '!!raw-loader!./Selectable';

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
    examples={[
      { id: 'filterable', label: 'Filterable', code: exampleFilterable },
      {
        id: 'selectable',
        label: 'Selectable',
        code: exampleSelectable,
      },
    ]}
  />
);
