import { ComponentLayout, TypesTable } from 'docs/components';

import { Heading, Link } from 'uilib';

import basic from '!!raw-loader!./Basic';
import grid from '!!raw-loader!./Grid';

import S from './Gallery.styl';

const name = 'Gallery';
const scope = { S };
const examples = [
  { id: 'basic', label: 'Basic', code: basic, scope },
  { id: 'grid', label: 'Grid', code: grid, scope },
];

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
  <ComponentLayout name={name} docs={Docs} examples={examples} scope={{}} />
);
