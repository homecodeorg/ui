import { Heading, Link } from 'uilib';
import { ComponentLayout, TypesTable } from 'docs/components';

import example from '!!raw-loader!./Example';

import S from './styles.styl';

const Docs = () => (
  <>
    <p>
      Compact label for a filter, tag, or selected value. Click a chip to
      toggle <code>selected</code>. Pass <code>onRemove</code> to show a remove
      control, and <code>removeTooltip</code> for its tooltip.{' '}
      <Link inline href="/demo">
        Demo
      </Link>
    </p>

    <Heading id="props" text="Props" />
    <TypesTable scope="Chip" type="Props" />
  </>
);

export default () => (
  <ComponentLayout
    name="Chip"
    docs={Docs}
    examples={[{ id: 'demo', label: 'Demo', code: example }]}
    scope={{ S }}
  />
);
