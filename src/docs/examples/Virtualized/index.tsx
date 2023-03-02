import { ComponentLayout, TypesTable } from 'docs/components';
import { Heading, Link } from 'uilib';

import * as helpers from './helpers';
import S from './helpers.styl';

import endless from '!!raw-loader!./Endless';
import endlessScroll from '!!raw-loader!./EndlessScroll';
import finite from '!!raw-loader!./Finite';
import finiteScroll from '!!raw-loader!./FiniteScroll';
import initialTotal from '!!raw-loader!./InitialTotal';
import contentBefore from '!!raw-loader!./ContentBefore';

const name = 'Virtualized';
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

const examples = [
  { id: 'endless', label: 'Endless', code: endless },
  { id: 'endlessScroll', label: 'Endless scroll', code: endlessScroll },
  { id: 'finite', label: 'Finite', code: finite },
  { id: 'finiteScroll', label: 'Finite scroll', code: finiteScroll },
  {
    id: 'initialTotal',
    label: 'Initial data total',
    code: initialTotal,
  },
  { id: 'contentBefore', label: 'Content before', code: contentBefore },
];

export default () => (
  <ComponentLayout
    name={name}
    docs={Docs}
    examples={examples}
    scope={{ helpers, S }}
  />
);
