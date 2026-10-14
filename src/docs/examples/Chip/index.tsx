import { Heading, Link } from 'uilib';
import { ComponentLayout, TypesTable } from 'docs/components';

import sizes from '!!raw-loader!./Sizes';
import interactive from '!!raw-loader!./Interactive';

import S from './styles.styl';

const Docs = () => (
  <>
    <p>
      Compact label for a filter, tag, or selected value. Chip height
      depends only on <code>size</code>. A chip reacts to hover only when{' '}
      <code>onClick</code> is passed. Pass <code>onRemove</code> to show a
      remove control, and <code>removeTooltip</code> for its tooltip.{' '}
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
    examples={[
      { id: 'sizes', label: 'Sizes', code: sizes },
      { id: 'interactive', label: 'Interactive', code: interactive },
    ]}
    scope={{ S }}
  />
);
