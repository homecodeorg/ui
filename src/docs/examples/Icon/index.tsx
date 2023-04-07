import { Heading, Link } from 'uilib';
import { ComponentLayout, TypesTable } from 'docs/components';

import S from './Example.styl';
import example from '!!raw-loader!./Example';

const Docs = () => (
  <>
    <p>
      Component utilize{' '}
      <Link inline href="//components/Lazy">
        Lazy
      </Link>
      -loaded SVG icons, used in other library components.
    </p>
    <span>
      <Link inline href="/demo">
        Demo
      </Link>
    </span>

    <Heading id="props" text="Props" />
    <TypesTable scope="Icon" type="Props" />
  </>
);

export default () => (
  <ComponentLayout
    name="Icon"
    docs={Docs}
    examples={[{ id: 'demo', label: 'Demo', code: example, scope: { S } }]}
  />
);
