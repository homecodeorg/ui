import { ComponentLayout, TypesTable } from 'docs/components';

import { Heading, Link } from 'uilib';

import example from '!!raw-loader!./Example';

const name = 'LightBox';
const Docs = () => (
  <>
    <p>
      UI component is a component that displays a modal window with some content
      when triggered.{' '}
      <span>
        <Link inline href="/demo">
          Demo
        </Link>
      </span>
    </p>
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
