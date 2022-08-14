import { Heading, Link } from 'uilib';

import { ComponentLayout, TypesTable } from 'docs/components';

import example from '!!raw-loader!./Example';

const name = 'Link';
const Docs = () => (
  <>
    <p>
      UI component is a customizable anchor element that can be used to create
      hyperlinks
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
