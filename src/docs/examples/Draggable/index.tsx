import { Heading, Link } from 'uilib';
import { ComponentLayout, TypesTable } from 'docs/components';

import basic from '!!raw-loader!./Basic';

import S from './styles.styl';

const name = 'Draggable';
const examples = [{ id: 'basic', label: 'Basic', code: basic }];

const Docs = () => (
  <>
    <p>Draggable</p>

    <Link href="/basic">Demo</Link>

    {/* <Heading id="props" text="Props" /> */}
    {/* <TypesTable scope={name} type="Props" /> */}
  </>
);

export default () => (
  <ComponentLayout name={name} docs={Docs} examples={examples} scope={{ S }} />
);
