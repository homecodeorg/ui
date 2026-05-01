import { Heading, Link } from 'uilib';
import { ComponentLayout, TypesTable } from 'docs/components';

import single from '!!raw-loader!./Single';
import multiple from '!!raw-loader!./Multiple';
import ghost from '!!raw-loader!./Ghost';

const name = 'DropZone';
const examples = [
  { id: 'single', label: 'Single file', code: single },
  { id: 'multiple', label: 'Multiple', code: multiple },
  { id: 'ghost', label: 'Ghost', code: ghost },
];

const Docs = () => (
  <>
    <p>
      File drop target with optional click-to-upload. Supports{' '}
      <Link
        inline
        href="https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/accept"
      >
        accept
      </Link>{' '}
      patterns like MIME types and extensions.
    </p>

    <Heading id="props" text="Props" />
    <TypesTable scope="DropZone" type="Props" />
  </>
);

export default () => (
  <ComponentLayout name={name} docs={Docs} examples={examples} />
);
