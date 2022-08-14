import { Link } from 'uilib';

import { ComponentLayout, TypesNavigator } from 'docs/components';

import { upload } from './helpers';

import single from '!!raw-loader!./Single';
import multiple from '!!raw-loader!./Multiple';
import uploadOnDemand from '!!raw-loader!./UploadOnDemand';

const examples = [
  { id: 'single', label: 'Single', content: single },
  { id: 'multiple', label: 'Multiple', content: multiple },
  {
    id: 'upload-on-demand',
    label: 'Upload on demand',
    content: uploadOnDemand,
  },
];
const Content = () => (
  <div>
    {examples.map(({ id, label }) => (
      <Link href={`/${id}`}>{label}</Link>
    ))}
  </div>
);

export default () => (
  <ComponentLayout
    name="InputFile"
    rootPath="/components/inputfile"
    documentation={Content}
    examples={examples}
    scope={{ upload }}
  />
);
