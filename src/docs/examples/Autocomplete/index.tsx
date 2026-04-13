import { Heading, Link } from 'uilib';
import { ComponentLayout, TypesTable } from 'docs/components';

import exampleSimple from '!!raw-loader!./Simple';
import exampleFilterable from '!!raw-loader!./Filterable';
import exampleSelectable from '!!raw-loader!./Selectable';
import exampleExternalValueUpdate from '!!raw-loader!./ExternalValueUpdate';
import exampleControllablePopup from '!!raw-loader!./ControllablePopup';

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
      { id: 'simple', label: 'Simple', code: exampleSimple },
      { id: 'filterable', label: 'Filterable', code: exampleFilterable },
      {
        id: 'selectable',
        label: 'Selectable',
        code: exampleSelectable,
      },
      {
        id: 'external-value-update',
        label: 'External value update',
        code: exampleExternalValueUpdate,
      },
      {
        id: 'controllable-popup',
        label: 'Controllable popup',
        code: exampleControllablePopup,
      },
    ]}
  />
);
