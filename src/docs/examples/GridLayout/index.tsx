import { ComponentLayout, TypesTable } from 'docs/components';
import { Heading, Link } from 'uilib';

import S from './GridLayout.styl';
import basic from '!!raw-loader!./Basic';

const name = 'GridLayout';
const scope = { S };
const examples = [
  { id: 'basic', label: 'Default', code: basic, scope },
];

const Docs = () => (
  <>
    <p>
      Responsive CSS grid that fits as many columns as the container allows.
      Each cell keeps at least <code>colWidth</code> before wrapping.{' '}
      <Link inline href="/demo">
        Demo
      </Link>
    </p>

    <Heading id="props" text="Props" />
    <TypesTable scope={name} type="Props" />
  </>
);

export default () => (
  <ComponentLayout name={name} docs={Docs} examples={examples} />
);
