import { Heading, Link } from 'uilib';
import { ComponentLayout } from 'docs/components';

import single from '!!raw-loader!./Single';
import range from '!!raw-loader!./Range';
import { TypesTable } from 'uilib/docs/components/TypesNavigator/TypesNavigator';

import S from './styles.styl';

const name = 'DatePicker';
const Docs = () => (
  <>
    <p>UI date picker component. </p>
    <p>
      Can be used for picking{' '}
      <Link inline href="/single">
        single date
      </Link>{' '}
      and{' '}
      <Link inline href="/range">
        range of dates
      </Link>
      .
    </p>

    <Heading id="Props" text="Props" />
    <TypesTable scope={name} type="Props" />
  </>
);

export default () => (
  <ComponentLayout
    name={name}
    docs={Docs}
    examples={[
      { id: 'single', label: 'Single', code: single },
      { id: 'range', label: 'Range', code: range },
    ]}
    scope={{ S }}
  />
);
