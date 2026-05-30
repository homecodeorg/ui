import { Heading, Link } from 'uilib';
import { ComponentLayout, TypesTable } from 'docs/components';

import example from '!!raw-loader!./Example';

const Docs = () => (
  <>
    <p>
      Range slider for playback scrubbing and settings. Opt-in hover ghost via{' '}
      <code>showGhost</code>.{' '}
      <Link inline href="/demo">
        Demo
      </Link>
    </p>

    <Heading id="props" text="Props" />
    <TypesTable scope="Slider" type="Props" />
  </>
);

export default () => (
  <ComponentLayout
    name="Slider"
    docs={Docs}
    examples={[{ id: 'demo', label: 'Demo', code: example }]}
  />
);
