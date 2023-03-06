import { Heading, Link } from 'uilib';
import { ComponentLayout, TypesTable } from 'docs/components';

import example from '!!raw-loader!./Example';

const name = 'Table';
const examples = [{ id: 'demo', label: 'Demo', code: example }];

const testData = [
  {
    id: '1',
    name: 'John',
    lastName: 'Doe',
    age: 25,
    occupation: 'Developer',
    date: '2023-01-01',
  },
  {
    id: '2',
    name: 'Jane',
    lastName: 'Doe',
    age: 25,
    occupation: 'Developer',
    date: '2018-03-01',
  },
  {
    id: '3',
    name: 'Sam',
    lastName: 'Sung',
    age: 52,
    occupation: 'CEO',
    date: '2014-11-06',
  },
  {
    id: '4',
    name: 'Sarah',
    lastName: 'Connor',
    age: 27,
    occupation: 'Scientist',
    date: '2007-11-26',
  },
  {
    id: '5',
    name: 'Harry',
    lastName: 'Potter',
    age: 35,
    occupation: 'Wizard',
    date: '2002-11-11',
  },
  {
    id: '6',
    name: 'Frodo',
    lastName: 'Baggins',
    age: 18,
    occupation: 'unknown',
    date: '2001-06-30',
  },
];

const Docs = () => (
  <>
    <p>
      UI component that can be used to display tabular data.{' '}
      <Link href="/demo">Demo</Link>
    </p>

    <Heading id="props" text="Props" />
    <TypesTable scope={name} type="Props" />
  </>
);

export default () => (
  <ComponentLayout
    name={name}
    docs={Docs}
    examples={examples}
    scope={{ testData }}
  />
);
