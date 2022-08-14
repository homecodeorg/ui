import moment from 'moment';
import { Heading, Link } from 'uilib';
import { ComponentLayout } from 'docs/components';

import example from '!!raw-loader!./Example';
import { TypesTable } from 'uilib/docs/components/TypesNavigator/TypesNavigator';

const name = 'DateTime';
const Docs = () => (
  <>
    <p>
      UI component is a simple component that displays a formatted date and
      time.
    </p>
    <p>
      The component uses the moment.js library to format the date and time, and
      the formatDate function takes care of formatting the date based on the
      provided props.
    </p>{' '}
    <span>
      <Link inline href="/demo">
        Demo
      </Link>
    </span>
    <Heading id="Props" text="Props" />
    <TypesTable scope={name} type="Props" />
  </>
);

export default () => (
  <ComponentLayout
    name={name}
    docs={Docs}
    examples={[{ id: 'demo', label: 'Demo', code: example, scope: { moment } }]}
    scope={{}}
  />
);
