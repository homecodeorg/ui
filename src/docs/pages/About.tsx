import { Link, H2, H3 } from 'uilib';

import Page, { Header } from '../components/Page/Page';
import { I18N, i18n } from '../config/i18n';

export default function About() {
  return (
    <Page header={<I18N id="About" />}>
      <p>
        {i18n(
          'Design system that makes building web applications with ReactJS faster and easier.'
        )}
      </p>
      <p>
        It's a collection of pre-built components, guidelines, and best
        practices that help you create high-quality user interfaces with less
        code.
      </p>

      <H2>Best practices</H2>
      <p>
        Codebase are folows software development principles: DRY, KISS, SOLID.
      </p>

      <H3>Tree shakable</H3>
      <p>
        UILIB is designed to make your web application run faster by only
        including the components that are actually used in your code. This
        reduces the amount of code that needs to be loaded, which makes your
        application load faster and run more smoothly.
      </p>

      <H3>Typescript support</H3>
      <p>
        UILIB is designed to work well with Typescript, which is a popular
        programming language that helps you write more reliable and maintainable
        code. With UILIB, you get all the benefits of Typescript, like better
        error messages and more accurate code completion, to make your
        development experience smoother and more productive.
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
      <p>
        Always welcome to contact me if you have any ideas -&nbsp;
        <Link inline href="https://twitter.com/vpostol">
          Twitter
        </Link>
        ,&nbsp;
        <Link inline href="https://t.me/apostol">
          Telegram
        </Link>
        &nbsp;or create issue/PR in{' '}
        <Link href="https://github.com/foreverido/uilib/pulls">GitHub</Link>.
      </p>
    </Page>
  );
}
