import { Heading, Link } from 'uilib';
import { ComponentLayout } from 'docs/components';

import example from '!!raw-loader!./Example';
import { TypesTable } from 'uilib/docs/components/TypesNavigator/TypesNavigator';

const name = 'PopupMenu';
const Docs = () => (
  <>
    <p>
      UI component implements menu with popup.
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
    examples={[{ id: 'demo', label: 'Demo', code: example }]}
    scope={{}}
  />
);
