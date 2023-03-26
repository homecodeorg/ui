import { Link, H2 } from 'uilib';

import Page from '../components/Page/Page';
import { I18N } from '../config/i18n';

export default function Usage() {
  return (
    <Page header={<I18N id="Usage" />}>
      <p>
        There are several requirements to make UILIB usage completely clear.
      </p>

      <H2>Resets</H2>
      <p>Components styles rely on css resets:</p>
      <code>
        {`* {
  margin: 0;
  padding: 0;
  border: 0;
  outline: none;
  box-sizing: border-box;
}`}
      </code>

      <H2>Theming</H2>
      <p>Component styles relyes on default theme as css-variables.</p>
      <p>UILIB provide default theme and helpers for customization.</p>
      <p>
        See{' '}
        <Link inline href="/components/Theme">
          Theme
        </Link>{' '}
        component for details.
      </p>
    </Page>
  );
}
