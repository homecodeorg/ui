import { Heading, Link } from 'uilib';
import { ComponentLayout } from 'docs/components';

import single from '!!raw-loader!./Single';
import range from '!!raw-loader!./Range';
import { TypesTable } from 'uilib/docs/components/TypesNavigator/TypesNavigator';

import S from './styles.styl';

const name = 'DatePickerInput';
const Docs = () => (
  <>
    <p>
      Extends{' '}
      <Link inline href="//components/DatePicker">
        DatePicker
      </Link>{' '}
      {/* open in Popup */}
      component with{' '}
      <Link inline href="//components/Popup">
        Popup
      </Link>
      .
    </p>

    <p>
      See demo -{' '}
      <Link inline href="/single">
        single
      </Link>{' '}
      and{' '}
      <Link inline href="/range">
        range
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
