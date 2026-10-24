import { Heading, Link } from 'uilib';
import { ComponentLayout, TypesTable } from 'docs/components';

import example from '!!raw-loader!./Example';
import withDialogue from '!!raw-loader!./WithDialogue';
import searchable from '!!raw-loader!./Searchable';

const name = 'NestedMenu';
const Docs = () => (
  <>
    <p>
      Controlled menu with hover/click submenus on desktop and a stacked back
      view on narrow screens.{' '}
      <Link inline href="/demo">
        Demo
      </Link>
    </p>

    <Heading id="props" text="Props" />
    <TypesTable scope={name} type="Props" />
  </>
);

export default () => (
  <ComponentLayout
    name={name}
    docs={Docs}
    examples={[
      { id: 'demo', label: 'Demo', code: example },
      { id: 'dialogue', label: 'Opens Dialogue', code: withDialogue },
      { id: 'searchable', label: 'Searchable', code: searchable },
    ]}
  />
);
