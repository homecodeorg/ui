import { ComponentLayout, TypesTable } from 'docs/components';

import { Heading, Link } from 'uilib';

import example from '!!raw-loader!./Example';

const name = 'Gallery';
const Docs = () => (
  <>
    <p>
      UI component is a slideshow gallery component that displays a series of
      images or other items in a carousel-like fashion.{' '}
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
