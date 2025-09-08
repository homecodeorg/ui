import { Heading } from 'uilib';
import { ComponentLayout } from 'docs/components';
import { i18n, I18N } from 'docs/config/i18n';

import simple from '!!raw-loader!./Simple';
import { TypesTable } from 'uilib/docs/components/TypesNavigator/TypesNavigator';

const name = 'i18n';
const Docs = () => (
  <>
    <p>
      Internationalization service for managing translations and language
      switching. Supports dynamic language loading and React components for
      displaying translated text.
    </p>

    <Heading id="initialization" text="Initialization" />
    <p>
      Initialize the i18n service by calling <code>init()</code> with your
      language configurations:
    </p>
    <pre>{`import { init } from 'uilib/services/i18n';

const api = init({
  en: {}, // English texts already in source code
  ua: () => import('./ua.json'), // Lazy-load Ukrainian translations
  de: { "Hello": "Hallo" }, // Direct translation object
});

// Destructure the returned API
export const { i18n, I18N, withI18N } = api;`}</pre>

    <Heading id="usage" text="Usage" />
    <p>The service provides three ways to use translations:</p>

    <h4>1. i18n Function</h4>
    <p>Use for programmatic access to translations:</p>
    <pre>{`// Basic usage
const text = i18n('Hello');

// With parameters (roddeh-i18n format)
const greeting = i18n('Hello %{name}', { name: 'John' });`}</pre>

    <h4>2. I18N Component</h4>
    <p>Use for translations in JSX:</p>
    <pre>{`// Using id prop
<I18N id="Components" />

// Using children
<I18N>Welcome</I18N>

// With parameters
<I18N id="Hello %{name}" props={{ params: { name: 'John' } }} />

// With plural forms
<I18N id="You have %{count} messages" props={{ plural: 5, params: { count: 5 } }} />

// With context
<I18N id="Submit" props={{ context: 'button' }} />`}</pre>

    <h4>3. withI18N HOC</h4>
    <p>Wrap components to re-render on language changes:</p>
    <pre>{`const MyComponent = withI18N(() => (
  <div>{i18n('Current Language')}</div>
));`}</pre>

    <Heading id="language-switching" text="Language Switching" />
    <p>Change languages using the store or LangSelector component:</p>
    <pre>{`import { store } from 'uilib/services/i18n';
import { LangSelector } from 'uilib';

// Programmatically
await store.changeLang('ua');

// With UI component
<LangSelector options={[
  { id: 'en', label: '🇬🇧' },
  { id: 'ua', label: '🇺🇦' }
]} />`}</pre>

    <Heading id="notes" text="Notes" />
    <ul>
      <li>The selected language is persisted in localStorage</li>
      <li>
        Language can be set via URL parameter: <code>?lang=ua</code>
      </li>
      <li>Translations are loaded on-demand when switching languages</li>
      <li>
        English texts can be kept in source code (no translation file needed)
      </li>
    </ul>
  </>
);

export default () => (
  <ComponentLayout
    name={name}
    docs={Docs}
    examples={[{ id: 'simple', label: 'Demo', code: simple }]}
  />
);
