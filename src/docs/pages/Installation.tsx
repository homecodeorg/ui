import { Link, H2 } from 'uilib';

import Page from '../components/Page/Page';

export default function GettingStarted() {
  return (
    <Page title="Installation">
      <p>
        Add UILIB with your favourive package manager from{' '}
        <Link href="https://www.npmjs.com/package/@foreverido/uilib">
          npmjs.com/uilib
        </Link>
        <br />
        <pre>yarn add @foreverido/uilib</pre>
        <br />
        <pre>npm i @foreverido/uilib</pre>
      </p>
      <br />
      <p>All external dependencies will be installed as requirements.</p>
    </Page>
  );
}
