import { Link, H2, H3 } from 'uilib';

import Page, { Header } from '../components/Page/Page';
import { I18N } from '../config/i18n';

export default function About() {
  return (
    <Page header={<I18N id="About" />}>
      <p>UILIB is a React components library for building user interfaces.</p>
      <H2>Best practices</H2>
      <p>
        Codebase are folows software development principles: DRY, KISS, SOLID.
      </p>

      <H3>Tree shakable</H3>
      <p>
        It's tree-shakable. Bundled in ESM format. So your application bundle
        will increase as much as you import from UILIB.
      </p>

      <H3>Typescript support</H3>
      <p>
        There are still some issues with bundling typescript files. But every
        components/tool/helper are fully typed already.
      </p>

      <H3>SSR compatible</H3>
      <p>
        The components can be used in projects with SSR enabled. Check the test
        project{' '}
        <Link inline href="https://github.com/foreverido/uilib-nextjs">
          uilib-next
        </Link>
      </p>

      <H2>Perspective</H2>
      <p>There's still a lot of work to be done to make it shine ✨</p>
      {/* <p>I will continue to describe it separately for each component.</p> */}
      <p>
        Also welcome to contact me if you have any ideas -&nbsp;
        <Link inline href="https://twitter.com/vpostol">
          Twitter
        </Link>
        ,&nbsp;
        <Link inline href="https://t.me/apostol">
          Telegram
        </Link>
        .
      </p>
    </Page>
  );
}
