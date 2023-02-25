import { Heading, Link } from 'uilib';
import { ComponentLayout, Required, TypesNavigator } from 'docs/components';

import example from '!!raw-loader!./Example';
import { TypesTable } from 'uilib/docs/components/TypesNavigator/TypesNavigator';

const Docs = () => (
  <>
    <p>
      A reusable UI button component with customizable properties such as style,
      size, loading state, etc.{' '}
      <Link inline href="/demo">
        Demo
      </Link>
    </p>

    <Heading id="props" text="Props" />
    <TypesTable scope="Button" type="Props" />
  </>
);

export default () => (
  <ComponentLayout
    name="Button"
    docs={Docs}
    examples={[{ id: 'demo', label: 'Demo', code: example }]}
    scope={{}}
  />
);
