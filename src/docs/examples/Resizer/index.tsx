import { Heading } from 'uilib';
import { ComponentLayout, TypesTable } from 'docs/components';

import example from '!!raw-loader!./Example';
import S from './styles.styl';

const name = 'Resizer';

const Docs = () => (
  <>
    <p>
      Split adjacent panes with a drag handle between each pair. Sizes live on
      the pane wrappers as <code>--width</code> / <code>--height</code> (in %)
      and are written to the DOM while dragging — not React state.{' '}
      <code>vertical</code> switches to a column layout and height.{' '}
      <code>rememberKey</code> persists those % sizes in localStorage.{' '}
      <code>minWidths</code> sets a min per pane: <code>20</code> /{' '}
      <code>&quot;20%&quot;</code> is percent, <code>&quot;200px&quot;</code> is
      pixels. Neighbor mins are both respected while dragging.
    </p>

    <Heading id="props" text="Props" />
    <TypesTable scope={name} type="Props" />
  </>
);

export default () => (
  <ComponentLayout
    name={name}
    docs={Docs}
    examples={[{ id: 'demo', label: 'Demo', code: example, scope: { S } }]}
  />
);
