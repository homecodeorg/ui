import { Heading, Link } from 'uilib';
import { ComponentLayout, TypesTable } from 'docs/components';

import { upload } from './helpers';

import single from '!!raw-loader!./Single';
import multiple from '!!raw-loader!./Multiple';
import uploadOnDemand from '!!raw-loader!./UploadOnDemand';

const name = 'InputFile';
const examples = [
  { id: 'single', label: 'Single', code: single },
  { id: 'multiple', label: 'Multiple', code: multiple },
  {
    id: 'upload-on-demand',
    label: 'Upload on demand',
    code: uploadOnDemand,
  },
];

const Docs = () => (
  <>
    <p>Component for uploading files.</p>

    <Heading id="props" text="Props" />
    <TypesTable scope="InputFile" type="Props" />
  </>
);

export default () => (
  <ComponentLayout
    name={name}
    docs={Docs}
    examples={examples}
    scope={{ upload }}
  />
);
