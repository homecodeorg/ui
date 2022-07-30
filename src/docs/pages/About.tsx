import { Link, H1, H2, H3 } from 'uilib';

import Page from '../components/Page/Page';

export default function About() {
  return (
    <Page title="About">
      <p>UILIB is a React components library for building user interfaces.</p>
      <H2>Best practices</H2>
      <H3>Tree shakable</H3>
      <p>
        It's tree-shakable. Bundled in ESM format. So your application bundle
        will increase as much as you import from UILIB.
      </p>
      <p>All external dependencies are shiped as requirements.</p>

      <H3 id="typescript">Typescript</H3>
      <p>
        There are still some issues with bundling typescript files. But every
        components/tool/helper are fully typed.
      </p>

      <H3>SSR compatible</H3>
      <p>
        The components can be used in projects with SSR enabled. Check the test
        project{' '}
        <Link inline href="https://github.com/foreverido/uilib-nextjs">
          uilib-next
        </Link>
      </p>
    </Page>
  );
}
