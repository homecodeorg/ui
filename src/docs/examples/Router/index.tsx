import { Heading, Link } from 'uilib';

import { ComponentLayout, TypesTable } from 'docs/components';

import example from '!!raw-loader!./Example';

const name = 'Router';
const Docs = () => (
  <>
    <p>
      UI component is a client-side routing solution that allows developers to
      define the routes of their web application. It works by rendering child
      components conditionally based on the current URL.
    </p>

    <span>
      <Link inline href="/demo">
        Demo
      </Link>
    </span>
    <Heading id="Props" text="Props" />
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
