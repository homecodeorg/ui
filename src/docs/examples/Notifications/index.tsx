import { Heading, Link } from 'uilib';

import { ComponentLayout, TypesTable } from 'docs/components';

import example from '!!raw-loader!./Example';
import S from './Example.styl';

const name = 'Notifications';
const Docs = () => (
  <>
    <p>
      Service that allows developers to display customizable UI notifications.
    </p>
    <p>
      It exposes a NotificationsStore - interface to manage notifications. See{' '}
      <Link inline href="#Methods">
        Methods
      </Link>
      .
    </p>
    <span>
      <Link inline href="/demo">
        Demo
      </Link>
    </span>
    <Heading id="Methods" text="Methods" />
    <TypesTable scope={name} type="Methods" hideRequiredStart />
  </>
);

export default () => (
  <ComponentLayout
    name={name}
    docs={Docs}
    examples={[{ id: 'demo', label: 'Demo', code: example, scope: { S } }]}
    scope={{}}
  />
);
